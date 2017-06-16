'use strict'

function createParser ($void) {
  var integerOf = $void.integerOf

  return function (input, radix) {
    if (typeof input !== 'string') {
      return integerOf(0)
    }
    if (typeof radix !== 'number' || radix < 2) {
      if (input.startsWith('0x')) {
        radix = 16
        input = input.substring(2)
      } else if (input.startsWith('0b')) {
        radix = 2
        input = input.substring(2)
      } else if (input.startsWith('0')) {
        radix = 8
        input = input.substring(1)
      } else {
        radix = 10
      }
    }
    var value = parseInt(input, radix)
    return integerOf(value)
  }
}

function createValueOf ($void, parse) {
  var Integer$ = $void.Integer
  var integerOf = $void.integerOf

  return function (input, radix) {
    if (typeof input === 'string') {
      return parse(input, radix)
    }
    if (typeof input === 'number') {
      return integerOf(input)
    }
    if (typeof input === 'boolean') {
      return integerOf(input ? 1 : 0)
    }
    if (typeof input === 'undefined' || input === null) {
      return integerOf(0)
    }
    return input instanceof Integer$ ? input : integerOf(0)
  }
}

function numberAnd ($void, valueOf) {
  var Integer$ = $void.Integer
  var integerOf = $void.integerOf

  return function () {
    if (!(this instanceof Integer$)) {
      return null
    }
    var result = this.number
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result += arg instanceof Integer$ ? arg.number : valueOf(arg).number
    }
    return integerOf(result)
  }
}

function numberSubtract ($void, valueOf) {
  var Integer$ = $void.Integer
  var integerOf = $void.integerOf

  return function () {
    if (!(this instanceof Integer$)) {
      return null
    }
    var result = this.number
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result -= arg instanceof Integer$ ? arg.number : valueOf(arg).number
    }
    return integerOf(result)
  }
}

function numberTimes ($void, valueOf) {
  var Integer$ = $void.Integer
  var integerOf = $void.integerOf

  return function () {
    if (!(this instanceof Integer$)) {
      return null
    }
    var result = this.number
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result *= arg instanceof Integer$ ? arg.number : valueOf(arg).number
    }
    return integerOf(result)
  }
}

