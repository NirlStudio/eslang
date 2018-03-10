'use strict'

module.exports = function operator ($void) {
  var $ = $void.$
  var $Operator = $.operator
  var operatorOf = $void.operatorOf
  var staticOperator = $void.staticOperator

  // create the operator to define an operator
  staticOperator('=?', function (space, clause) {
    return clause.$.length < 2 ? $Operator.noop : operatorOf(space, clause)
  })
}
