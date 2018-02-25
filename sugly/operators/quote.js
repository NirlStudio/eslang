'use strict'

module.exports = function quote ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var staticOperator = $void.staticOperator

  // (` symbol) or (` (...))
  staticOperator('`', function (space, clause) {
    return clause.$.length > 1 ? clause.$[1] : $Symbol.empty
  })
}
