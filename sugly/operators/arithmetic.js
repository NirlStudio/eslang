'use strict'

module.exports = function operators$arithmetic ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var assign = $void.assign
  var resolve = $void.resolve
  var Symbol$ = $void.Symbol

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
