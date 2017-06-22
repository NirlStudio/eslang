'use strict'

module.exports = function operators$quote ($void) {
  var staticOperator = $void.staticOperator

  // (` symbol) or (` (...))
  staticOperator('`', function (space, clause) {
    return clause.$.length > 1 ? clause.$[1] : null
  })
}
