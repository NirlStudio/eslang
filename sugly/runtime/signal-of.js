'use strict'

module.exports = function ($void) {
  var Signal$ = $void.Signal
  var evaluate = $void.evaluate

  $void.signalOf = function $signalOf (type) {
    return function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        throw new Signal$(type, null, 0)
      }
      if (length === 2) {
        throw new Signal$(type, evaluate(clist[1], space), 1)
      }
      var result = []
      var i
      for (i = 1; i < length; i++) {
        result.push(evaluate(clist[i], space))
      }
      throw new Signal$(type, result, i - 1)
    }
  }
}
