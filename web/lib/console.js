'use strict'

function bind (type, prefix) {
  return (console[type] || console.log).bind(console, prefix)
}

module.exports = function () {
  var term = {}
  var buffer = ''

  // serve stdout
  term.print = function (text) {
    if (buffer) {
      text = buffer + text
      buffer = ''
    }
    console.log(text)
  }
  term.printf = function (text) {
    var lines = text.split('\n')
    buffer = lines.pop()
    buffer && lines.push(buffer + '...')
    console.log(lines.join('\n'))
  }

  // serve stderr
  term.verbose = bind('verbose', '#V')
  term.info = bind('info', '#I')
  term.warn = bind('warn', '#W')
  term.error = bind('error', '#E')
  term.debug = bind('debug', '#D')

  // serve shell
  term.echo = function (text) {
    console.log('=', text)
  }

  // serve stdin
  var inputPrompt = '>'
  term.prompt = function (text) {
    text && (inputPrompt = text)
  }

  term.connect = function (reader) {
    window['_$'] = function shell (line) {
      typeof line === 'string' ? reader(line)
        : console.log(inputPrompt, '...')
    }
    return reader
  }
  term.disconnect = function () {
    window['_$'] = null
  }
  return term
}
