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
    return isNaN(value) && typeof defaultValue === 'number'
      ? defaultValue : value
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
    if (typeof this !== 'number') {
      return null
    }
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
    if (typeof this !== 'number') {
      return null
    }
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
    if (typeof this !== 'number') {
      return null
    }
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
    if (typeof this !== 'number') {
      return null
    }
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
  var copyType = $void.copyType
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer

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
  var parse = link(Type, 'parse', function (str) {
    return str && typeof str === 'string' ? parseFloat(str) : NaN
  })

  // parse a string as an integer value.
  var parseInteger = link(Type, 'parse-int', createIntParser($void))

  // get a number value from the input
  var valueOf = link(Type, 'of', createValueOf($void, parse))

  // get an integer value from the input
  var intOf = link(Type, 'of-int', createIntValueOf($void, parseInteger))

  // get an signed integer value which is stable with bitwise operation.
  link(Type, 'of-bits', function (input, defaultValue) {
    var int = intOf(input, defaultValue)
    return int >> 0
  })

  typeIndexer(Type)

  var proto = Type.proto
  // test for special values
  link(proto, 'is-valid', function () {
    return typeof this === 'number' ? !isNaN(this) : null
  }, 'is-not-valid', function () {
    return typeof this === 'number' ? isNaN(this) : null
  })
  link(proto, 'is-int', function () {
    return Number.isSafeInteger(this)
  }, 'is-not-int', function () {
    return !Number.isSafeInteger(this)
  })
  link(proto, 'is-bits', function () {
    return typeof this === 'number' ? this >= minBits && this <= maxBits : null
  }, 'is-not-bits', function () {
    return typeof this === 'number' ? this < minBits || this > maxBits : null
  })
  link(proto, 'is-finite', function () {
    return typeof this === 'number' ? isFinite(this) : null
  }, 'is-infinite', function () {
    return typeof this === 'number' ? !isFinite(this) : null
  })

  // support basic arithmetic operations
  link(proto, ['+', 'and'], numberAnd(valueOf))
  link(proto, ['-', 'subtract'], numberSubtract(valueOf))
  link(proto, ['*', 'times'], numberTimes(valueOf))
  link(proto, ['/', 'divide'], numberDivide(valueOf))

  // bitwise operations
  link(proto, '&', function (value) {
    return typeof this === 'number' ? this & value : null
  })
  link(proto, '|', function (value) {
    return typeof this === 'number' ? this | value : null
  })
  link(proto, '^', function (value) {
    return typeof this === 'number' ? this ^ value : null
  })
  link(proto, '<<', function (offset) {
    return typeof this === 'number' ? this << offset : null
  })
  // use zero-based shift by default since signed shift may cause an implicit conversion.
  link(proto, '>>', function (offset) {
    return typeof this === 'number' ? this >>> offset : null
  })
  // signed right-shift.
  link(proto, '>>>', function (offset) {
    return typeof this === 'number' ? this >> offset : null
  })

  // support ordering logic - comparable
  // For uncomparable entities, comparison result is consistent with the Equivalence.
  // Uncomparable state is indicated by a null and is taken as inequivalent.
  // TODO: isNaN() vs. x !== x ?
  var compare = link(proto, 'compare', function (another) {
    return this === another ? 0
      : typeof this !== 'number' || typeof another !== 'number' ? null
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
    return this === another || compare.call(this, another) === 0
  }, ['not-equals', '!='], function (another) {
    return compare.call(this, another) !== 0
  })

  // support common math operations
  link(proto, 'abs', function () {
    return typeof this === 'number' ? Math.abs(this) : null
  })
  link(proto, 'ceil', function () {
    return typeof this === 'number' ? Math.ceil(this) : null
  })
  link(proto, 'floor', function () {
    return typeof this === 'number' ? Math.floor(this) : null
  })
  link(proto, 'round', function () {
    return typeof this === 'number' ? Math.round(this) : null
  })
  link(proto, 'trunc', function () {
    return typeof this === 'number' ? Math.trunc(this) : null
  })

  typeVerifier(Type)

  // O and NaN are defined as empty.
  link(proto, 'is-empty', function () {
    return typeof this === 'number' ? this === 0 || isNaN(this) : null
  }, 'not-empty', function () {
    return typeof this === 'number' ? this !== 0 && !isNaN(this) : null
  })

  // Encoding
  link(proto, 'to-code', function () {
    return typeof this === 'number' ? this : null
  })

  // Representation & Description
  link(proto, 'to-string', function (format) {
    return typeof this === 'number' ? this.toString() : null
  })

  // Indexer
  nativeIndexer(Type, Number, 'number', function (index, value) {
    if (typeof this !== 'number') {
      return null
    }
    // getting properties
    if (typeof index === 'string') {
      return index === ':' ? null
        : index === 'type' ? Type // fake field
          : typeof proto[index] === 'undefined' ? null : proto[index]
    }
    // create a range by this as Begin, index as End and value as Step.
    return typeof index !== 'number' ? null
      : $Range.of(this, index, typeof value === 'number' ? value : null)
  })
}
