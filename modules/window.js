'use strict'

module.exports = function (exporting, context, $void) {
  if (typeof window === 'undefined') {
    // window can also be provided/mocked by an application.
    return 'window is only available in web browser.'
  }
  $void.safelyAssign(exporting, window)
  return true
}
