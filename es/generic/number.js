'use strict'

function createValueOf ($void, parse, parseInteger) {
  return function (input, defaultValue) {
    var value
    if (typeof input === 'string') {
      value = input.startsWith('0x') || input.startsWith('0b') ? parseInteger(input) : parse(input)
    } else if (typeof input === 'boolean') {
      value = input ? 1 : 0
    } else if (input instanceof Date) {
      value = input.getTime()
    } else if (typeof input === 'undefined' || input === null) {
      value = 0
    } else if (typeof input === 'number') {
      value = input
    } else {
      value = NaN
    }
    return isNaN(value) && typeof defaultValue === 'number' ? defaultValue : value
  }
}

function safeIntValueOf (number) {
  var intValue = Number.isSafeInteger(number) ? number
    : isNaN(number) ? 0
      : number >= Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER
        : number <= Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER
          : Math.trunc(number)
  return intValue === 0 ? 0 : intValue
}

function createIntValueOf ($void, parse) {
  return function (input, defaultValue) {
    var result
    if (typeof input === 'string') {
      result = parse(input)
    } else if (typeof input === 'number') {
      result = input === 0 ? 0 : Math.trunc(input)
    } else if (typeof input === 'boolean') {
      return input ? 1 : 0
    }
    return Number.isSafeInteger(result) ? result
      : Number.isSafeInteger(defaultValue) ? defaultValue
        : safeIntValueOf(result)
  }
}

function createIntParser ($void) {
  return function (input) {
    var value
    if (typeof input !== 'string') {
      return typeof input !== 'number' ? NaN
        : input === 0 ? 0 : isNaN(input) ? NaN
          : (value = Math.trunc(input)) === 0 ? 0
            : Number.isSafeInteger(value) ? value : NaN
    }
    var radix
    if (input.startsWith('0x')) {
      radix = 16
      input = input.substring(2)
    } else if (input.startsWith('0b')) {
      radix = 2
      input = input.substring(2)
    } else if (input.length > 1 && input.startsWith('0')) {
      radix = 8
      input = input.substring(1)
    } else {
      radix = 10
      var offset = input.indexOf('.')
      if (offset >= 0) {
        input = input.substr(0, offset)
      }
    }
    value = parseInt(input, radix)
    return value === 0 ? 0
      : input.endsWith('i') ? value >> 0
        : Number.isSafeInteger(value) ? value : NaN
  }
}

