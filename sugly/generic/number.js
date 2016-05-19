'use strict'

var $export = require('../export')

function valueOf () {
  return function Number$value_of (input) {
    if (typeof input === 'string') {
      var num = parseFloat(input)
      return isNaN(num) ? 0 : num
    }
    if (typeof input === 'undefined' || input === null) {
      return 0
    }
    if (typeof input === 'boolean') {
      return input ? 1 : 0
    }
    if (input instanceof Date) {
      return input.getTime()
    }
    return typeof input === 'number' ? input : 0
  }
}

function numberAnd (value_of) {
  return function number$and () {
    var result = typeof this === 'number' ? this : value_of(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result += typeof arg === 'number' ? arg : value_of(arg)
    }
    return result
  }
}

function numberSubtract (value_of) {
  return function number$substract () {
    var result = typeof this === 'number' ? this : value_of(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result -= typeof arg === 'number' ? arg : value_of(arg)
    }
    return result
  }
}

function numberTimes (value_of) {
  return function number$times () {
    var result = typeof this === 'number' ? this : value_of(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result *= typeof arg === 'number' ? arg : value_of(arg)
    }
    return result
  }
}

function numberDivide (value_of) {
  return function number$divide () {
    var result = typeof this === 'number' ? this : value_of(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result /= typeof arg === 'number' ? arg : value_of(arg)
    }
    return result
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Number

  type.MAX_VALUE = Number.MAX_VALUE
  type.MIN_VALUE = Number.MIN_VALUE

  type.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY
  type.POSITIVE_INFINITY = Number.POSITIVE_INFINITY

  // get a number value from the input
  var value_of = $export(type, 'value-of', valueOf())

  // parse a string to its number value.
  $export(type, 'parse', function Number$parse (value) {
    return typeof value === 'undefined' || value === null ? 0 : parseFloat(value)
  })

  var proto = type.proto
  // test for special values of Nan and Infinity
  $export(proto, 'is-valid', function number$is_valid () {
    return typeof this === 'number' && !isNaN(this)
  })
  $export(proto, 'is-finite', function number$is_finite () {
    return typeof this === 'number' && isFinite(this)
  })

  // TODO - remove unnecessary functions?
  $export.copy(proto, Number.prototype, {
    'toExponential': 'to-exponential',
    'toFixed': 'to-fixed',
    'toLocaleString': 'to-locale-string',
    'toPrecision': 'to-precision'
  })

  // support basic arithmetic operations
  $export(proto, 'and', numberAnd(value_of))
  $export(proto, 'subtract', numberSubtract(value_of))
  $export(proto, 'times', numberTimes(value_of))
  $export(proto, 'divide', numberDivide(value_of))

  // support arithmetic operators
  $export(proto, '+', numberAnd(value_of))
  $export(proto, '-', numberSubtract(value_of))
  $export(proto, '*', numberTimes(value_of))
  $export(proto, '/', numberDivide(value_of))

  // support ordering logic - comparable
  $export(proto, 'compare', function number$compare (another) {
    var diff = this - another
    return diff === 0 ? 0 : diff / Math.abs(diff)
  })

  // support ordering operators
  $export(proto, '>', function number$opr_gt (another) {
    return typeof another === 'number' ? this > another : false
  })
  $export(proto, '>=', function number$opr_ge (another) {
    return typeof another === 'number' ? this >= another : false
  })
  $export(proto, '<', function number$opr_lt (another) {
    return typeof another === 'number' ? this < another : false
  })
  $export(proto, '<=', function number$opr_le (another) {
    return typeof another === 'number' ? this <= another : false
  })

  // support common math operations
  $export(proto, 'abs', function number$abs () {
    return Math.abs(this)
  })
  $export(proto, 'ceil', function number$ceil () {
    return Math.ceil(this)
  })
  $export(proto, 'floor', function number$floor () {
    return Math.floor(this)
  })
  $export(proto, 'round', function number$floor () {
    return Math.round(this)
  })

  // persistency & describing
  $export(proto, 'to-code', function number$to_code () {
    return typeof this === 'number' ? this.toString() : 'NaN'
  })
  $export(proto, 'to-string', function number$to_string () {
    return typeof this === 'number' ? this.toString() : 'NaN'
  })

  // O and NaN are defined as empty.
  $export(proto, 'is-empty', function number$is_empty () {
    return this === 0 || isNaN(this)
  })
  $export(proto, 'not-empty', function number$not_empty () {
    return this !== 0 && !isNaN(this)
  })

  // override indexer to create range object.
  $export(proto, ':', function number$indexer (name) {
    if (typeof name === 'string') {
      return typeof proto[name] !== 'undefined' ? proto[name] : null
    }
    return null
  })

  // export to system's prototype
  $void.injectTo(Number, 'type', type)
  $void.injectTo(Number, ':', proto[':'])
}
