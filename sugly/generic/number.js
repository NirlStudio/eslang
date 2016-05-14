'use strict'

var $export = require('../export')

function isTypeOf () {
  return function Number$is_type_of (value) {
    return typeof value === 'number'
  }
}

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
  var type = $.Number
  $export(type, 'is-type-of', isTypeOf())
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

  var class_ = type.class
  $export.copy(class_, Number.prototype, {
    'toExponential': 'to-exponential',
    'toFixed': 'to-fixed',
    'toLocaleString': 'to-locale-string',
    'toPrecision': 'to-precision',
    'toString': 'to-string'
  })

  // override to support NaN !== NaN
  $export(class_, 'equals', function (value) {
    return this === value
  })

  // persistency & describing
  $export(class_, 'to-code', toCode())
  $export(class_, 'to-string', toCode())

  // O and NaN are defined as empty.
  $export(class_, 'is-empty', function () {
    return this === 0 || isNaN(this)
  })
  $export(class_, 'not-empty', function () {
    return this !== 0 && !isNaN(this)
  })

  // indexer: general & primary predicate, readonly.
  $export(class_, ':', function (name) {
    if (typeof name === 'string') {
      var value = class_[name]
      return typeof value !== 'undefined' ? value : null
    }
    return null
  })

  // support ordering logic - comparable
  $export(class_, 'compare', function (another) {
    var diff = this - another
    return diff === 0 ? 0 : diff / Math.abs(diff)
  })

  // support basic arithmetic operations
  $export(class_, 'and', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(class_, 'subtract', function () {
    return sub.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(class_, 'times', function () {
    return times.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(class_, 'divide', function () {
    return divide.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  // support common math operations
  $export(class_, 'abs', function () {
    return Math.abs(this)
  })

  // support arithmetic operators
  $export(class_, '+', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(class_, '-', function () {
    return sub.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(class_, '*', function () {
    return times.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(class_, '/', function () {
    return divide.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  // override equivalence operators - for NaN
  $export(class_, '==', function (another) {
    return this === another
  })
  $export(class_, '!=', function (another) {
    return this !== another
  })

  // support ordering operators
  $export(class_, '>', function (another) {
    return this > another
  })
  $export(class_, '>=', function (another) {
    return this >= another
  })
  $export(class_, '<', function (another) {
    return this < another
  })
  $export(class_, '<=', function (another) {
    return this <= another
  })
}
