'use strict'

module.exports = function (exporting, context, $void) {
  // to connect global shell commands with app space.
  Object.assign(exporting, $void.$shell)
  return true
}
