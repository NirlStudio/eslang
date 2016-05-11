'use strict'

var $export = require('../export')
var $module = require('./module')

function valueOf () {
  return function Int$value_of (input, radix) {
    if (typeof input === 'string') {
      return parseInt(input, typeof radix === 'number' ? radix : 10)
    }
    if (typeof input === 'undefined' || input === null) {
      return 0
    }
    if (typeof input === 'number') {
      return input
    }
    if (typeof input === 'boolean') {
      return input ? 1 : 0
    }
    return NaN
  }
}

module.exports = function ($) {
  var type = $module($, 'Int', $.Number)
  $export(type, 'is', Number.isInteger ? function Int$is (value) {
    return Number.isInteger(value)
  } : function Number$is_int (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  })
  $export(type, 'value-of', valueOf())

  // for bitwise operations
  type.MAX_BITS = Math.pow(2, 31) - 1
  type.MIN_BITS = -Math.pow(2, 31)

  type.MAX_VALUE = Number.MAX_SAFE_INTEGER || (Math.pow(2, 53) - 1)
  type.MIN_VALUE = Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1)

  $export(type, 'is-safe', Number.isSafeInteger ? function Int$is_safe (value) {
    return Number.isSafeInteger(value)
  } : function Number$safe_int (value) {
    return type.isInteger(value) && Math.abs(value) <= type.MAX_SAFE_INTEGER
  })
  $export(type, 'parse', function Int$parse (value, radix) {
    typeof radix === 'number' ? radix : 10
    return typeof value === 'undefined' || value === null ? 0 : parseInt(value, radix)
  })

  var pt = type.$ = Object.create($.Number.$)
  $export(pt, '&', function Bit$and (value) {
    return this & value
  })
  $export(pt, '|', function Bit$or (value) {
    return this | value
  })
  $export(pt, '^', function Bit$xor (value) {
    return this ^ value
  })
  $export(pt, '~', function Bit$not () {
    return ~this // TODO - add global operator
  })
  $export(pt, '<<', function Bit$lshift (offset) {
    return this << offset
  })
  $export(pt, '>>', function Bit$lshift (offset) {
    return this >> offset
  })
  $export(pt, '>>>', function Bit$lshift (offset) {
    return this >>> offset
  })

  return type
}
