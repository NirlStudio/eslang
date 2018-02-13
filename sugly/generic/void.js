'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Null = $void.null
  var Type$ = $void.Type
  var Object$ = $void.Object
  var Symbol$ = $void.Symbol
  var Tuple$ = $void.Tuple
  var $Lambda = $.lambda
  var $Object = $.object

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

  // retrieve the system indexer of an entity.
  var indexerOf = $void.indexerOf = $['indexer-of'] = function (entity) {
    if (typeof entity === 'undefined' || entity === null) {
      return Null[':']
    }
    if (typeof entity === 'object') {
      return entity instanceof Object$
        ? $Object.proto[':'] // always return the generic indexer for all managed objects.
        : entity instanceof Type$ ? entity[':'] // managed types, type.proto and values.
          : entity.type instanceof Type$ ? entity.type.proto[':'] // injected types
            : $Object.proto[':'] // take other native objects as common objects.
    }
    // boolean, string, number, function and other unknow native entities
    return typeof entity === 'function'
      ? entity.type.proto[':'] // use the owned or injected type.
      : entity.type instanceof Type$ // with a valid injected type
        ? entity.type.proto[':'] // use the type's indexer
        : Null[':'] // take other unknown entities as null.
  }
  define(indexerOf, 'name', 'indexer-of')

  // retrieve the real type of an entity.
  var typeOf = $void.typeOf = $['type-of'] = function (entity) {
    if (typeof entity === 'undefined' || entity === null) {
      return null // the type of null is itself.
    }
    if (typeof entity === 'object') {
      var type = ownsProperty(entity, 'type') // if the object owns a type field,
        ? Object.getPrototypeOf(entity).type // use its prototype's type,
        : entity.type // otherwise try to use the type property directly.
      return type instanceof Type$ ? type : $Object
    }
    // bool, string, number, function and other unknonwn native entities.
    return entity.type instanceof Type$ ? entity.type : null
  }
  define(typeOf, 'name', 'type-of')

  function thisCall (subject, methodName) {
    var method = indexerOf(subject).call(subject, methodName)
    return typeof method !== 'function' ? method : method.apply(subject,
      arguments.length < 3 ? [] : Array.prototype.slice.call(arguments, 2)
    )
  }
  $void.thisCall = thisCall

  // to test if an entity can be named and exported.
  function isFormal (entity) {
    return typeof entity === 'function' || entity instanceof Type$
  }

