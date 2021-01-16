'use strict'

module.exports = function pattern ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // pseudo explicit subject pattern operator '$'.
  staticOperator('$', function () {
    return null // It's implemented in evaluation function.
  })

  // pseudo explicit operation pattern operator ':'.
  staticOperator(':', function () {
    return null // It's implemented in evaluation function.
  })

  // try to resolve a symbol from the global space.
  staticOperator('..', function (space, clause) {
    var clist = clause.$
    if (clist.length > 1) {
      var sym = clist[1]
      if (sym instanceof Tuple$) {
        sym = evaluate(sym, space)
      }
      if (sym instanceof Symbol$) {
        return $[sym.key]
      }
    }
    return null
  })
}
