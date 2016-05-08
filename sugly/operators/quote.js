'use strict'

module.exports = function operators$quote ($) {
  var $operators = $.$operators

  // (` symbol) or (` (...))
  $operators['`'] = function ($, clause) {
    return clause.length > 1 ? clause[1] : null
  }

  // a more readable version of `
  $operators['quote'] = $operators['`']
}
