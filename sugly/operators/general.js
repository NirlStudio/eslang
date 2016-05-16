'use strict'

module.exports = function operators$general ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var assign = $void.assign
  var Symbol$ = $void.Symbol

  function concat ($, str, clause) {
    var length = clause.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], $)
      if (typeof value === 'string') {
        str += value
      } else {
        str += $.encode.value(value)
      }
    }
    return str
  }

  function merge ($, base, clause, target) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    if (typeof target !== 'object' || target === null) {
      target = base
      if (typeof target !== 'object' || target === null) {
        return null
      }
    } else {
      Object.assign(target, base)
    }

    for (var i = 2; i < length; i++) {
      Object.assign(target, evaluate(clause[i], $))
    }
    return target
  }

  function sum ($, num, clause) {
    var length = clause.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], $)
      if (typeof value === 'number') {
        num += value
      }
    }
    return num
  }

  operators['+'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return 0
    }

    var base = evaluate(clause[1], $)
    if (length === 2) {
      return typeof base === 'object' ? merge($, base, clause, $.object()) : base
    }

    if (typeof base === 'number') {
      return sum($, base, clause)
    }
    if (typeof base === 'string') {
      return concat($, base, clause)
    }
    if (typeof base === 'object') {
      return merge($, base, clause, $.object()) // combination
    }
    return base // return the first argument for other types
  }

  operators['+='] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return 0
    }

    var sym = clause[1]
    var base = evaluate(sym, $)
    if (length === 2) {
      return base
    }

    if (typeof base === 'number') {
      base = sum($, base, clause)
    } else if (typeof base === 'string') {
      base = concat($, base, clause)
    } else if (typeof base === 'object') {
      return merge($, base, clause, null) // mixin
    } else {
      return base // for other types
    }
    // try to assign value back for primal types
    return sym instanceof Symbol$ ? assign($, sym, base) : base
  }

  function subtract ($, clause) {
    var length = clause.length
    if (length < 2) { return 0 }

    var result = evaluate(clause[1], $)
    if (typeof result !== 'number') {
      if (typeof result !== 'string' || length < 3) {
        return result
      }
      var minuend = evaluate(clause[2], $)
      if (typeof minuend === 'string') {
        return result.split(minuend).join('')
      }
      if (typeof minuend === 'number') {
        return minuend > result.length ? '' : result.substr(0, result.length - minuend)
      }
      return result
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], $)
      if (typeof value === 'number') {
        result -= value
      }
    }
    return result
  }

  operators['-'] = subtract
  operators['-='] = function ($, clause) {
    var result = subtract($, clause)
    var sym = clause[1]
    if (sym instanceof Symbol$) {
      assign($, sym, result)
    }
    return result
  }
}
