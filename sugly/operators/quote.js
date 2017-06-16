'use strict'

module.exports = function operators$quote ($void) {
  var operators = $void.operators
  var empty = $void.$.Symbol.empty

  // (` symbol) or (` (...))
  operators['`'] = function oprQuote ($, clause) {
    return clause.length > 1 ? clause[1] : empty
  }

  // a more readable version of `
  operators['quote'] = operators['`']
}
