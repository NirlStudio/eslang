'use strict'

function nop () {}

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
    var ending = lines.pop()
    if (lines.length > 0) {
      lines[0] = buffer + lines[0]
      buffer = ending
      console.log(lines.join('\n'))
    } else {
      buffer += ending
    }
  }

  // serve stderr
  term.verbose = nop
  term.info = nop
  term.warn = nop
  term.error = nop
  term.debug = nop

  // serve shell
  var echos = []
  term.echo = function (text) {
    echos.push(text)
  }

  // serve stdin
  var inputPrompt = '>'
  term.prompt = function (text) {
    text && (inputPrompt = text)
  }

  term.connect = function (reader) {
    window['_$'] = function shell (line) {
      if (typeof line === 'string') {
        reader(line)
        if (echos.length > 0) {
          var output = echos.join('\n '); echos = []
          return output
        }
        if (!inputPrompt.startsWith('>')) {
          console.info(inputPrompt)
        }
      } else {
        console.error('input is not a string:', line)
      }
    }
    return reader
  }
  term.disconnect = function () {
    window['_$'] = null
  }
  return term
}
