'use strict'

module.exports = function operators$arithmetic ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var assign = $void.assign
  var resolve = $void.resolve
  var Symbol$ = $void.Symbol

  function multiply (space, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = evaluate(clause[1], space)
    if (typeof result !== 'number') {
      return 0
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (typeof value === 'number') {
        result *= value
      } else {
        return 0
      }
    }
    return result
  }

  operators['*='] = function (space, clause) {
    var result = multiply(space, clause)
    var sym = clause[1]
    if (sym instanceof Symbol$) {
      assign(space, sym, result)
    }
    return result
  }

  function divide (space, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = evaluate(clause[1], space)
    if (typeof result !== 'number') {
      return 0
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (typeof value === 'number') {
        result /= value
      } else {
        return NaN
      }
    }
    return result
  }

  operators['/='] = function (space, clause) {
    var result = divide(space, clause)
    var sym = clause[1]
    if (sym instanceof Symbol$) {
      assign(space, sym, result)
    }
    return result
  }

  operators['++'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return 1
    }

    var sym = clause[1]
    if (sym instanceof Symbol$) {
      var value = resolve(space, sym)
      if (typeof value === 'number') {
        value += 1
      } else {
        value = 1
      }
      assign(space, sym, value)
      return value
    }

    if (Array.isArray(sym)) {
      sym = evaluate(space, sym)
    }
    return typeof sym === 'number' ? sym + 1 : 1
  }

  operators['--'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return -1
    }

    var sym = clause[1]
    if (sym instanceof Symbol$) {
      var value = resolve(space, sym)
      if (typeof value === 'number') {
        value -= 1
      } else {
        value = -1
      }
      assign(space, sym, value)
      return value
    }

    if (Array.isArray(sym)) {
      sym = evaluate(space, sym)
    }
    return typeof sym === 'number' ? sym - 1 : -1
  }
}
