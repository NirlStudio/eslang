'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.class
  var $Tuple = $.tuple
  var link = $void.link
  var Object$ = $void.Object
  var typeOf = $void.typeOf
  var thisCall = $void.thisCall
  var ClassType$ = $void.ClassType
  var createType = $void.createType
  var typeIndexer = $void.typeIndexer
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticClassFields = $void.staticClassFields
  var staticObjectFields = $void.staticObjectFields

  // define a new class.
  link(Type, 'of', function (parent, type, proto) {
    // ignore parent if it's not a class.
    var class_ = createType(parent instanceof ClassType$ ? parent : Type)
    var proto_ = class_.proto

    // update type properties
    if (type instanceof Object$) {
      Object.getOwnPropertyNames(type).forEach(function (field) {
        if (!staticClassFields[field]) {
          class_[field] = type[field]
        }
      })
    }

    // update instance properties
    if (proto instanceof Object$) {
      Object.getOwnPropertyNames(proto).forEach(function (field) {
        if (!staticObjectFields[field]) {
          class_.proto[field] = proto[field]
        }
      })
    }

    // override empty function to create an empty instance
    link(class_, 'empty', function () {
      return Object.create(proto_)
    })

    // override of function to create instance
    link(class_, 'of', function (source) {
      var obj = Object.create(proto_)
      if (typeof proto_.of === 'function') {
        proto_.of.apply(obj, arguments)
      } else if (typeof obj['='] === 'function' && source instanceof Object$) {
        obj['='](source)
      }
      return obj
    })

    // override type indexer for the new class.
    typeIndexer(class_)
    return class_
  })

  // check if this class' instance complys to a template object.
  link(Type, 'as', function (template) {
    if (!(this instanceof ClassType$) || !(template instanceof Object$)) {
      return false
    }
    var fields = Object.getOwnPropertyNames(template)
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i]
      var value = this.proto[field]
      if (typeof value === 'undefined' || value === null) {
        return false
      }
      var tvalue = template[field]
      if (tvalue !== null) {
        var type = typeOf(value)
        if (!thisCall(type, 'is-of', tvalue) &&
          !thisCall(type, 'is-of', typeOf(tvalue))) {
          return false
        }
      }
    }
    return true
  })

  // Encoding: a class can be encoded if it has been exported to module.
  link(Type, 'to-code', function (ctx) {
    if (this === Type) {
      return sharedSymbolOf('class') // the $.class itself.
    }
    if (!(this instanceof ClassType$)) {
      return null
    }
    if (this.module) {
      if (this.module.uri === '$') {
        return sharedSymbolOf(this.name) // exported as a global class.
      }
      var mod = thisCall(this.module, 'to-code', ctx)
      if (mod) { // as a public member of a module
        return $Tuple.of(mod, sharedSymbolOf(this.name))
      }
    }
    // an annoymous class is not portable. Its instance will be downgraded to a
    // nearest exported type or a common object.
    return null
  })

  // Description: shared for all global types.
  link(Type, 'to-string', function () {
    return this && typeof this.name === 'string' ? this.name : null
  })

  // Type Indexer for global class itself.
  typeIndexer(Type)
}
