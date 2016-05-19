'use strict'

module.exports = function operators$type ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var $bool = $void.$.bool
  var $number = $void.$.number
  var $string = $void.$.string
  var $symbol = $void.$.symbol
  var $date = $void.$.date
  var $class = $void.$.class

  // generic type operators being identical with the function version.
  operators['bool'] = function (space, clause) {
    return $bool(clause.length < 2 ? null : evaluate(clause[1], space))
  }

  operators['number'] = function (space, clause) {
    return $number(clause.length < 2 ? null : evaluate(clause[1], space))
  }

  operators['string'] = function (space, clause) {
    var length = clause.length
    if (length < 2) {
      return ''
    }

    var values = []
    for (var i = 1; i < length; i++) {
      values.push(evaluate(clause[i], space))
    }
    return $string.apply(null, values)
  }

  operators['symbol'] = function (space, clause) {
    return $symbol(clause.length < 2 ? '' : evaluate(clause[1], space))
  }

  operators['date'] = function (space, clause) {
    return $date(clause.length < 2 ? null : evaluate(clause[1], space))
  }

  operators['class'] = function (space, clause) {
    var length = clause.length
    var type = length > 1 ? evaluate(clause[1], space) : null
    var proto = length > 2 ? evaluate(clause[2], space) : null
    return $class(type, proto)
  }
}
