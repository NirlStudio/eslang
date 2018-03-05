'use strict'

var readline = require('readline')

module.exports = function shell ($void) {
  var $ = $void.$
  var reader = null
  var feedbackAsCode = false

  return function agent (proc, options) {
    // create console reader
    reader = readline.createInterface({
      input: proc.stdin,
      output: proc.stdout
    })
    // add alias to exit.
    $.quit = $.bye = exit
    function exit () {
      if (reader) {
        console.log('See you again.')
        reader.close()
        proc.exit(0)
      }
    }
    // toggle feedback mode.
    $['feedback-as'] = function (mode) {
      if (mode === 'code') {
        feedbackAsCode = true
      } else if (mode === 'string') {
        feedbackAsCode = false
      } else {
        feedbackAsCode = !feedbackAsCode
      }
      console.log('feedback mode:', feedbackAsCode ? 'code' : 'string')
    }
    // create the interpreter
    var interpret = $.interpreter(function (value, status) {
      if (status) {
        if (status === 'exiting') {
          exit()
        } else {
          console.warn.apply(console, Array.prototype.slice.call(arguments, 1))
        }
      } else {
        if (feedbackAsCode) {
          value = $void.thisCall(value, 'to-code')
        }
        console.log($void.thisCall(value, 'to-string'))
      }
    }, options, proc.env.PWD)
    // waiting for input
    console.log('Sugly (' + $void.runtime('core') + ')', $void.runtime('version'))
    reader.prompt()
    reader.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      reader.prompt()
      if (depth > 1) {
        reader.write(Array(depth).join('. '))
      }
    })
  }
}