function numberDivide ($void, valueOf) {
  var Integer$ = $void.Integer
  var integerOf = $void.integerOf

  return function () {
    if (!(this instanceof Integer$)) {
      return null
    }
    var result = this.number
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      result = Math.trunc(result /
        (arg instanceof Integer$ ? arg.number : valueOf(arg).number))
    }
    return integerOf(result)
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.integer
  var $Number = $.number
  var link = $void.link
  var $Range = $.range
  var Integer$ = $void.Integer
  var integerOf = $void.integerOf
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var createProtoIndexer = $void.createProtoIndexer
  var numberCompare = $Number.compare

  // the safe (valid) integer value range
  link(Type, 'max', integerOf(Number.MAX_SAFE_INTEGER))
  link(Type, 'min', integerOf(Number.MIN_SAFE_INTEGER))

  // support bitwise operations for 32-bit integer values.
  link(Type, 'bits', integerOf(32))
  link(Type, 'max-bits', integerOf(Math.pow(2, 31) - 1))
  link(Type, 'min-bits', integerOf(-Math.pow(2, 31)))

  // empty value
  link(Type, 'empty', integerOf(0))

  // parse an string to its integer value
  var parse = link(Type, 'parse', createParser($void))

  // override to return an integer instance.
  link(Type, 'of', createValueOf($void, parse))

  typeIndexer(Type)

  var proto = Type.proto

  // extend the base number type to test a valid integer.
  link($Number.proto, 'is-integer', function () {
    return Number.isSafeInteger(this)
  }, 'is-not-integer', function () {
    return !Number.isSafeInteger(this)
  })
  // override to return the fixed result.
  link(proto, 'is-integer', function () {
    return true
  }, 'is-not-integer', function () {
    return false
  })

  // a real number to an integer
  link($Number.proto, 'to-integer', function () {
    return integerOf(this)
  })
  // override to return itself.
  link(proto, 'to-integer', function () {
    return this
  })

  // override for the property of integer values.
  link(proto, 'is-valid', function () {
    return true // an integer always has a valid value.
  }, 'is-not-valid', function () {
    return false
  })
  link(proto, 'is-finite', function () {
    return true  // an integer always is finite.
  }, 'is-infinite', function () {
    return false
  })

  // support basic arithmetic operations
  link(proto, ['and', '+'], numberAnd(valueOf))
  link(proto, ['subtract', '-'], numberSubtract(valueOf))
  link(proto, ['times', '*'], numberTimes(valueOf))
  link(proto, ['divide', '/'], numberDivide(valueOf))

  // bitwise operations
  link(proto, '&', function (value) {
    return this instanceof Integer$ ? integerOf(this.number & value) : null
  })
  link(proto, '|', function (value) {
    return this instanceof Integer$ ? integerOf(this.number | value) : null
  })
  link(proto, '^', function (value) {
    return this instanceof Integer$ ? integerOf(this.number ^ value) : null
  })
  link(proto, '~', function () {
    return this instanceof Integer$ ? integerOf(~(this.number)) : null
  })
  link(proto, '<<', function (offset) {
    return this instanceof Integer$ ? integerOf(this.number << offset) : null
  })
  link(proto, '>>', function (offset) {
    return this instanceof Integer$ ? integerOf(this.number >> offset) : null
  })
  link(proto, '>>>', function (offset) {
    return this instanceof Integer$ ? integerOf(this.number >>> offset) : null
  })

  // Ordering
  var compare = link(proto, 'compare', function number$compare (another) {
    return this instanceof Integer$
      ? numberCompare.call(this.number, another) // to ensure the symmetry.
      : null // invalid type.
  })

  // comparing operators
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

  // support common math operations
  link(proto, 'abs', function () {
    return this instanceof Integer$
      ? this.number >= 0 ? this : integerOf(-this.number)
      : null
  })
  link(proto, 'ceil', function () {
    return this instanceof Integer$ ? this : null
  })
  link(proto, 'floor', function () {
    return this instanceof Integer$ ? this : null
  })
  link(proto, 'round', function () {
    return this instanceof Integer$ ? this : null
  })
  link(proto, 'trunc', function () {
    return this instanceof Integer$ ? this : null
  })

  // override identity logic to ignore the difference of 0, +0, -0.
  link(proto, 'is', function (another) {
    return this === another || (
      this instanceof Integer$ &&
      another instanceof Integer$ &&
      this.number === another.number)
  }, 'is-not', function (another) {
    return this !== another && (
      !(this instanceof Integer$) ||
      !(another instanceof Integer$) ||
      this.number !== another.number)
  })

  // override equivalence logic for integer value.
  link(proto, ['equals', '=='], function (another) {
    return this === another || compare.call(this, another) === 0
  }, ['not-equals', '!='], function (another) {
    return this !== another && compare.call(this, another) !== 0
  })

  // Type Verification
  typeVerifier(Type)

  // O is defined as empty for integer.
  link(proto, 'is-empty', function () {
    return this instanceof Integer$ ? this.number === 0 : null
  }, 'not-empty', function () {
    return this instanceof Integer$ ? this.number !== 0 : null
  })

  // Encoding
  link(proto, 'to-code', function () {
    return this instanceof Integer$ ? this : null
  })

  // Representation
  link(proto, 'to-string', function () {
    return this instanceof Integer$ ? this.number.toString() : null
  })

  // Indexer
  var protoIndexer = createProtoIndexer(Type)
  link(proto, ':', function (index, value) {
    if (!(this instanceof Integer$)) {
      return this === proto ? protoIndexer(index, value) : null
    }
    if (typeof index === 'string') {
      return index === ':' ? null
        : index === 'type' ? Type // fake field
          : index === 'number' ? this.number // fake field to return inner number
            : typeof proto[index] === 'undefined' ? null : proto[index]
    }
    // create a range by this -> begin, index -> end and value -> step.
    if (index instanceof Integer$) {
      index = index.number
    }
    return typeof index !== 'number' ? null
      : $Range.of(this.number, index, typeof value === 'number' ? value
        : value instanceof Integer$ ? value.number : null)
  })
}
