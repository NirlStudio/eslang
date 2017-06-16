'use strict'

function createValueOf ($void, parse) {
  var Integer$ = $void.Integer

  return function (input, defaultValue) {
    var value
    if (typeof input === 'string') {
      value = parse(input)
    } else if (input instanceof Integer$) {
      value = input.number
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
  var Integer$ = $void.Integer
  var copyObject = $void.copyObject
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer

  // the value range and constant values.
  copyObject(Type, Number, {
    MAX_VALUE: 'max',
    MIN_VALUE: 'min',
    POSITIVE_INFINITY: 'infinity',
    NEGATIVE_INFINITY: '-infinity'
  })

  // The empty value
  link(Type, 'empty', 0)

  // parse a string to its number value.
  var parse = link(Type, 'parse', function (str) {
    return str && typeof str === 'string' ? parseFloat(str) : NaN
  })

  // get a number value from the input
  var valueOf = link(Type, 'of', createValueOf($void, parse))

  typeIndexer(Type)

  var proto = Type.proto
  // test for special values
  link(proto, 'is-valid', function () {
    return typeof this === 'number' ? !isNaN(this) : null
  }, 'is-not-valid', function () {
    return typeof this === 'number' ? isNaN(this) : null
  })
  link(proto, 'is-finite', function () {
    return typeof this === 'number' ? isFinite(this) : null
  }, 'is-infinite', function () {
    return typeof this === 'number' ? !isFinite(this) : null
  })

  // support basic arithmetic operations
  link(proto, ['and', '+'], numberAnd(valueOf))
  link(proto, ['subtract', '-'], numberSubtract(valueOf))
  link(proto, ['times', '*'], numberTimes(valueOf))
  link(proto, ['divide', '/'], numberDivide(valueOf))

  // support ordering logic - comparable
  // For uncomparable entities, comparison result is consistent with the Equivalence.
  // Uncomparable state is indicated by a null and is taken as inequivalent.
  // TODO: isNaN() vs. x !== x ?
  var compare = link(proto, 'compare', function (another) {
    if (another instanceof Integer$) {
      another = another.number // number and integer are comparable.
    }
    return this === another ? 0
      : typeof this !== 'number' || typeof another !== 'number' ? null
        : !isNaN(this) && !isNaN(another)
          ? this > another ? 1 : -1
          : isNaN(this) || isNaN(another)
            ? null // NaN is not comparable with a real number.
            : 0    // NaN is equivalent with itself.
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
    return this !== another && compare.call(this, another) !== 0
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
    if (index instanceof Integer$) {
      index = index.number
    }
    return typeof index !== 'number' ? null
      : $Range.of(this, index, typeof value === 'number' ? value
        : value instanceof Integer$ ? value.number : null)
  })
}
