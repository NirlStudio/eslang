'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Null = $void.null
  var Type$ = $void.Type
  var Module$ = $void.Module
  var Symbol$ = $void.Symbol
  var Tuple$ = $void.Tuple
  var $Type = $.type
  var $Tuple = $.tuple
  var $Array = $.array
  var $Lambda = $.lambda
  var $Function = $.function
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
  var sharedSymbols = $void.sharedSymbols = Object.create(null)
  function sharedSymbolOf (key) {
    return sharedSymbols[key] || (sharedSymbols[key] = new Symbol$(key))
  }
  $void.sharedSymbolOf = sharedSymbolOf

  // get the correct indexer for an entity.
  function indexerOf (entity) {
    return typeof entity === 'undefined' || entity === null ? Null[':']
      : typeof entity === 'function' ? (entity.type || $Function).proto[':']
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

  function thisCall (subject, methodName) {
    var method = indexerOf(subject).call(subject, methodName)
    var args = arguments.length < 3 ? []
      : Array.prototype.slice.call(arguments, 2)
    return typeof method === 'function' ? method.apply(subject, args) : method
  }
  $void.thisCall = thisCall

  // to test if an entity can be named and exported.
  function isFormal (entity) {
    return typeof entity === 'function' || // a function,
      (entity instanceof Type$) || // a type,
      (entity instanceof Module$) // or a module
  }

  // TODO: all the namiing limitation will be removed later.
  var staticObjectFields = Object.create(null)
  $void.staticObjectFields = Object.assign(staticObjectFields, {
    ':': 1,
    'type': 1,
    'to-code': 1
  })

  $void.staticClassFields = Object.assign(Object.create(staticObjectFields), {
    'super': 1,
    'of': 1,
    'empty': 1
  })

// to export an entity to a module.
  $void.export = function $export (space, name, entity) {
    publish(space, name, entity)
    if (isFormal(entity) &&
      !Object.prototype.hasOwnProperty.call(entity, 'module')) {
      // the public name overrides the inner name.
      publish(entity, 'name', name)
      // An exported entity is aware of its module.
      define(entity, 'module', space['-module'] || null)
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
        var apply = Function.prototype.apply.bind(entity)
        negate = function () {
          var result = apply(this, arguments)
          return typeof result === 'boolean' ? !result : result
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
      return t === type || (t instanceof Type$ && isPrototypeOf(t, type))
    }, 'is-not-a')
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
    return link(proto, ':', function (name, value) {
      return this === proto ? protoIndexer.call(proto, name, value) // forwarding
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
              ? typeof this[name] === 'undefined' ? null : this[name]
              : typeof proto[name] === 'undefined' ? null : proto[name]
    }
  }

  // override a native type's proto indexer and inject the instance indexer
  // to native prototype.
  var noFields = Object.create(null)
  $void.nativeIndexer = function nativeIndexer (type, nativeType, typeId, fieldsOrIndexer) {
    var indexer = typeof fieldsOrIndexer === 'function' ? fieldsOrIndexer
      : createIntanceIndexer(type, nativeType, typeId, fieldsOrIndexer || noFields)

    var proto = type.proto
    var protoIndexer = createProtoIndexer(type)

    // inject the instance indexer
    define(nativeType.prototype, ':', indexer)
    // create the indexer to serve both proto and instances.
    return link(proto, ':', function (name, value) {
      return this === proto ? protoIndexer.call(proto, name, value)
        // most invocations will go to the injected version directly.
        // here is to keep the logic consistent.
        : indexer.call(this, name, value)
    })
  }

  $void.prepareOperation = function prepareOperation (type, code) {
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

    if (code) {
      link(proto, 'to-code', function (ctx) {
        if (typeof this !== 'function') {
          return null
        }
        if (this.module) {
          if (this.module.uri === '$') {
            return sharedSymbolOf(this.name) // exported as a global lambda
          }
          var mod = thisCall(this.module, 'to-code', ctx)
          if (mod) { // as a public member of a module
            // pass name as string to ensure getting instead of calling.
            return $Tuple.of(mod, this.name)
          }
        }
        if (this.code instanceof Tuple$) {
          // allow to be reused in encoding
          if (ctx instanceof CodingContext$) {
            ctx.touch(this, type)
            return ctx.complete(this, this.code)
          }
          return this.code // no encoding context.
        }
        return code // returns the empty placeholder for native function.
      })
    }

    // Indexer: no injection of indexer into Function.prototype
    var protoIndexer = createProtoIndexer(type)
    link(proto, ':', function (index, value) {
      if (typeof this !== 'function') {
        return this === proto ? protoIndexer(index, value) : null
      }
      if (typeof index === 'string') {
        return index === ':' ? null
          : index === 'type' ? type // fake field
            : index === 'name' ? this.name || ('?' + type.name)
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
    this.counter = -1
    this.symbol = null
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
      var ref = record[0] = new Tuple$([this.symbol, this.counter]) // (_ i)
      // check if it's the first variable.
      if (this.code.length < 1) {
        this.symbol = $Symbol.of('_') // use an array as a cache.
        this.codeBlock = [ // function body: (var _ (@))
          $Symbol.var, this.symbol, $Tuple.array
        ]
        this.code = [ // instant function call: (=():() ...)
          $Symbol.lambda, $Tuple.empty, $Symbol.pairing, $Tuple.empty,
          new Tuple$(this.codeBlock, true)
        ]
      }
      // push local variable
      if (record[1]) {
        var code = record[1]
        if (code instanceof Tuple$) { // for safety.
          // change declaration to a reference.
          var tmp = new Tuple$(code.$)
          code.$ = ref.$
          code = tmp
        }
        this.codeBlock.push( // (_ i (...))
          $Tuple.of(this.symbol, this.counter, code))
      } else {
        this.codeBlock.push($Tuple.of(this.symbol, this.counter, // (_ i ...
          type === $Object ? $Tuple.object // (@:)
            : type === $Array ? $Tuple.array // (@)
              : $Tuple.of($Symbol.object, $Symbol.pairing, type['to-code']()) // (@:type)
        ))
      }
      return ref
    },
    isReferred: function (obj) {
      var record = this.map.get(obj)
      return record && record[0]
    },
    complete: function (obj, code) {
      var record = this.map.get(obj)
      var ref = record[0]
      if (ref) { // reused already, e.g. a nest reference.
        // updating: ((_ i) = (...))
        this.codeBlock.push($Tuple.of(ref, sharedSymbolOf('='), code))
      } else { // save it for possible future reference.
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
    writable: true,
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
