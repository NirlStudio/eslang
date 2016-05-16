'use strict'

var $export = require('../export')

function createObject ($void) {
  var isPrototypeOf = $void.isPrototypeOf
  var Class = $void.$.Class

  return function Class$create () {
    var class_ = this === Class || (isPrototypeOf(Class, this) &&
      isPrototypeOf(Class.proto, this.proto)) ? this : null
    if (!class_ || class_['abstract']) {
      return null
    }

    var obj = Object.create(class_.proto)
    var constructor = class_.proto.constructor
    if (typeof constructor === 'function') {
      constructor.apply(obj, arguments)
    } else if (arguments.length > 0) {
      var args = [obj]
      Object.assign.apply(Object, Array.prototype.concat.apply(args, arguments))
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
      isPrototypeOf(Class.proto, this.proto)) ? this : null
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
  var Symbol$ = $void.Symbol
  var Class = $.Class

  // create a new object and copy properties from source objects.
  $export(Class, 'create', createObject($void))

  // derive from this class to create a new class with its static & instance properties.
  $export(Class, 'new', newClass($void))

  // define static type attributes
  $export(Class, 'is-type', function Class$is_type () {
    return true
  })
  $export(Class, 'is-type-of', function Class$is_type_of (value) {
    // both native & managed objects.
    return typeof value === 'object' && value !== null && !(value instanceof Symbol$)
  })
  $export(Class, 'super', function Class$super () {
    return this === Class ? null : Object.getPrototypeOf(this)
  })
  $export(Class, 'get-type', function Class$get_type () {
    return Class
  })
  $export(Class, 'is-instance', function Class$is_instance () {
    return false
  })
  $export(Class, 'is-instance-of', function Class$is_instance_of (type) {
    return false
  })

  require('./object')($void)
}
