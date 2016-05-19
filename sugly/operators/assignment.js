'use strict'

module.exports = function operators$let ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var Symbol$ = $void.Symbol

  function assignAs (local) {
    var assign = local ? function $let (space, sym, value) {
      return (space.$[sym.key] = value)
    } : function $global (space, sym, value) {
      return !space.moduleIdentifier && space.parent
        ? (space.parent.$[sym.key] = value) : (space.$[sym.key] = value)
    }

    return function $assigning (space, clause) {
      var length = clause.length
      if (length < 2) {
        return null
      }

      var c1 = clause[1]
      // (let symbol value)
      if (c1 instanceof Symbol$) {
        return assign(space, c1, length < 3 ? null : evaluate(clause[2], space))
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
            last = assign(space, p0, evaluate(pair[1], space))
            continue
          }
        }
        last = null
      }
      return last
    }
  }

  // 'let' accesses variables in most recent space.
  // (let var-name value) or (let (var-name value) ...)
  operators['let'] = assignAs(true)

  // var is only an alias of let to be used when a varible is used first time.
  operators['var'] = assignAs(true)

  // 'global' accesses variables shared in module space. It's identical with
  // let/var when being used in module context.
  // (global var-name value) or (global (var-name value) ...)
  operators['global'] = assignAs(false)
}
