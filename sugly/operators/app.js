'use strict'

module.exports = function quote ($void) {
  var $ = $void.$
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // ($ subject)
  staticOperator('$', function (space, clause) {
    var clist = clause.$
    var subject = clist.length < 2 ? null
      : space.inop ? evaluate(clist[1], space) : clist[1]
    if (subject instanceof Symbol$) {
      return (space.app || $)[subject.key]
    } else if (typeof subject === 'string') {
      return (space.app || $)[subject]
    }
    return null
  })
}
