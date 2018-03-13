'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Lambda = $.lambda
  var objectProto = $.object.proto
  var Null = $void.null
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType

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
    var proto
    try {
      return typeof entity === 'undefined' || entity === null ? Null[':']
        : typeof entity !== 'object' || !ownsProperty(entity, 'type') ? entity.type.proto[':']
          : (proto = Object.getPrototypeOf(entity)) ? proto[':'] : objectProto[':']
    } catch (err) {
      return typeof entity === 'object' ? objectProto[':'] : Null[':']
    }
  }

  function thisCall (subject, methodName) {
    var method = indexerOf(subject).call(subject, methodName)
    return typeof method !== 'function' ? method
      : arguments.length < 3 ? method.call(subject)
        : method.apply(subject, Array.prototype.slice.call(arguments, 2))
  }
  $void.thisCall = thisCall

  // try to update the name of a function or a class.
  var tryToUpdateName = $void.tryToUpdateName = function (entity, name) {
    if (typeof entity === 'function') {
      if (!entity.$name) {
        entity.$name = name
      }
    } else if (entity instanceof ClassType$) {
      if (!entity.name) {
        entity.name = name
      }
    }
    return entity
  }

  // to export an entity to a space.
  $void.export = function (space, name, entity) {
    space[name] = entity
    return tryToUpdateName(entity, name)
  }

  // to link an entity to its owner.
  function link (owner, names, entity) {
    if (typeof entity === 'function' && !ownsProperty(entity, 'type')) {
      entity.type = $Lambda
      if (!entity.$name) {
        entity.$name = typeof names === 'string' ? names : names[0]
      }
    }
    if (typeof names === 'string') {
      owner[names] = entity
    } else {
      for (var i = 0; i < names.length; i++) {
        owner[names[i]] = entity
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
      var func = target[mapping[name]] = src[name]
      if (typeof func === 'function' && !func.$name) {
        func.$name = mapping[name]
      }
    }
    return target
  }

  $void.prepareOperation = function prepareOperation (type, emptyCode) {
    var proto = type.proto
    // return operation's name
    link(proto, 'name', function () {
      return this.$name
    })

    // return operation's parameters
    link(proto, 'parameters', function () {
      return (this.code || emptyCode)[1]
    })

    // return operation's body
    link(proto, 'body', function () {
      return (this.code || emptyCode)[2]
    })

    // test if the operation is a generic one.
    link(proto, 'is-generic', function () {
      return !(this.code instanceof Tuple$)
    })
    link(proto, 'not-generic', function () {
      return this.code instanceof Tuple$
    })

    // Emptiness: a managed operation without a body.
    link(proto, 'is-empty', function () {
      return this.code instanceof Tuple$ &&
          (this.code.$.length < 3 || this.code.$[2].$.length < 1)
    })
    link(proto, 'not-empty', function () {
      return !(this.code instanceof Tuple$) ||
          (this.code.$.length > 2 && this.code.$[2].$.length > 0)
    })

    // Encoding
    link(proto, 'to-code', function (ctx) {
      return this.code || emptyCode
    })

    // Indexer
    link(proto, ':', function (index) {
      return typeof index === 'string' ? proto[index]
        : index instanceof Symbol$ ? proto[index.key] : null
    })
  }
}
