'use strict'

module.exports = function quote ($void) {
  var staticOperator = $void.staticOperator

  // pseudo explicit subject pattern operator '$'.
  staticOperator('$', function () {
    return null // It's implemented in evaluation function.
  })

  // pseudo explicit operation pattern operator ':'.
  staticOperator(':', function () {
    return null // It's implemented in evaluation function.
  })
}