// to export an entity to a module.
  $void.export = function $export (space, name, entity) {
    publish(space, name, entity)
    if (isFormal(entity) && typeof entity.name === 'undefined') {
      // the public name overrides the inner name.
      publish(entity, 'name', name)
    }
    return entity
  }

  // to link an entity to its owner.
  function link (owner, names, entity, negativeNames, negate) {
    if (typeof entity === 'function' && !entity.type) {
      entity.type = $Lambda
    }
    if (typeof negate === 'function' && !negate.type) {
      negate.type = $Lambda
    }
    if (typeof names === 'string') {
      publish(owner, names, entity)
      if (isFormal(entity) && !entity.name) {
        publish(entity, 'name', names)
      }
    } else {
      if (isFormal(entity) && !entity.name) {
        publish(entity, 'name', names[0])
      }
      for (var i = 0; i < names.length; i++) {
        publish(owner, names[i], entity)
      }
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
        for (var j = 0; j < negativeNames.length; j++) {
          publish(owner, negativeNames[j], negate)
        }
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
          return verifier(this) ? method.apply(this, arguments) : null
        }
        publish(wrapper, 'name', type.name + '$$' + name)
        return wrapper
      }
    )
  }

  // override type verification methods.
  function typeEncoder (type) {
    var name = type.name
    var symbol = sharedSymbolOf(name)
    link(type, 'to-code', function () {
      return symbol
    })
    link(type, 'to-string', function () {
      return name
    })
  }
  $void.typeEncoder = typeEncoder

  // override a type's indexer.
  function typeIndexer (type) {
    return link(type, ':', function (name, value) {
      if (name instanceof Symbol$) {
        name = name.key
      }
      return typeof name !== 'string' ? null
        : typeof value === 'undefined' ? type[name]
          : typeof type[name] !== 'undefined' ? type[name] // no overriding
            : (type[name] = value) // extending is allowed
    })
  }
  $void.typeIndexer = typeIndexer

  // override type verification methods.
  function typeVerifier (type) {
    var proto = type.proto
    link(proto, 'is-a', function (t) {
      return t === type
    }, 'is-not-a', function (t) {
      return t !== type
    })
  }
  $void.typeVerifier = typeVerifier

  function protoIndexer (type, fieldsOrIndexer) {
    var proto = type.proto
    return link(proto, ':', typeof fieldsOrIndexer === 'object' ? function (name, value) {
      if (name instanceof Symbol$) {
        name = name.key
      }
      return typeof name !== 'string' ? null
        : this !== proto
          ? fieldsOrIndexer[name] ? this[fieldsOrIndexer[name]] // readonly fields
            : proto[name] // inherited property.
          : typeof value === 'undefined'
            ? proto[name] // getting
            : typeof proto[name] !== 'undefined' ? proto[name] // no overriding
              : (proto[name] = value) // extending is allowed
    } : typeof fieldsOrIndexer === 'function' ? function (name, value) {
      if (name instanceof Symbol$) {
        name = name.key
      }
      return this !== proto
        ? fieldsOrIndexer.apply(this, arguments) // forward arguments to instance indexer
        : typeof name !== 'string' ? null
          : typeof value === 'undefined'
            ? proto[name] // getting
            : typeof proto[name] !== 'undefined' ? proto[name] // no overriding
              : (proto[name] = value) // extending is allowed
    } : function (name, value) {
      if (name instanceof Symbol$) {
        name = name.key
      }
      return typeof name !== 'string' ? null
        : this !== proto
          ? typeof proto[name] === 'undefined' ? null : proto[name] // readonly
          : typeof value === 'undefined'
            ? proto[name] // getting
            : typeof proto[name] !== 'undefined' ? proto[name] // no overriding
              : (proto[name] = value) // extending is allowed
    })
  }
  $void.protoIndexer = protoIndexer

  $void.initializeType = function initializeType (type, emptyValue) {
    // an empty value or empty value generator function.
    link(type, 'empty', emptyValue)
    // to-code & to-string
    typeEncoder(type)
    // type indexer
    typeIndexer(type)
    // is-a & is-not-a
    typeVerifier(type)
    return emptyValue
  }

  $void.prepareOperation = function prepareOperation (type, emptyCode) {
    // to-code & to-string
    typeEncoder(type)

    // override indexer for the operation type.
    typeIndexer(type)

    var proto = type.proto
    // test if the operation is a generic one.
    link(proto, 'is-generic', function () {
      return typeof this !== 'function' ? null
        : !this.code || !(this.code instanceof Tuple$)
    }, 'not-generic', function () {
      return typeof this !== 'function' ? null
        : this.code instanceof Tuple$
    })

    // Emptiness: a managed operation without a body.
    link(proto, 'is-empty', function () {
      return typeof this !== 'function' ? null
        : this.code instanceof Tuple$ && (
          this.code.$.length < 3 || this.code.$[2].$.length < 1
        )
    }, 'not-empty', function () {
      return typeof this !== 'function' ? null
        : !(this.code instanceof Tuple$) || (
          this.code.$.length > 2 && this.code.$[2].$.length > 0
        )
    })

    link(proto, 'to-code', function (ctx) {
      return typeof this === 'function'
        ? this.code instanceof Tuple$ ? this.code : emptyCode
        : null
    })

    // Indexer: no injection of indexer into Function.prototype
    protoIndexer(type, function (index, value) {
      return typeof this !== 'function' || typeof index !== 'string' ? null
        : index === 'type' ? type // fake field
          : index === 'name' ? this.name || ''
            : index === 'parameters' ? (this.code || emptyCode).$[1]
              : index === 'body' ? (this.code || emptyCode).$[2]
                : proto[index]
    })
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
  var names = Object.getOwnPropertyNames(mapping)
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
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
  }
  return target
}
