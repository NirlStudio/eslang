'use strict'

var $export = require('../export')

function createObject ($void) {
  var isPrototypeOf = $void.isPrototypeOf
  var Class = $void.$.Class

  return function Class$create () {
    var class_ = this === Class || (isPrototypeOf(Class, this) &&
      isPrototypeOf(Class.proto, this.proto)) ? this : Class
    if (!class_ || class_['abstract']) {
      return null
    }

    var obj = Object.create(class_.proto)
    var constructor = class_.proto.constructor
    if (typeof constructor === 'function') {
      constructor.apply(obj, arguments)
    } else if (arguments.length > 0) {
      var args = [obj]
      Array.prototype.push.apply(args, arguments)
      Object.assign.apply(Object, args)
    }
    return obj
  }
}

function newClass ($void) {
  var createType = $void.createType
  var isPrototypeOf = $void.isPrototypeOf
  var Class = $void.$.Class

  return function Class$new (type, proto) {
    var parent = this === Class || (isPrototypeOf(Class, this) &&
      isPrototypeOf(Class.proto, this.proto)) ? this : Class
    if (!parent || parent['finalized']) {
      return null
    }

    var class_ = createType(parent)
    Object.assign(class_, type)
    Object.assign(class_.proto, proto)
    return class_
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Class = $.Class

  // create a new object and copy properties from source objects.
  $export(Class, 'create', createObject($void))

  // derive from this class to create a new class with its static & instance properties.
  $export(Class, 'new', newClass($void))

  require('./object')($void)

  // export to system's prototype
  $void.injectTo(Object, 'type', Class)
}
