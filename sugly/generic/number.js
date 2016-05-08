'use strict'

var $export = require('../export')
var measure = require('./measure')

function isType () {
  return function Number$is_type (value) {
    return typeof value === 'number'
  }
}

function valueOf () {
  return function Number$value_of (input) {
    if (typeof input === 'string') {
      return parseFloat(input)
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
    if (input instanceof Date) {
      return input.getTime()
    }
    return measure(input)
  }
}

function isSame () {
  return function Number$is_same (value) {
    return typeof this === 'number' ? this === value || (isNaN(this) && isNaN(value)) : false
  }
}

function equals () {
  return function Number$equals (value) {
    return typeof this === 'number' ? this === value : false
  }
}

function toCode () {
  return function Number$to_code () {
    return typeof this === 'number' ? this.toString() : 'NaN'
  }
}

function numberAnd (value_of) {
  return function Number$and () {
    var length = arguments.length
    var result = 0
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'number') {
        arg = value_of(arg)
      }
      result += arg
    }
    return result
  }
}

function numberSubtract (value_of) {
  return function Number$substract () {
    var length = arguments.length
    if (length < 1) {
      return 0
    }
    var arg = arguments[0]
    var result = typeof arg === 'number' ? arg : value_of(arg)
    for (var i = 1; i < length; i++) {
      arg = arguments[i]
      if (typeof arg !== 'number') {
        arg = value_of(arg)
      }
      result -= arg
    }
    return result
  }
}

function numberTimes (value_of) {
  return function Number$times () {
    var length = arguments.length
    var result = 1
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'number') {
        arg = value_of(arg)
      }
      result *= arg
    }
    return result
  }
}

function numberDivide (value_of) {
  return function Number$divide () {
    var length = arguments.length
    if (length < 1) {
      return 0
    }
    var arg = arguments[0]
    var result = typeof arg === 'number' ? arg : value_of(arg)
    for (var i = 1; i < length; i++) {
      arg = arguments[i]
      if (typeof arg !== 'number') {
        arg = value_of(arg)
      }
      result /= arg
    }
    return result
  }
}

module.exports = function ($) {
  var type = $export($, 'Number')
  $export(type, 'is', isType())
  var value_of = $export(type, 'value-of', valueOf())

  type.MAX_VALUE = Number.MAX_VALUE
  type.MIN_VALUE = Number.MIN_VALUE

  type.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY
  type.POSITIVE_INFINITY = Number.POSITIVE_INFINITY

  $export(type, 'is-not', function Number$is_not (value) {
    return typeof value === 'number' ? isNaN(value) : true
  })
  $export(type, 'is-finite', function Number$is_finite (value) {
    return typeof value === 'number' ? isFinite(value) : false
  })
  $export(type, 'parse', function Number$parse (value) {
    return typeof value === 'undefined' || value === null ? 0 : parseFloat(value)
  })

  var and = $export(type, 'and', numberAnd(value_of))
  var sub = $export(type, 'subtract', numberSubtract(value_of))
  var times = $export(type, 'times', numberTimes(value_of))
  var divide = $export(type, 'divide', numberDivide(value_of))

  var pt = Object.create($.Null.$)
  $export(type, null, $export.copy('$', Number.prototype, {
    'toExponential': 'to-exponential',
    'toFixed': 'to-fixed',
    'toLocaleString': 'to-locale-string',
    'toPrecision': 'to-precision',
    'toString': 'to-string'
  }, pt))
  $export(pt, 'is', isSame())
  $export(pt, 'equals', equals())

  $export(pt, 'to-code', toCode())

  $export(pt, 'and', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, 'subtract', function () {
    return sub.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, 'times', function () {
    return times.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, 'divide', function () {
    return divide.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  $export(pt, '+', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, '-', function () {
    return sub.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, '*', function () {
    return times.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, '/', function () {
    return divide.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  return type
}
