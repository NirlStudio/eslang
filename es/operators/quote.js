'use strict'

module.exports = function quote ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var staticOperator = $void.staticOperator

  // (` symbol), (` value) or (` (...))
  staticOperator('`', function (space, clause) {
    return clause.$.length > 1 ? clause.$[1] : $Symbol.empty
  })

  // (quote symbol-or-value ...)
  staticOperator('quote', function (space, clause) {
    return clause._quoted || (
      clause._quoted = clause.$.length < 2 ? $Tuple.empty
        : new Tuple$(clause.$.slice(1), false, clause.source)
    )
  })

  // (unquote symbol-or-value ...)
  staticOperator('unquote', function (space, clause) {
    return clause._quoted || (
      clause._quoted = clause.$.length < 2 ? $Tuple.blank
        : new Tuple$(clause.$.slice(1), true, clause.source)
    )
  })
}
