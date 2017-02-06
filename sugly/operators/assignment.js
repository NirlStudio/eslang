'use strict'

module.exports = function operators$let ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var assign = $void.assign
  var readonly = $void.readonly
  var Symbol$ = $void.Symbol

  function tryToUpdateName (name, value) {
    if (typeof value === 'function' && (!value.name ||
        typeof value.name !== 'string' || value.name.startsWith('$'))) {
      readonly(value, 'name', name)
    }
    return value
  }

  // 'let' accesses variables in most recent space.
  // (let var-name value) or (let (var-name value) ...)
  operators['let'] = function $let (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    // (let symbol value)
    var c1 = clause[1]
    if (c1 instanceof Symbol$) {
      return assign(space, c1, length < 3 ? null
        : tryToUpdateName(c1.key, evaluate(clause[2], space)))
    } else if (!Array.isArray(c1)) {
      return null
    }

    // (let (symbol value) ...)
    var last = null
    for (var i = 1; i < length; i++) {
      var pair = clause[i]
      if (Array.isArray(pair) && pair.length > 0) {
        var p0 = pair[0]
        if (p0 instanceof Symbol$) {
          last = assign(space, p0, pair.length > 1
            ? tryToUpdateName(p0.key, evaluate(pair[1], space)) : null)
          continue
        }
      }
      last = null
    }
    return last
  }

  // var is only an alias of let to be used when a varible is used first time.
  // TBD - declare a local variable.
  operators['var'] = function $var (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    // (let symbol value)
    var c1 = clause[1]
    if (c1 instanceof Symbol$) {
      return (space.$[c1.key] = length < 3 ? null
        : tryToUpdateName(c1.key, evaluate(clause[2], space)))
    } else if (!Array.isArray(c1)) {
      return null
    }

    // (let (symbol value) ...)
    var last = null
    for (var i = 1; i < length; i++) {
      var pair = clause[i]
      if (Array.isArray(pair) && pair.length > 0) {
        var p0 = pair[0]
        if (p0 instanceof Symbol$) {
          last = space.$[p0.key] = pair.length > 1
            ? tryToUpdateName(p0.key, evaluate(pair[1], space)) : null
          continue
        }
      }
      last = null
    }
    return last
  }
}
