'use strict'

module.exports = function operators$arithmetic ($) {
  var $operators = $.$operators
  var seval = $.$eval
  var assign = $.$assign
  var resolve = $.$resolve
  var isSymbol = $.Symbol['is-type-of']

  function multiply ($, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = seval(clause[1], $)
    if (typeof result !== 'number') {
      return 0
    }

    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (typeof value === 'number') {
        result *= value
      } else {
        return 0
      }
    }
    return result
  }

  $operators['*'] = multiply
  $operators['*='] = function ($, clause) {
    var result = multiply($, clause)
    var sym = clause[1]
    if (isSymbol(sym)) {
      assign($, sym, result)
    }
    return result
  }

  function divide ($, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = seval(clause[1], $)
    if (typeof result !== 'number') {
      return 0
    }

    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (typeof value === 'number') {
        result /= value
      } else {
        return NaN
      }
    }
    return result
  }

  $operators['/'] = divide
  $operators['/='] = function ($, clause) {
    var result = divide($, clause)
    var sym = clause[1]
    if (isSymbol(sym)) {
      assign($, sym, result)
    }
    return result
  }

  $operators['++'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return 1
    }

    var sym = clause[1]
    if (isSymbol(sym)) {
      var value = resolve($, sym)
      if (typeof value === 'number') {
        value += 1
      } else {
        value = 1
      }
      assign($, sym, value)
      return value
    }

    if (Array.isArray(sym)) {
      sym = seval($, sym)
    }
    return typeof sym === 'number' ? sym + 1 : 1
  }

  $operators['--'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return -1
    }

    var sym = clause[1]
    if (isSymbol(sym)) {
      var value = resolve($, sym)
      if (typeof value === 'number') {
        value -= 1
      } else {
        value = -1
      }
      assign($, sym, value)
      return value
    }

    if (Array.isArray(sym)) {
      sym = seval($, sym)
    }
    return typeof sym === 'number' ? sym - 1 : -1
  }
}
