'use strict'

module.exports = function (exporting, context, $void) {
  if (typeof window === 'undefined') {
    return 'web module is only available when hosted in web browser'
  }
  $void.safelyAssign(exporting, window)
  return true
}
