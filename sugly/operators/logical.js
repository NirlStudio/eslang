'use strict'

module.exports = function operators$logical ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate

  operators['&&'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    var base = evaluate(clause[1], space)
    if (base === false || base === null || base === 0) {
      return base
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (value === false || value === null || value === 0) {
        return value
      } else {
        base = value
      }
    }
    return base
  }

  operators['||'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }

    var base = evaluate(clause[1], space)
    if (base !== false && base !== null && base !== 0) {
      return base
    }

    for (var i = 2; i < length; i++) {
      var value = evaluate(clause[i], space)
      if (value !== false && value !== null && value !== 0) {
        return value
      } else {
        base = value
      }
    }
    return base
  }

  operators['!'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return true // !null
    }

    var base = evaluate(clause[1], space)
    return base === false || base === null || base === 0
  }
}
