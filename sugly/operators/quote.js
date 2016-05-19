'use strict'

module.exports = function operators$quote ($void) {
  var operators = $void.operators
  var nothing = $void.$.Symbol.Nothing

  // (` symbol) or (` (...))
  operators['`'] = function opr_quote ($, clause) {
    return clause.length > 1 ? clause[1] : nothing
  }

  // a more readable version of `
  operators['quote'] = operators['`']
}
