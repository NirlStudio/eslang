'use strict'

module.exports = function operators$bitwise ($void) {
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  staticOperator('~', function (space, clause) {
    if (clause.$.length > 1) {
      var value = evaluate(clause.$[1], space)
      return typeof value === 'number' ? ~value : ~0
    }
    return ~0
  })
}
