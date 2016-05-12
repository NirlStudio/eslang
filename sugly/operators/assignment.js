'use strict'

module.exports = function operators$let ($) {
  var $operators = $.$operators
  var seval = $.$eval
  var isSymbol = $.Symbol['is-type-of']

  function assignAs (local) {
    var assign = local ? $.$set : $.$assign

    return function $assigning ($, clause) {
      var length = clause.length
      if (length < 2) {
        return null
      }

      var c1 = clause[1]
      // (let symbol value)
      if (isSymbol(c1)) {
        return assign($, c1, length < 3 ? null : seval(clause[2], $))
      } else if (!Array.isArray(c1)) {
        return null
      }

      // (let (symbol value) ...)
      var last = null
      for (var i = 1; i < length; i++) {
        var pair = clause[i]
        if (Array.isArray(pair) && pair.length > 1) {
          var p0 = pair[0]
          if (isSymbol(p0)) {
            last = assign($, p0, seval(pair[1], $))
            continue
          }
        }
        last = null
      }
      return last
    }
  }

  // (var var-name value) or (var (var-name value) ...)
  $operators['var'] = assignAs(true)

  // (let var-name value) or (let (var-name value) ...)
  $operators['let'] = assignAs(false)
}
