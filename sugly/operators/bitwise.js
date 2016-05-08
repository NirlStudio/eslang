'use strict'

module.exports = function operators$bitwise ($) {
  var $operators = $.$operators
  var seval = $.$eval

  $operators['~'] = function ($, clause) {
    var length = clause.length
    return length > 1 ? ~seval(clause[1], $) : -1 // !0
  }
}
