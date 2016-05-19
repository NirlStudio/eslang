'use strict'

module.exports = function signal_of ($void) {
  var Signal = $void.Signal
  var evaluate = $void.evaluate

  $void.signalOf = function $signalOf (type) {
    return function $signal (space, clause) {
      var length = clause.length
      var result = null
      if (length > 1) {
        var c1 = clause[1]
        if (length === 2) {
          // return the only argument directly
          result = evaluate(c1, space)
        } else {
          // return multiple arguments in an array.
          result = []
          for (var i = 1; i < length; i++) {
            result.push(evaluate(clause[i], space))
          }
        }
      }
      throw new Signal(type, result)
    }
  }
}
