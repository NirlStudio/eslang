'use strict'

module.exports = function operators$general ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var assign = $void.assign
  var Symbol$ = $void.Symbol

  function concat (space, str, clause) {
    var length = clause.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (typeof value === 'string') {
        str += value
      } else {
        var toString = value === null ? 'null'
          : typeof value[':'] === 'function' && value[':']('to-string')
        str += typeof toString === 'function' ? toString.call(value) : 'null'
      }
    }
    return str
  }

  function sum (space, num, clause) {
    var length = clause.length
    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (typeof value === 'number') {
        num += value
      } else {
        num += space.$.Number['value-of'](value)
      }
    }
    return num
  }

  operators['+'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return 0
    }

    var base = evaluate(clause[1], space)
    if (length === 2) {
      return base
    }

    if (typeof base === 'number') {
      return sum(space, base, clause)
    }
    if (typeof base === 'string') {
      return concat(space, base, clause)
    }
    return base // return the first argument for other types
  }

  operators['+='] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return 0
    }

    var sym = clause[1]
    var base = evaluate(sym, space)
    if (length === 2) {
      return base // nop
    }

    if (typeof base === 'number') {
      base = sum(space, base, clause)
    } else if (typeof base === 'string') {
      base = concat(space, base, clause)
    } else {
      return base // for other types
    }

    // try to assign new value back to its symbol
    if (sym instanceof Symbol$) {
      assign(space, sym, base)
    }
    return base
  }

  function subtract (space, num, clause) {
    var length = clause.length
    // negative operator of number
    if (length < 3) {
      return 0 - num
    }

    // subtraction for number
    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (typeof value === 'number') {
        num -= value
      } else {
        num -= space.$.Number['value-of'](value)
      }
    }
    return num
  }

  function trimRight (space, str, clause) {
    // trim for string
    var minuend = evaluate(clause[2], space)
    if (typeof minuend === 'string') {
      var offset = str.lastIndexOf(minuend)
      return offset >= 0 ? str.substring(0, offset) : str
    }
    if (typeof minuend === 'number') {
      if (minuend > str.length) {
        return ''
      } else if (minuend < 0) {
        return str
      }
      return str.substring(0, str.length - minuend)
    }
    return str
  }

  operators['-'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return 0
    }

    var base = evaluate(clause[1], space)
    if (typeof base === 'number') {
      return subtract(space, base, clause)
    } else if (typeof result === 'string' && length > 2) {
      return trimRight(space, base, clause)
    }
    return base
  }

  operators['-='] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return 0
    }

    var sym = clause[1]
    var result = evaluate(sym, space)
    if (typeof result === 'number') {
      result = subtract(space, result, clause)
    } else if (typeof result === 'string' && length > 2) {
      result = trimRight(space, result, clause)
    } else {
      return result
    }

    if (sym instanceof Symbol$) {
      assign(space, sym, result)
    }
    return result
  }

  operators['?'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    var sym = clause[1]
    var value = evaluate(sym, space)
    if (value !== null && value !== 0 && value !== false) {
      return value
    }
    if (length > 2) {
      value = evaluate(clause[2], space)
    } else {
      value = null
    }

    if (sym instanceof Symbol$) {
      assign(space, sym, value)
    }
    return value
  }

  operators['??'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    var sym = clause[1]
    var value = evaluate(sym, space)
    if (value !== null) {
      return value
    }
    if (length > 2) {
      value = evaluate(clause[2], space)
    } else {
      value = null
    }

    if (sym instanceof Symbol$) {
      assign(space, sym, value)
    }
    return value
  }
}
