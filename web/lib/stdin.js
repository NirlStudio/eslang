'use strict'

module.exports = function ($void, term) {
  var interpreter = null
  var reader = function (line) {
    return interpreter && interpreter(line)
  }

  return {
    prompt: term.prompt,
    open: function () {
      return term.connect(reader)
    },
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
      term.disconnect()
    }
  }
}
