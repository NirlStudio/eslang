'use strict'

var readline = require('readline')
var proc = global.process

module.exports = function ($void) {
  var reader = null
  function open () {
    if (!reader) {
      reader = readline.createInterface({
        input: proc.stdin,
        output: proc.stdout
      })
    }
    return reader
  }

  return {
    open: open,
    prompt: function (text) {
      if (!reader) { open() }
      if (typeof text === 'string') {
        reader.setPrompt(text)
      }
      reader.prompt()
    },
    on: function (event, callback) {
      if (!reader) { open() }
      // only allow line event now.
      switch (event) {
        case 'line':
          reader.on('line', callback)
          return event
        default:
          return null
      }
    },
    close: function () {
      if (reader) {
        reader.close()
        reader = null
      }
    }
  }
}
