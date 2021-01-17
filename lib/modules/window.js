'use strict'

module.exports = function (exporting, context, $void) {
  if (typeof window === 'undefined') {
    $void.$warn('module/window', 'window object is missing')
  } else {
    $void.safelyAssign(exporting, window)
  }
  return true
}
