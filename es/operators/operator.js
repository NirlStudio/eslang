'use strict'

module.exports = function operator ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var $Operator = $.operator
  var evaluate = $void.evaluate
  var operatorOf = $void.operatorOf
  var staticOperator = $void.staticOperator

  // create the operator to define an operator
  staticOperator('=?', function (space, clause) {
    return clause.$.length < 2 ? $Operator.noop : operatorOf(space, clause)
  })

  // To resolve a symbol from the original declaration space of an operator.
  // It's designed to be used in an operator, but it falls back to the result of
  // applying operator ".." if it's called in a non-operator space.
  staticOperator('.', function (space, clause) {
    var clist = clause.$
    if (clist.length > 1) {
      var sym = clist[1]
      if (sym instanceof Tuple$) {
        sym = evaluate(sym, space)
      }
      if (sym instanceof Symbol$) {
        return space.$resolve(sym.key)
      }
    }
    return null
  })
}
