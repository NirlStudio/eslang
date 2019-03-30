'use strict'

module.exports = function (exporting) {
  if (typeof window === 'undefined') {
    return 'web module is only available when hosted in web browser'
  }

  // exports may be wrapped in future.
  exporting.window = window
  exporting.location = window.location
  exporting.document = window.document
  exporting.navigator = window.navigator
  return true
}
