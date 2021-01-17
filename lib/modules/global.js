'use strict'

module.exports = function (exporting, context, $void) {
  if ($void.isNativeHost) {
    $void.safelyAssign(exporting, global)
  } else {
    $void.safelyAssign(exporting, window)
  }
  return true
}
