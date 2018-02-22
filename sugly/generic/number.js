'use strict'

function createValueOf ($void, parse) {
  return function (input, defaultValue) {
    var value
    if (typeof input === 'string') {
      value = parse(input)
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

function createIntValueOf ($void, parse) {
  return function (input, defaultValue) {
    var result
    if (typeof input === 'string') {
      result = parse(input)
    }
    if (typeof input === 'number') {
      result = Math.trunc(input)
    }
    if (typeof input === 'boolean') {
      return input ? 1 : 0
    }
    return Number.isSafeInteger(result) ? result
      : Number.isSafeInteger(defaultValue) ? defaultValue : 0
  }
}

function createIntParser ($void) {
  return function (input) {
    if (typeof input !== 'string') {
      return NaN
    }
    var radix
    if (input.startsWith('0x')) {
      radix = 16
      input = input.substring(2)
    } else if (input.startsWith('0b')) {
      radix = 2
      input = input.substring(2)
    } else if (input.startsWith('0') && input.length > 1) {
      radix = 8
      input = input.substring(1)
    } else {
      radix = 10
    }
    return parseInt(input, radix)
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

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.number
  var $Range = $.range
  var link = $void.link
  var Symbol$ = $void.Symbol
  var copyType = $void.copyType

  // the value range and constant values.
  copyType(Type, Number, {
    MAX_VALUE: 'max',
    MIN_VALUE: 'min',
    POSITIVE_INFINITY: 'infinity',
    NEGATIVE_INFINITY: '-infinity'
  })

  // the safe (valid) integer value range
  link(Type, 'max-int', Number.MAX_SAFE_INTEGER)
  link(Type, 'min-int', Number.MIN_SAFE_INTEGER)

  // support bitwise operations for 32-bit integer values.
  link(Type, 'bits', 32)
  var maxBits = link(Type, 'max-bits', Math.pow(2, 31) - 1)
  var minBits = link(Type, 'min-bits', -Math.pow(2, 31))

  // The empty value
  link(Type, 'empty', 0)

  // parse a string to its number value.
  var parse = link(Type, 'parse', function (value) {
    return parseFloat(value)
  })

  // parse a string as an integer value.
  var parseInteger = link(Type, 'parse-int', createIntParser($void))

  // get a number value from the input
  var valueOf = link(Type, 'of', createValueOf($void, parse))

  // get an integer value from the input
  var intOf = link(Type, 'of-int', createIntValueOf($void, parseInteger))

  // get an signed integer value which is stable with bitwise operation.
  link(Type, 'of-bits', function (input, defaultValue) {
    return intOf(input, defaultValue) >> 0
  })

  var proto = Type.proto
  // test for special values
  link(proto, 'is-valid', function () {
    return !isNaN(this)
  }, 'is-not-valid', function () {
    return isNaN(this)
  })
  link(proto, 'is-int', function () {
    return Number.isSafeInteger(this)
  }, 'is-not-int', function () {
    return !Number.isSafeInteger(this)
  })
  link(proto, 'is-bits', function () {
    return this >= minBits && this <= maxBits
  }, 'is-not-bits', function () {
    return this < minBits || this > maxBits
  })
  link(proto, 'is-finite', function () {
    return isFinite(this)
  }, 'is-infinite', function () {
    return !isFinite(this)
  })

  // support basic arithmetic operations
  link(proto, ['+', 'and'], numberAnd(valueOf))
  link(proto, ['-', 'minus'], numberSubtract(valueOf))
  link(proto, ['*', 'times'], numberTimes(valueOf))
  link(proto, ['/', 'divided-by'], numberDivide(valueOf))

  // bitwise operations
  link(proto, '~', function () {
    return ~this
  })
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
    return this << offset
  })
  // use zero-based shift by default since signed shift may cause an implicit conversion.
  link(proto, '>>', function (offset) {
    return this >>> offset
  })
  // signed right-shift.
  link(proto, '>>>', function (offset) {
    return this >> offset
  })

  // support ordering logic - comparable
  // For uncomparable entities, comparison result is consistent with the Equivalence.
  // Uncomparable state is indicated by a null and is taken as inequivalent.
  var compare = link(proto, 'compare', function (another) {
    return typeof another !== 'number' ? null
      : this === another ? 0 // two same valid values.
        : !isNaN(this) && !isNaN(another)
          ? this > another ? 1 : -1
          : isNaN(this) && isNaN(another)
            ? 0    // NaN is equivalent with itself.
            : null // NaN is not comparable with a real number.
  })

  // comparing operators for instance values
  link(proto, '>', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order > 0 : null
  })
  link(proto, '>=', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order >= 0 : null
  })
  link(proto, '<', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order < 0 : null
  })
  link(proto, '<=', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order <= 0 : null
  })

  // override equivalence logic since 0 != -0 != +0 by identity-base test.
  link(proto, ['equals', '=='], function (another) {
    return this === another || (isNaN(this) && isNaN(another))
  }, ['not-equals', '!='], function (another) {
    return this !== another && (!isNaN(this) || !isNaN(another))
  })

  // support common math operations
  link(proto, 'abs', function () {
    return Math.abs(this)
  })
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
  }, 'not-empty', function () {
    return this !== 0 && !isNaN(this)
  })

  // Representation & Description
  link(proto, 'to-string', function (format) {
    switch (format) {
      case 'h': case 'hex': return '0x' + this.toString(16)
      case 'o': case 'oct': return '0' + this.toString(8)
      case 'b': case 'bin': return '0b' + this.toString(2)
      default: return this.toString()
    }
  })

  // Indexer
  link(proto, ':', function (index, value) {
    return typeof index === 'string' ? proto[index]
      : index instanceof Symbol$ ? proto[index.key]
        : typeof index === 'number' ? $Range.of(this, index, value) : null
  })

  // inject type
  Number.prototype.type = Type // eslint-disable-line no-extend-native
}
