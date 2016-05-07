'use strict'

var $export = require('../export')
var dump = $export.dump(Number)

var $inst = {}
Object.assign($inst, dump.methods)

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
    if (typeof input === 'object') {
      var num = input.length || input.size
      if (typeof num === 'number') {
        return num
      }
      if (input.count && typeof input.count === 'function') {
        num = input.count()
        if (typeof num === 'number') {
          return num
        }
      }
    }
    return 0
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

  // TODO - to be interpreted in tokenizer?
  $.NaN = NaN
  $.Infinity = Infinity

  type.MAX_VALUE = Number.MAX_VALUE
  type.MIN_VALUE = Number.MIN_VALUE

  type.MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || (Math.pow(2, 53) - 1)
  type.MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53) - 1)

  type.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY
  type.POSITIVE_INFINITY = Number.POSITIVE_INFINITY

  var value_of = $export(type, 'value-of', valueOf())
  var and = $export(type, 'and', numberAnd(value_of))

  $export(type, 'is-finite', function Number$is_finite (value) {
    return typeof value === 'number' ? isFinite(value) : false
  })
  $export(type, 'not-number', function Number$not_number (value) {
    return typeof value === 'number' ? isNaN(value) : true
  })

  $export(type, 'is-int', Number.isInteger ? function Number$is_int (value) {
    return Number.isInteger(value)
  } : function Number$is_int (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  })
  $export(type, 'safe-int', Number.isSafeInteger ? function Number$safe_int (value) {
    return Number.isSafeInteger(value)
  } : function Number$safe_int (value) {
    return type.isInteger(value) && Math.abs(value) <= type.MAX_SAFE_INTEGER
  })

  $export(type, 'parse', function Number$parse (value) {
    return typeof value === 'undefined' || value === null ? 0 : parseFloat(value)
  })
  $export(type, 'parse-int', function Number$parse_int (value, radix) {
    return typeof value === 'undefined' || value === null ? 0 : parseInt(value, radix)
  })

  var pt = $export(type, null, $export.copy('$', $inst))
  $export(pt, 'is', isSame())
  $export(pt, 'equals', equals())

  $export(pt, 'to-code', toCode())
  $export(pt, 'to-string', toCode())

  $export(pt, 'and', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  return type
}
