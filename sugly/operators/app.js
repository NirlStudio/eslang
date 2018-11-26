'use strict'

module.exports = function quote ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // ($ sym)
  staticOperator('$', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    var sym = clist[1]
    if (sym instanceof Tuple$) {
      sym = evaluate(sym, space)
    }
    if (sym instanceof Symbol$) {
      return (space.app || $)[sym.key]
    } else if (typeof sym === 'string') {
      return (space.app || $)[sym]
    }
    return null
  })
}
