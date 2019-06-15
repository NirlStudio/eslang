'use strict'

module.exports = function (exporting, context, $void) {
  if (typeof window === 'undefined') {
    // web can also be mocked by application to, for example, in testing.
    return 'web module is only available in web browser.'
  }
  $void.safelyAssign(exporting, window)
  return true
}
