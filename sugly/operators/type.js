'use strict'

module.exports = function operators$type ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var Symbol$ = $void.Symbol

  operators['is'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return true // null is null
    }

    var left = evaluate(clause[1], $)
    if (length < 3) {
      return left === null
    }

    var right = clause[2]
    if (right.key !== 'like' || !(right instanceof Symbol$)) {
      // to be revised.
      right = evaluate(right, $)
      return left instanceof Symbol$ && right ? left.key === right.key : Object.is(left, right)
    }

    for (var i = 3; i < length; i++) {
      var value = evaluate(clause[i], $)
      if (value === null || Object.is(left, value)) {
        continue
      } else if (typeof left !== typeof value) {
        return false
      } else if (value.isPrototypeOf && value.isPrototypeOf(left)) {
        continue
      }
      for (var key in value) {
        if (!left || !left.hasOwnProperty(key)) {
          return false
        }
      }
    }
    return true // all objects are alike with null.
  }

  // typeof: query base type name, test a value, check object's prototype chain
  operators['typeof'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return 'null'
    }

    var value = evaluate(clause[1], $)
    if (length < 3) {
      if (value === null) {
        return 'null'
      }
      if (Array.isArray(value)) {
        return 'array'
      }
      if (value instanceof Date) {
        return 'date'
      }
      // app defined type identifier
      if (typeof value === 'object') {
        if (value.typeId) {
          return value.typeId
        } else if (value instanceof Symbol$) {
          return 'symbol' // polyfill symbol
        }
      }
      var type = typeof value
      return type === 'boolean' ? 'bool' : type
    }

    var expected = evaluate(clause[2], $)
    if (typeof expected === 'string') {
      switch (expected) {
        case 'null':
          return value === null
        case 'bool':
          return typeof value === 'boolean'
        case 'number':
          return typeof value === 'number'
        case 'string':
          return typeof value === 'string'
        case 'symbol':
          return value instanceof Symbol$
        case 'function':
          return typeof value === 'function'
        case 'object':
          return typeof value === 'object'
        /* array and date are also objects */
        case 'array':
          return Array.isArray(value)
        case 'date':
          return value instanceof Date // Would frame-boundary be a problem?
        default:
          return typeof value === 'object' && value !== null && value.typeId === expected
      }
    }
    if (expected && expected.isPrototypeOf && expected.isPrototypeOf(value)) {
      return true
    }
    return false
  }

  // generic type operators being identical with the function version.
  operators['bool'] = function ($, clause) {
    return $.bool(clause.length < 2 ? undefined : evaluate(clause[1], $))
  }

  operators['number'] = function ($, clause) {
    return clause.length < 2 ? 0 : $.number(evaluate(clause[1], $))
  }

  operators['string'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return ''
    }

    var values = []
    for (var i = 1; i < length; i++) {
      values.push(evaluate(clause[i], $))
    }
    return $.string.apply($, values)
  }

  operators['symbol'] = function ($, clause) {
    return clause.length < 2 ? null : $.symbol(evaluate(clause[1], $))
  }

  operators['date'] = function ($, clause) {
    var length = clause.length
    var args = []
    for (var i = 1; i < length; i++) {
      args.push(evaluate(clause[i], $))
    }
    return $.date.apply(null, args)
  }
}
