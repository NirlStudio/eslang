'use strict'

module.exports = function operators$let ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var Symbol$ = $void.Symbol

  // 'let' accesses variables in most recent space.
  // (let var-name value) or (let (var-name value) ...)
  operators['let'] = function $assigning (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    // (let symbol value)
    var c1 = clause[1]
    if (c1 instanceof Symbol$) {
      return (space.$[c1.key] = length < 3 ? null : evaluate(clause[2], space))
    } else if (!Array.isArray(c1)) {
      return null
    }

    // (let (symbol value) ...)
    var last = null
    for (var i = 1; i < length; i++) {
      var pair = clause[i]
      if (Array.isArray(pair) && pair.length > 1) {
        var p0 = pair[0]
        if (p0 instanceof Symbol$) {
          last = space.$[p0.key] = evaluate(pair[1], space)
          continue
        }
      }
      last = null
    }
    return last
  }

  // var is only an alias of let to be used when a varible is used first time.
  operators['var'] = operators['let']

  function globalGet (space, sym) {
    return !space.moduleIdentifier && space.parent
      ? space.parent.$[sym.key] : space.$[sym.key]
  }

  function globalSet (space, sym, value) {
    return !space.moduleIdentifier && space.parent
      ? (space.parent.$[sym.key] = value) : (space.$[sym.key] = value)
  }

  // 'global' accesses variables shared in module space. It's identical with
  // let/var when being used in module context.
  // (global var-name value) or (global (var-name value) ...)
  operators['global'] = function $assigning (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    // (global symbol [value])
    var c1 = clause[1]
    if (c1 instanceof Symbol$) {
      return length < 3 ? globalGet(space, c1)
        : globalSet(space, c1, evaluate(clause[2], space))
    } else if (!Array.isArray(c1)) {
      return null
    }

    // (let (symbol value) ...)
    var last = null
    for (var i = 1; i < length; i++) {
      var pair = clause[i]
      if (Array.isArray(pair) && pair.length > 1) {
        var p0 = pair[0]
        if (p0 instanceof Symbol$) {
          last = globalSet(space, p0, evaluate(pair[1], space))
          continue
        }
      }
      last = null
    }
    return last
  }
}
