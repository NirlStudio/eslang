'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Null = $void.null
  var Type$ = $void.Type
  var Module$ = $void.Module
  var Symbol$ = $void.Symbol
  var Integer$ = $void.Integer
  var Tuple$ = $void.Tuple
  var $Type = $.type
  var $Tuple = $.tuple
  var $Array = $.array
  var $Lambda = $.lambda
  var $Object = $.object
  var $Symbol = $.symbol
  var Prototype = $Type.proto
  var ObjectType$ = $void.ObjectType

  // a static version of isPrototypeOf.
  var isPrototypeOf = Function.prototype.call.bind(Object.prototype.isPrototypeOf)
  $void.isPrototypeOf = isPrototypeOf

  // a static version of hasOwnProperty.
  var ownsProperty = Function.prototype.call.bind(
    Object.prototype.hasOwnProperty
  )
  $void.ownsProperty = ownsProperty

  // to retrieve or create a shared symbol.
  var SpecialSymbol = $void.SpecialSymbol = /^[(`@:"#,)'$;]{1}$/
  var InvalidSymbol = $void.InvalidSymbol = /[(`@:"#,)'$;\\\s]/
  var sharedSymbols = $void.sharedSymbols = Object.create(null)
  function sharedSymbolOf (key) {
    return sharedSymbols[key] || (sharedSymbols[key] = new Symbol$(
      typeof key === 'string' &&
        (SpecialSymbol.test(key) || !InvalidSymbol.test(key)) ? key : ''))
  }
  $void.sharedSymbolOf = sharedSymbolOf

  // cached small integer values
  var integerMax = new Integer$(Number.MAX_SAFE_INTEGER)
  var integerMin = new Integer$(Number.MIN_SAFE_INTEGER)
  var integerValues = []
  for (var i = 0; i < 256; i++) {
    integerValues.push(new Integer$(i))
  }
  $void.integerOf = function (value) {
    return typeof value !== 'number' || isNaN(value) ? integerValues[0]
      : value >= Number.MAX_SAFE_INTEGER ? integerMax
        : value <= Number.MIN_SAFE_INTEGER ? integerMin
          : value >= 0 && value < 256 ? integerValues[Math.trunc(value)]
            : new Integer$(Math.trunc(value))
  }

  // get the correct indexer for an entity.
  function indexerOf (entity) {
    return typeof entity === 'undefined' || entity === null ? Null[':']
      : typeof entity === 'function' ? (entity.type || $Lambda).proto[':']
        : typeof entity[':'] === 'function' ? entity[':'] // managed (unsafe for native entities)
          : typeof entity === 'object' ? $Object // native object created from null
            : Null[':'] // unknown native type
  }
  $void.indexerOf = indexerOf

  // get the correct type for an entity.
  // note: in JS-based implementation, typeOf is basd on indexerOf. but in other
  //  implementations, the reversed pattern may be more effecient.
  function typeOf (entity) {
    return typeof entity === 'undefined' || entity === null ? Null
      : typeof entity === 'function' ? entity.type || $Lambda
        : indexerOf(entity).call(entity, 'type')
  }
  $void.typeOf = typeOf

  function encodingTypeOf (type) {
    if (!(type instanceof ObjectType$) || type === $Object) {
      return $Object
    }
    var typeCode = type['to-code']()
    while (!typeCode && type) {
      // type downgrading
      type = Object.getPrototypeOf(type)
      typeCode = type['to-code']()
    }
    return typeCode && type ? type : $Object
  }
  $void.encodingTypeOf = encodingTypeOf

  $void.thisCall = function thisCall (subject, methodName, args) {
    var method = indexerOf(subject).call(subject, methodName)
    return typeof method === 'function' ? method.apply(subject, args) : method
  }

  // to test if an entity can be named and exported.
  function isFormal (entity) {
    return typeof entity === 'function' || // a function,
      (entity instanceof Type$) || // a type,
      (entity instanceof Module$) // or a module
  }

  // to export an entity to a module.
  $void.export = function $export (mod, name, entity) {
    publish(mod, name, entity)
    if (isFormal(entity) &&
      !Object.prototype.hasOwnProperty.call(entity, 'module')) {
      // the public name overrides the inner name.
      publish(entity, 'name', name)
      // An exported entity is aware of its module.
      define(entity, 'module', mod === $ ? null : mod)
    }
    return entity
  }

  // to link an entity to its owner.
  function link (owner, names, entity, negativeNames, negate) {
    if (typeof names === 'string') {
      publish(owner, names, entity)
      if (isFormal(entity) && !entity.name) {
        publish(entity, 'name', names)
      }
    } else {
      if (isFormal(entity) && !entity.name) {
        publish(entity, 'name', names[0])
      }
      names.forEach(function (name) {
        publish(owner, name, entity)
      })
    }
    if (negativeNames) {
      if (!negate) {
        var call = Function.prototype.call.bind(entity)
        negate = function () {
          var result = call(this, arguments)
          typeof result === 'boolean' ? !result : result
        }
      }
      if (typeof negativeNames === 'string') {
        publish(negate, 'name', negativeNames)
        publish(owner, negativeNames, negate)
      } else {
        publish(negate, 'name', negativeNames[0])
        negativeNames.forEach(function (name) {
          publish(owner, name, negate)
        })
      }
    }
    return entity
  }
  $void.link = link

  // to export native type (static) methods.
  $void.copyType = function $copyType (type, src, mapping) {
    return copy(type, src, mapping,
      function $copyType$Wrapper (name, func) {
        var wrapper = function () {
          return func.apply(src, arguments)
        }
        publish(wrapper, 'name', type.name + '$' + name)
        return wrapper
      }
    )
  }

  // to export native prototype (instance) methods.
  $void.copyProto = function $copyProto (type, src, verifier, mapping) {
    return copy(type.proto, src.prototype, mapping,
      function $copyProto$Wrapper (name, method) {
        var wrapper = function () {
          return (typeof verifier === 'string'
            ? typeof this === verifier : verifier(this))
              ? method.apply(this, arguments) : null
        }
        publish(wrapper, 'name', type.name + '$$' + name)
        return wrapper
      }
    )
  }

  // override type verification methods.
  function typeVerifier (type) {
    var proto = type.proto
    link(proto, 'is-a', function (t) {
      return t === type || (isPrototypeOf($Type, t) &&
        isPrototypeOf(t, type) && ownsProperty(t, 'proto'))
    }, 'is-not-a', function (t) {
      return t !== type && (!isPrototypeOf($Type, t) ||
        !isPrototypeOf(t, type) || !ownsProperty(t, 'proto'))
    })
  }
  $void.typeVerifier = typeVerifier

  // override a type's indexer.
  function typeIndexer (type) {
    return link(type, ':', function (name, value) {
      return typeof name !== 'string' || name === ':' ? null
        : name === 'type' ? $Type // all types are type.
          : typeof value === 'undefined' // getting
            ? typeof type[name] === 'undefined' ? null : type[name]
            : typeof type[name] !== 'undefined' ? type[name] // no overriding
              : (type[name] = value) // extending is allowed
    })
  }
  $void.typeIndexer = typeIndexer

  function createProtoIndexer (type) {
    var proto = type.proto
    return function (name, value) {
      return typeof name !== 'string' || name === ':' ? null
        : name === 'type' ? $Type.proto // all types are type.
          : typeof value === 'undefined' // getting
            // the behaviour of all protos are defind by the supreme prototype.
            ? typeof Prototype[name] === 'undefined' ? null : Prototype[name]
            : typeof proto[name] !== 'undefined' ? proto[name] // no overriding
              : (proto[name] = value) // extending is allowed
    }
  }
  $void.createProtoIndexer = createProtoIndexer

  // override a managed type's proto indexer.
  $void.managedIndexer = function managedIndexer (type, typeConstructor, fields) {
    var proto = type.proto
    var protoIndexer = createProtoIndexer(type)
    if (typeof fields !== 'object') {
      fields = null
    }
    // default readonly indexer for managed static values.
    return link(type, ':', function (name, value) {
      return this === proto ? protoIndexer(name, value) // forwarding
        : typeof name !== 'string' || name === ':' ? null
          : name === 'type' ? type // fake field
            : this instanceof typeConstructor
              ? fields[name] === 1 // instance fields
                ? typeof this[name] === 'undefined' ? null : this[name]
                : typeof proto[name] === 'undefined' ? null : proto[name]
              : null // invalid instance type
    })
  }

  function createIntanceIndexer (type, nativeType, typeId, fields) {
    var proto = type.proto
    return function (name, value) {
      return typeof name !== 'string' || name === ':' ? null
        : name === 'type' ? type // fake field
          : typeof this !== typeId && !(this instanceof typeId) ? null // not-matched type.
            : fields[name] === 1
              ? typeof proto[name] === 'undefined' ? null : proto[name]
              : typeof this[name] === 'undefined' ? null : this[name]
    }
  }

  // override a native type's proto indexer and inject the instance indexer
  // to native prototype.
  $void.nativeIndexer = function nativeIndexer (type, nativeType, typeId, fieldsOrIndexer) {
    var indexer = typeof fieldsOrIndexer === 'function' ? fieldsOrIndexer
      : createIntanceIndexer(type, nativeType, typeId, fieldsOrIndexer || null)

    var proto = type.proto
    var protoIndexer = createProtoIndexer(type)

    // inject the instance indexer
    define(nativeType.prototype, ':', indexer)
    // create the indexer to serve both proto and instances.
    return link(type, ':', function (name, value) {
      return this === proto ? protoIndexer(name, value)
        // most invocations will go to the injected version directly.
        // here is to keep the logic consistent.
        : indexer(name, value)
    })
  }

  $void.prepareOperation = function prepareOperation (type) {
    var proto = type.proto

    // override indexer for the operation type.
    typeIndexer(type)

    // type verification for operation instances.
    typeVerifier(type)

    // test if the operation is a generic one.
    link(proto, 'is-generic', function () {
      return typeof this !== 'function' ? null
        : !(this.code instanceof Tuple$ && this.code.$[2])
    }, 'not-generic', function () {
      return typeof this !== 'function' ? null
        : this.code instanceof Tuple$ && this.code.$[2]
    })

    // Emptiness: a managed operation without a body.
    link(proto, 'is-empty', function () {
      return typeof this !== 'function' ? null
        : this.code instanceof Tuple$ && this.code.$[2] && this.code.$[2].$.length < 1
    }, 'not-empty', function () {
      return typeof this !== 'function' ? null
        : !(this.code instanceof Tuple$ && this.code.$[2] && this.code.$[2].$.length < 1)
    })

    // Indexer: no injection of indexer into Function.prototype
    var protoIndexer = createProtoIndexer(type)
    link(proto, ':', function (index, value) {
      if (typeof this !== 'function') {
        return this === proto ? protoIndexer(index, value) : null
      }
      if (typeof index === 'string') {
        return index === ':' ? null
          : index === 'type' ? type // fake field
            : index === 'name' ? this.name || '?lambda'
              : typeof proto[index] !== 'undefined' ? proto[index]
                : !(this.code instanceof Tuple$) ? null
                  : index === 'parameters' ? this.code.$[1]
                    : index === 'body' ? this.code.$[2] : null
      }
    })
  }

  $void.CodingContext = CodingContext$
  function CodingContext$ () {
    this.map = new Map()
    this.code = []
    this.counter = 0
  }
  CodingContext$.prototype = {
    touch: function (obj, type) {
      if (!this.map.has(obj)) {
        this.map.set(obj, [null, null])
        return null // new object
      }
      // occur more than once
      var record = this.map.get(obj)
      if (record[0]) {
        return record[0] // has been allocated a key.
      }
      // allocate a new key
      this.counter += 1
      var sym = record[0] = $Symbol.of('X' + this.counter)
      // check if it's the first variable.
      if (this.code.length < 1) {
        this.codeBlock = [] // function body
        // instant function call: (=():() ...)
        this.code.push($Symbol.lambda, $Tuple.empty, $Symbol.pairing, $Tuple.empty,
          new Tuple$(this.codeBlock, true))
      }
      // push local variable
      if (record[1]) {
        var code = record[1]
        if (code instanceof Tuple$) {
          var tmp = new Tuple$(code.$, code.plain)
          code.$ = [sym]; code.plain = true // skip parentheses.
          code = tmp
        }
        this.codeBlock.push($Tuple.of($Symbol.var, sym, code))
      } else {
        this.codeBlock.push($Tuple.of($Symbol.var, sym, // (var key ...
          type === $Object ? $Tuple.object // (@:)
            : type === $Array ? $Tuple.array // (@)
              : $Tuple.of($Symbol.object, $Symbol.pairing, type['to-code']()) // (@:type)
        ))
      }
      return sym
    },
    complete: function (obj, code) {
      var record = this.map.get(obj)
      var sym = record[0]
      if (sym) { // reused already, e.g. a nest reference.
        this.codeBlock.push($Tuple.of(sym, sharedSymbolOf('+='), code))
      } else { // save it for potential being referenced again later.
        record[1] = code
      }
      return code
    },
    final: function (code) {
      return this.code.length > 0 ? new Tuple$(this.code) : code
    }
  }
}

// Publish a value to its owner by a key.
function publish (owner, key, value) {
  Object.defineProperty(owner, key, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: value
  })
}

// Define a value as a property of an entity.
function define (entity, prop, value) {
  Object.defineProperty(entity, prop, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: value
  })
}

// export native entities to its managed owners.
function copy (target, src, mapping, wrapper) {
  Object.getOwnPropertyNames(mapping).forEach(function copy$map (name) {
    var value = src[name]
    if (typeof value === 'undefined') {
      console.warn(src, 'missing required property:', name)
      return
    }
    name = mapping[name]
    if (typeof value === 'function') {
      value = wrapper(name, value)
    }
    publish(target, name, value)
  })
  return target
}
