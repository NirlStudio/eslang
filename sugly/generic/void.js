'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Null = $void.null
  var Type$ = $void.Type
  var Symbol$ = $void.Symbol
  var Tuple$ = $void.Tuple
  var $Lambda = $.lambda

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
  $void.sharedSymbolOf = function (key) {
    return sharedSymbols[key] || (sharedSymbols[key] = new Symbol$(key))
  }

  // retrieve the system indexer of an entity.
  var indexerOf = $void.indexerOf = function (entity) {
    return typeof entity === 'undefined' || entity === null
      ? Null[':'] : (entity.type && entity.type.proto[':']) || Null[':']
  }

  function thisCall (subject, methodName) {
    var method = indexerOf(subject).call(subject, methodName)
    return typeof method !== 'function' ? method
      : arguments.length < 3 ? method.call(subject)
        : method.apply(subject, Array.prototype.slice.call(arguments, 2))
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
  $void.copyType = function (target, src, mapping) {
    var names = Object.getOwnPropertyNames(mapping)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      publish(target, mapping[name], src[name])
    }
    return target
  }

  $void.prepareOperation = function prepareOperation (type, emptyCode) {
    var proto = type.proto
    // return function's name
    link(proto, 'name', function () {
      return this.name
    })

    // test if the operation is a generic one.
    link(proto, 'is-generic', function () {
      return !(this.code instanceof Tuple$)
    }, 'not-generic', function () {
      return this.code instanceof Tuple$
    })

    // Emptiness: a managed operation without a body.
    link(proto, 'is-empty', function () {
      return this.code instanceof Tuple$ &&
          (this.code.$.length < 3 || this.code.$[2].$.length < 1)
    }, 'not-empty', function () {
      return !(this.code instanceof Tuple$) ||
          (this.code.$.length > 2 && this.code.$[2].$.length > 0)
    })

    // Encoding
    link(proto, 'to-code', function (ctx) {
      return this.code instanceof Tuple$ ? this.code : emptyCode
    })

    // Indexer
    link(proto, ':', function (index) {
      return typeof index === 'string' ? proto[index]
        : index instanceof Symbol$ ? proto[index.key] : null
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
