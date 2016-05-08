'use strict'

module.exports = function signal_of ($) {
  var seval = $.$eval
  var $Signal = $.$Signal

  $.$createSignalOf = function createSignalOf (type) {
    return function signalOf ($, clause) {
      var length = clause.length
      var result = null
      if (length > 1) {
        var c1 = clause[1]
        if (length === 2) {
          // return the only argument directly
          result = seval(c1, $)
        } else {
          // return multiple arguments in an array.
          result = []
          for (var i = 1; i < length; i++) {
            result.push(seval(clause[i], $))
          }
        }
      }
      throw new $Signal(type, result)
    }
  }
}
