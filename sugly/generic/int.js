'use strict'

var $export = require('../export')

function intParse () {
  return function Int$parse (input, radix) {
    if (typeof input !== 'string') {
      return 0
    }
    if (typeof radix !== 'number' || radix < 2) {
      if (input.startsWith('0x')) {
        radix = 16
        input = input.substring(2)
      } else if (input.startsWith('0b')) {
        radix = 2
        input = input.substring(2)
      } else if (input.startsWith('0')) {
        radix = 8
        input = input.substring(1)
      } else {
        radix = 10
      }
    }
    var value = parseInt(input, radix)
    return isNaN(value) ? 0 : value
  }
}

function valueOf (parse) {
  return function Int$value_of (input, radix) {
    if (typeof input === 'string') {
      return parse(input, radix)
    }
    if (typeof input === 'undefined' || input === null) {
      return 0
    }
    if (typeof input === 'boolean') {
      return input ? 1 : 0
    }
    return typeof input === 'number' ? input : 0
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Int

  // parse an string to its integer value
  var parse = $export(type, 'parse', intParse())

  // override to support radix argument.
  $export(type, 'value-of', valueOf(parse))

  // support bitwise operations for 32-bit integer values.
  type.MAX_BITS = Math.pow(2, 31) - 1
  type.MIN_BITS = -Math.pow(2, 31)

  // the value range of safe integer in internal floating-point representation.
  type.MAX_VALUE = Number.MAX_SAFE_INTEGER || (Math.pow(2, 53) - 1)
  type.MIN_VALUE = Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1)

  // to test a value if being in the safe integer value range.
  $export(type, 'is-safe', Number.isSafeInteger ? function Int$is_safe (value) {
    return Number.isSafeInteger(value)
  } : function Number$safe_int (value) {
    return type.isInteger(value) && Math.abs(value) <= type.MAX_SAFE_INTEGER
  })

  var proto = type.proto

  // support bitwise operators for integer values
  $export(proto, '&', function bit$and (value) {
    return this & value
  })
  $export(proto, '|', function bit$or (value) {
    return this | value
  })
  $export(proto, '^', function bit$xor (value) {
    return this ^ value
  })
  $export(proto, '~', function bit$not () {
    return ~this
  })
  $export(proto, '<<', function bit$lshift (offset) {
    return this << offset
  })
  $export(proto, '>>', function bit$lshift (offset) {
    return this >> offset
  })
  $export(proto, '>>>', function bit$lshift (offset) {
    return this >>> offset
  })

  // override indexer to expose functions & operators
  $export(proto, ':', function int$indexer (name, step) {
    if (typeof name === 'string') {
      return typeof proto[name] !== 'undefined' ? proto[name] : null
    }
    if (typeof name === 'number') {
      if (typeof step !== 'number') {
        step = name >= this ? 1 : -1
      }
      return $.Range.create(this, name, step)
    }
    return null
  })
}
