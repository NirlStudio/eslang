'use strict'

module.exports = function operators$equivalence ($) {
  var $operators = $.$operators
  var seval = $.$eval

  function equalDate ($, base, clause) {
    var length = clause.length
    base = base.getTime()
    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (!(value instanceof Date) || base !== value.getTime()) {
        return false
      }
    }
    return true
  }

  $operators['=='] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return true // null === null
    }

    var base = seval(clause[1], $)
    if (length < 3) {
      return base === null
    }
    if (base instanceof Date) {
      return equalDate($, base, clause)
    }

    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (base !== value) {
        return false
      }
    }
    return true
  }

  $operators['!='] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return false // null !== null
    }

    var base = seval(clause[1], $)
    if (length < 3) {
      return base !== null
    }
    if (base instanceof Date) {
      return !equalDate($, base, clause)
    }

    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (base !== value) {
        return true
      }
    }
    return false
  }
}
