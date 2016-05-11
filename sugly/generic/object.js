'use strict'

var $export = require('../export')
var $module = require('./module')

function isTypeOf ($) {
  var isSymbol = $.Symbol['is-type-of']
  return function Object$is_type_of (value) {
    return typeof value === 'object' && value !== null && !isSymbol(value)
  }
}

function create () {
  return function Object$create (prototype) {
    if (typeof prototype !== 'object' || prototype === null) {
      prototype = Object.prototype
    }

    var obj = Object.create(prototype)
    if (arguments.length > 1) {
      var args = [obj]
      args.push.apply(args, Array.prototype.slice.call(arguments, 1))
      Object.assign.apply(Object, args)
    }
    return obj
  }
}

function equals ($) {
  var isSymbol = $.Symbol['is-type-of']
  return function Object$equals (another) {
    if (typeof this !== 'object' || this === null || isSymbol(this)) {
      return false
    }
    // TODO - to compare type & fields.
    return Object.is(this, another)
  }
}

function toCode ($) {
  return function Object$to_code () {
    return $.encode.object(this)
  }
}

module.exports = function ($) {
  var type = $module($, 'Object')
  $export.copy(type, Object, {
    /* CH5/FF4/IE9/OP12/SF5 */
    'getPrototypeOf': 'prototype-of',
    'getOwnPropertyNames': 'property-names-of',
    'keys': 'keys-of'
  })
  $export(type, 'is-type-of', isTypeOf($))
  $export(type, 'create', create())

  var pt = type.$ = Object.create($.Null.$)
  $export.copy(pt, Object.prototype, { // TODO - looper
    /* CH/FF/IE/OP/SF */
    'hasOwnProperty': 'owns-property',
    'isPrototypeOf': 'is-prototype-of',
    'propertyIsEnumerable': 'has-enumerable-property'

  })
  $export(pt, 'equals', equals($))

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toCode($))
  return type
}
