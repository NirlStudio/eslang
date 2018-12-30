'use strict'

module.exports = function ($void) {
  var Signal$ = $void.Signal
  var evaluate = $void.evaluate

  $void.signalOf = function $signalOf (type) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        throw new Signal$(type, 0, null)
      }
      if (length === 2) {
        throw new Signal$(type, 1, evaluate(clist[1], space))
      }
      var result = []
      var i
      for (i = 1; i < length; i++) {
        result.push(evaluate(clist[i], space))
      }
      throw new Signal$(type, i - 1, result)
    }
  }
}
