'use strict'

// all the limitation may be removed later.
var staticObjectFields = {
  ':': 1,
  'type': 1,
  'to-code': 1
}
var staticClassFields = Object.assign(Object.create(staticObjectFields), {
  'super': 1,
  'of': 1,
  'empty': 1
})

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.class
  var link = $void.link
  var Object$ = $void.Object
  var typeOf = $void.typeOf
  var thisCall = $void.thisCall
  var ClassType$ = $void.ClassType$
  var createType = $void.createType
  var typeIndexer = $void.typeIndexer

  // define a new class.
  link(Type, 'of', function (parent, type, proto) {
    // ignore parent if it's not a class.
    var class_ = createType(parent instanceof ClassType$ ? parent : Type)

    // update type properties
    Object.getOwnPropertyNames(type).forEach(function (field) {
      if (!staticClassFields[field]) {
        class_[field] = type[field]
      }
    })

    // update instance properties
    Object.getOwnPropertyNames(proto).forEach(function (field) {
      if (!staticObjectFields[field]) {
        class_.proto[field] = proto[field]
      }
    })

    // override empty function to create an empty instance
    var init = class_.proto.init
    link(class_, 'empty', function () {
      var obj = Object.create(class_.proto)
      if (init) {
        init.apply(obj, arguments)
      }
      return obj
    })

    // override of function to create instance
    var construct = class_.proto.construct
    link(class_, 'of', function () {
      var obj = Object.create(class_.proto)
      if (init) {
        init.apply(obj, arguments)
      }
      if (construct) {
        construct.apply(obj, arguments)
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

  // Type Indexer for global class itself.
  typeIndexer(Type)
}
