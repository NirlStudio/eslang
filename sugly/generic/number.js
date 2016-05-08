'use strict'

var $export = require('../export')

function isType () {
  return function Number$is_type (value) {
    return typeof value === 'number'
  }
}

function measureObject (obj) {
  var keys = ['length', 'size', 'count']
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    try {
      var value = obj[key]
      if (typeof value === 'function') {
        value = value()
      }
      if (typeof value === 'number') {
        return value
      }
    } catch (err) {}
  }
  if (typeof value === 'undefined') {
    return NaN
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
    if (typeof input === 'object') {
      return measureObject(input)
    }
    return NaN
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
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'number') {
        arg = value_of(arg)
      }
      if (!arg) {
        return false
      }
    }
    return true
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

  var pt = $export(type, null, $export.copy('$', Number.prototype, {
    'toExponential': 'to-exponential',
    'toFixed': 'to-fixed',
    'toLocaleString': 'to-locale-string',
    'toPrecision': 'to-precision',
    'toString': 'to-string'
  }))
  $export(pt, 'is', isSame())
  $export(pt, 'equals', equals())

  $export(pt, 'to-code', toCode())

  $export(pt, 'and', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  return type
}
