'use strict'

module.exports = function operators$ordering ($) {
  var $operators = $.$operators
  var seval = $.$eval

  $operators['>'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return false // null === null
    }

    var left = seval(clause[1], $)
    if (length < 3) {
      return false
    }

    var type = typeof left
    if (type !== 'number' && type !== 'string') {
      if (left instanceof Date) {
        type = 'date'
      } else {
        return false
      }
    }

    var right = seval(clause[2], $)
    if (type === 'date') {
      if (right instanceof Date) {
        return left.getTime() > right.getTime()
      }
    } else if (typeof right === type) {
      return left > right
    }
    return false
  }

  $operators['>='] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return false
    }

    var left = seval(clause[1], $)
    if (length < 3) {
      return false
    }

    var type = typeof left
    if (type !== 'number' && type !== 'string') {
      if (left instanceof Date) {
        type = 'date'
      } else {
        return false
      }
    }

    var right = seval(clause[2], $)
    if (type === 'date') {
      if (right instanceof Date) {
        return left.getTime() >= right.getTime()
      }
    } else if (typeof right === type) {
      return left >= right
    }
    return false
  }

  $operators['<'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return false
    }

    var left = seval(clause[1], $)
    if (length < 3) {
      return false
    }

    var type = typeof left
    if (type !== 'number' && type !== 'string') {
      if (left instanceof Date) {
        type = 'date'
      } else {
        return false
      }
    }

    var right = seval(clause[2], $)
    if (type === 'date') {
      if (right instanceof Date) {
        return left.getTime() < right.getTime()
      }
    } else if (typeof right === type) {
      return left < right
    }
    return false
  }

  $operators['<='] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return false
    }

    var left = seval(clause[1], $)
    if (length < 3) {
      return false
    }

    var type = typeof left
    if (type !== 'number' && type !== 'string') {
      if (left instanceof Date) {
        type = 'date'
      } else {
        return false
      }
    }

    var right = seval(clause[2], $)
    if (type === 'date') {
      if (right instanceof Date) {
        return left.getTime() <= right.getTime()
      }
    } else if (typeof right === type) {
      return left <= right
    }
    return false
  }
}
