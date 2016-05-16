'use strict'

module.exports = function operators$let ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var Symbol$ = $void.Symbol

  function assignAs (local) {
    var assign = local ? $void.set : $void.assign

    return function $assigning ($, clause) {
      var length = clause.length
      if (length < 2) {
        return null
      }

      var c1 = clause[1]
      // (let symbol value)
      if (c1 instanceof Symbol$) {
        return assign($, c1, length < 3 ? null : evaluate(clause[2], $))
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
            last = assign($, p0, evaluate(pair[1], $))
            continue
          }
        }
        last = null
      }
      return last
    }
  }

  // (var var-name value) or (var (var-name value) ...)
  operators['var'] = assignAs(true)

  // (let var-name value) or (let (var-name value) ...)
  operators['let'] = assignAs(false)
}
