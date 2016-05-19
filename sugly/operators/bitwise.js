'use strict'

module.exports = function operators$bitwise ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate

  operators['~'] = function (space, clause) {
    var length = clause.length
    return length > 1 ? ~evaluate(clause[1], space) : ~0
  }
}
