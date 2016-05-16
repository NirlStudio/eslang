'use strict'

module.exports = function operators$arithmetic ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var assign = $void.assign
  var resolve = $void.resolve
  var Symbol$ = $void.Symbol

  function multiply ($, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = evaluate(clause[1], $)
    if (typeof result !== 'number') {
      return 0
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], $)
      if (typeof value === 'number') {
        result *= value
      } else {
        return 0
      }
    }
    return result
  }

  operators['*='] = function ($, clause) {
    var result = multiply($, clause)
    var sym = clause[1]
    if (sym instanceof Symbol$) {
      assign($, sym, result)
    }
    return result
  }

  function divide ($, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = evaluate(clause[1], $)
    if (typeof result !== 'number') {
      return 0
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], $)
      if (typeof value === 'number') {
        result /= value
      } else {
        return NaN
      }
    }
    return result
  }

  operators['/='] = function ($, clause) {
    var result = divide($, clause)
    var sym = clause[1]
    if (sym instanceof Symbol$) {
      assign($, sym, result)
    }
    return result
  }

  operators['++'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return 1
    }

    var sym = clause[1]
    if (sym instanceof Symbol$) {
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
      sym = evaluate($, sym)
    }
    return typeof sym === 'number' ? sym + 1 : 1
  }

  operators['--'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return -1
    }

    var sym = clause[1]
    if (sym instanceof Symbol$) {
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
      sym = evaluate($, sym)
    }
    return typeof sym === 'number' ? sym - 1 : -1
  }
}
