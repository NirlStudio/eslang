'use strict'

function createValueOf () {
  return function Number$valueOf (input) {
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

function numberAnd (valueOf) {
  return function number$and () {
    var result = typeof this === 'number' ? this : valueOf(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result += typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberSubtract (valueOf) {
  return function number$substract () {
    var result = typeof this === 'number' ? this : valueOf(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result -= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberTimes (valueOf) {
  return function number$times () {
    var result = typeof this === 'number' ? this : valueOf(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result *= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberDivide (valueOf) {
  return function number$divide () {
    var result = typeof this === 'number' ? this : valueOf(this)
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      result /= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Number
  var readonly = $void.readonly
  var copyObject = $void.copyObject
  var copyProto = $void.copyProto

  copyObject(type, Number, {
    MAX_VALUE: 'MAX_VALUE',
    MIN_VALUE: 'MIN_VALUE',
    NEGATIVE_INFINITY: 'NEGATIVE_INFINITY',
    POSITIVE_INFINITY: 'POSITIVE_INFINITY'
  })

  // get a number value from the input
  var valueOf = readonly(type, 'value-of', createValueOf())

  // parse a string to its number value.
  readonly(type, 'parse', function Number$parse (value) {
    return typeof value === 'undefined' || value === null ? 0 : parseFloat(value)
  })

  var proto = type.proto
  // test for special values of Nan and Infinity
  readonly(proto, 'is-valid', function number$isValid () {
    return typeof this === 'number' && !isNaN(this)
  })
  readonly(proto, 'is-finite', function number$isFinite () {
    return typeof this === 'number' && isFinite(this)
  })

  // TODO - remove unnecessary functions?
  copyProto(type, Number, function (value) {
    return typeof value === 'number'
  }, {
    'toExponential': 'to-exponential',
    'toFixed': 'to-fixed',
    'toLocaleString': 'to-locale-string',
    'toPrecision': 'to-precision'
  })

  // support basic arithmetic operations
  readonly(proto, 'and', numberAnd(valueOf))
  readonly(proto, 'subtract', numberSubtract(valueOf))
  readonly(proto, 'times', numberTimes(valueOf))
  readonly(proto, 'divide', numberDivide(valueOf))

  // support arithmetic operators
  readonly(proto, '+', numberAnd(valueOf))
  readonly(proto, '-', numberSubtract(valueOf))
  readonly(proto, '*', numberTimes(valueOf))
  readonly(proto, '/', numberDivide(valueOf))

  // support ordering logic - comparable
  readonly(proto, 'compare', function number$compare (another) {
    var diff = this - another
    return diff === 0 ? 0 : diff / Math.abs(diff)
  })

  // support ordering operators
  readonly(proto, '>', function number$oprGT (another) {
    return typeof another === 'number' ? this > another : false
  })
  readonly(proto, '>=', function number$oprGE (another) {
    return typeof another === 'number' ? this >= another : false
  })
  readonly(proto, '<', function number$oprLT (another) {
    return typeof another === 'number' ? this < another : false
  })
  readonly(proto, '<=', function number$oprLE (another) {
    return typeof another === 'number' ? this <= another : false
  })

  // support common math operations
  readonly(proto, 'abs', function number$abs () {
    return Math.abs(this)
  })
  readonly(proto, 'ceil', function number$ceil () {
    return Math.ceil(this)
  })
  readonly(proto, 'floor', function number$floor () {
    return Math.floor(this)
  })
  readonly(proto, 'round', function number$floor () {
    return Math.round(this)
  })

  // O and NaN are defined as empty.
  readonly(proto, 'is-empty', function number$isEmpty () {
    return this === 0 || isNaN(this)
  })
  readonly(proto, 'not-empty', function number$notEmpty () {
    return this !== 0 && !isNaN(this)
  })

  // persistency & describing
  readonly(proto, 'to-code', function number$toCode () {
    return typeof this === 'number' ? this.toString() : 'NaN'
  })
  readonly(proto, 'to-string', function number$toString () {
    return typeof this === 'number' ? this.toString() : 'NaN'
  })

  // override indexer to expose number properties and methods
  readonly(proto, ':', function number$indexer (name) {
    if (typeof name === 'string') {
      if (name === 'type') {
        return Number.isInteger(this) ? $.Int : $.Float
      }
      return typeof proto[name] !== 'undefined' ? proto[name] : null
    }
    return null
  })

  // export to system's prototype
  $void.injectTo(Number, 'type', type)
  $void.injectTo(Number, ':', proto[':'])
}