function numberAnd (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result += typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberSubtract (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result -= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberTimes (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result *= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function numberDivide (valueOf) {
  return function () {
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result /= typeof arg === 'number' ? arg : valueOf(arg)
    }
    return result
  }
}

function normalize (value) {
  return value >= 0 ? Math.trunc(value) : (0x100000000 + (value >> 0))
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.number
  var $Range = $.range
  var link = $void.link
  var Symbol$ = $void.Symbol
  var copyType = $void.copyType
  var protoValueOf = $void.protoValueOf

  // the value range and constant values.
  copyType(Type, Number, {
    MAX_VALUE: 'max',
    MIN_VALUE: 'smallest',
    MAX_SAFE_INTEGER: 'max-int',
    MIN_SAFE_INTEGER: 'min-int',
    POSITIVE_INFINITY: 'infinite',
    NEGATIVE_INFINITY: '-infinite'
  })
  link(Type, 'min', -Number.MAX_VALUE)

  // support bitwise operations for 32-bit integer values.
  link(Type, 'bits', 32)
  var maxBits = link(Type, 'max-bits', 0x7FFFFFFF)
  var minBits = link(Type, 'min-bits', 0x80000000 >> 0)

  // The empty value
  link(Type, 'empty', 0)

  // An empty value indicating an invalid number.
  link(Type, 'invalid', NaN)

  // parse a string to its number value.
  var regexParse = /\s*\(number\s+(invalid|[-]?infinite)\s*\)\s*/
  var parse = link(Type, 'parse', function (value) {
    if (typeof value !== 'string') {
      return typeof value === 'number' ? value : NaN
    }
    var keys = value.match(regexParse)
    switch (keys && keys.length > 1 ? keys[1] : '') {
      case 'invalid':
        return NaN
      case 'infinite':
        return Number.POSITIVE_INFINITY
      case '-infinite':
        return Number.NEGATIVE_INFINITY
      default:
        return parseFloat(value)
    }
  }, true)

  // parse a string as an integer value.
  var parseInteger = link(Type, 'parse-int', createIntParser($void), true)

  // get a number value from the input
  var valueOf = link(Type, 'of',
    createValueOf($void, parse, parseInteger), true
  )

  // get an integer value from the input
  var intOf = link(Type, 'of-int', createIntValueOf($void, parseInteger), true)

  // get an signed integer value which is stable with bitwise operation.
  link(Type, 'of-bits', function (input) {
    return intOf(input) >> 0
  }, true)

  var proto = Type.proto
  // test for special values
  link(proto, 'is-valid', function () {
    return !isNaN(this)
  })
  link(proto, 'is-invalid', function () {
    return isNaN(this)
  })
  // test for special value ranges
  link(proto, 'is-finite', function () {
    return isFinite(this)
  })
  link(proto, 'is-infinite', function () {
    return !isFinite(this)
  })
  link(proto, 'is-int', function () {
    return Number.isSafeInteger(this) && (this !== 0 || 1 / this === Infinity)
  })
  link(proto, 'is-not-int', function () {
    return !Number.isSafeInteger(this) || (this === 0 && 1 / this !== Infinity)
  })
  link(proto, 'is-bits', function () {
    return Number.isSafeInteger(this) &&
      this >= minBits && this <= maxBits &&
      (this !== 0 || 1 / this === Infinity)
  })
  link(proto, 'is-not-bits', function () {
    return !Number.isSafeInteger(this) ||
      this < minBits || this > maxBits ||
      (this === 0 && 1 / this !== Infinity)
  })

  // convert to special sub-types
  link(proto, 'as-int', function () {
    return safeIntValueOf(this)
  })
  link(proto, 'as-bits', function () {
    return this >> 0
  })

  // helpers of zero-based indexing.
  link(proto, ['th', 'st', 'nd', 'rd'], function () {
    var index = safeIntValueOf(this)
    return index >= 0 ? (index - 1) : index
  })

  // support basic arithmetic operations
  link(proto, ['+', 'plus'], numberAnd(valueOf))
  link(proto, ['-', 'minus'], numberSubtract(valueOf))
  link(proto, ['*', 'times'], numberTimes(valueOf))
  link(proto, ['/', 'divided-by'], numberDivide(valueOf))

  // remainder / modulus
  link(proto, '%', function (base) {
    return typeof base === 'undefined' ? this
      : isNaN(base) || typeof base !== 'number' ? NaN
        : isFinite(base) ? this % valueOf(base) : this
  })

  // bitwise operations
  link(proto, '&', function (value) {
    return this & value
  })
  link(proto, '|', function (value) {
    return this | value
  })
  link(proto, '^', function (value) {
    return this ^ value
  })
  link(proto, '<<', function (offset) {
    offset >>= 0
    return offset <= 0 ? this << 0
      : offset >= 32 ? 0 : this << offset
  })
  // signed right-shift.
  link(proto, '>>', function (offset) {
    offset >>= 0
    return offset <= 0 ? this >> 0
      : offset >= 32 ? (this >> 0) >= 0 ? 0 : -1
        : this >> offset
  })
  // zero-based right shift.
  link(proto, '>>>', function (offset) {
    offset >>= 0
    return offset <= 0 ? this >> 0
      : offset >= 32 ? 0 : this >>> offset
  })

  // support ordering logic - comparable
  // For incomparable entities, comparison result is consistent with the Equivalence.
  // incomparable state is indicated by a null and is taken as nonequivalent.
  var compare = link(proto, 'compare', function (another) {
    return typeof another !== 'number' ? null
      : this === another ? 0 // two same valid values.
        : !isNaN(this) && !isNaN(another)
          ? this > another ? 1 : -1
          : isNaN(this) && isNaN(another)
            ? 0 // NaN is equivalent with itself.
            : null // NaN is not comparable with a real number.
  })

  // comparing operators for instance values
  link(proto, '>', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order > 0 : null
  })
  link(proto, '>=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order >= 0 : null
  })
  link(proto, '<', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order < 0 : null
  })
  link(proto, '<=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order <= 0 : null
  })

  // override equivalence logic since 0 != -0 by identity-base test.
  link(proto, ['equals', '=='], function (another) {
    return typeof another === 'number' && (
      this === another || (isNaN(this) && isNaN(another))
    )
  })
  link(proto, ['not-equals', '!='], function (another) {
    return typeof another !== 'number' || (
      this !== another && !(isNaN(this) && isNaN(another))
    )
  })

  // support common math operations
  link(proto, 'ceil', function () {
    return Math.ceil(this)
  })
  link(proto, 'floor', function () {
    return Math.floor(this)
  })
  link(proto, 'round', function () {
    return Math.round(this)
  })
  link(proto, 'trunc', function () {
    return Math.trunc(this)
  })

  // O and NaN are defined as empty.
  link(proto, 'is-empty', function () {
    return this === 0 || isNaN(this)
  })
  link(proto, 'not-empty', function () {
    return this !== 0 && !isNaN(this)
  })

  // Representation & Description
  link(proto, 'to-string', function (format) {
    if (isNaN(this)) {
      return '(number invalid)'
    } else if (this === Number.POSITIVE_INFINITY) {
      return '(number infinite)'
    } else if (this === Number.NEGATIVE_INFINITY) {
      return '(number -infinite)'
    } else if (!format) {
      return Object.is(this, -0) ? '-0' : this.toString()
    }

    switch (format) {
      case 'H':
      case 'HEX':
        return normalize(this).toString(16)
      case 'h':
      case 'hex':
        return '0x' + normalize(this).toString(16)
      case 'O':
      case 'OCT':
        return normalize(this).toString(8)
      case 'o':
      case 'oct':
        return '0' + normalize(this).toString(8)
      case 'B':
      case 'BIN':
        return normalize(this).toString(2)
      case 'b':
      case 'bin':
        return '0b' + normalize(this).toString(2)
      default:
        return this.toString()
    }
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : typeof index === 'number' ? $Range.of(this, index, value)
        : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
