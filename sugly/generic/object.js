'use strict'

var $export = require('../export')
var dump = $export.dump(Object)

var $type = {}
Object.assign($type, dump.utils)

var $inst = {}
Object.assign($inst, dump.methods)

function isType ($) {
  var isSymbol = $.Symbol.is
  return function Object$is_type (value) {
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

function isSame ($) {
  var isSymbol = $.Symbol.is
  return function Object$is_same (another) {
    return typeof this === 'object' && this !== null && !isSymbol(this) && this === another
  }
}

function equals ($) {
  var isSymbol = $.Symbol.is
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
  var type = $export($, null, $export.copy('Object', type))
  $export(type, 'is', isType())
  $export(type, 'create', create())

  var pt = $export(type, null, $export.copy('$', $inst))
  $export(pt, 'is', isSame($))
  $export(pt, 'equals', equals($))

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toCode($))
  return type
}
