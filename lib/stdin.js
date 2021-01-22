'use strict'

var readline = require('readline')
var colors = require('./colors')

function write (color, text) {
  process.stderr.write(color ? color(text) : text)
}

module.exports = function stdinIn ($void) {
  var stdin = Object.create(null)

  var reader = null
  stdin.open = function open () {
    if (!reader) {
      reader = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
    }
  }

  stdin.prompt = function prompt (text) {
    reader || stdin.open()
    if (typeof text === 'string') {
      reader.setPrompt(text)
    }
    reader.prompt()
  }

  stdin.echo = function echo (message) {
    write(colors.gray, '= ')
    write(colors.green, message.length <= 120
      ? message
      : message.substring(0, 113) + '... ...'
    )
    write(null, '\n')
  }

  stdin.on = function on (event, callback) {
    reader || stdin.open()
    switch (event) {
      case 'line':
        reader.on('line', callback)
        return event
      default:
        return null
    }
  }

  stdin.close = function close () {
    if (reader) {
      reader.close()
      reader = null
    }
  }

  return stdin
}
