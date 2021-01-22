'use strict'

module.exports = function stdinIn ($void, term) {
  var stdin = Object.create(null)
  stdin.echo = term.echo
  stdin.prompt = term.prompt

  var connected = false
  var interpret = null
  var reader = function (line) {
    return interpret && interpret(line)
  }

  stdin.open = function open () {
    if (!connected) {
      connected = true
      term.connect(reader)
    }
  }

  stdin.on = function on (event, callback) {
    connected || stdin.open()
    switch (event) {
      case 'line':
        interpret = callback
        return event
      default:
        return null
    }
  }

  stdin.close = function close () {
    if (connected) {
      term.disconnect()
      interpret = null
      connected = false
    }
  }

  return stdin
}
