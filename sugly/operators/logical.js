'use strict'

module.exports = function operators$logical ($) {
  var $operators = $.$operators
  var seval = $.$eval

  $operators['&&'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    var base = seval(clause[1], $)
    if (base === false || base === null || base === 0) {
      return base
    }

    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (value === false || value === null || value === 0) {
        return value
      } else {
        base = value
      }
    }
    return base
  }

  $operators['||'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    var base = seval(clause[1], $)
    if (base !== false && base !== null && base !== 0) {
      return base
    }

    for (var i = 2; i < length; i++) {
      var value = seval(clause[i], $)
      if (value !== false && value !== null && value !== 0) {
        return value
      } else {
        base = value
      }
    }
    return base
  }

  $operators['!'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return true // !null
    }

    var base = seval(clause[1], $)
    return base === false || base === null || base === 0
  }
}
