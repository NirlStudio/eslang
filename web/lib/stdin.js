'use strict'

module.exports = function ($void, term) {
  var interpreter = null
  var reader = function (line) {
    return interpreter && interpreter(line)
  }

  return {
    open: function () {
      return reader
    },
    prompt: term.prompt,
    on: function (event, callback) {
      // only allow line event now.
      switch (event) {
        case 'line':
          interpreter = callback
          return event
        default:
          return null
      }
    },
    close: function () {
      interpreter = null
    }
  }
}
