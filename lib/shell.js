'use strict'

var readline = require('readline')

module.exports = function ($void) {
  var $ = $void.$
  var warn = $.warn
  var print = $.print

  var reader = null
  var feedbackAsCode = false

  return function agent (proc, args) {
    // create console reader
    reader = readline.createInterface({
      input: proc.stdin,
      output: proc.stdout
    })
    // add alias to exit.
    $.quit = $.bye = exit
    function exit () {
      if (reader) {
        print('See you again.')
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
      print('feedback mode:', feedbackAsCode ? 'code' : 'string')
    }
    // create the interpreter
    var interpret = $.interpreter(function (value, status) {
      if (status) {
        if (status === 'exiting') {
          exit()
        } else {
          warn.apply(null, Array.prototype.slice.call(arguments, 1))
        }
      } else {
        if (feedbackAsCode) {
          value = $void.thisCall(value, 'to-code')
        }
        print($void.thisCall(value, 'to-string'))
      }
    }, args, proc.env.PWD)
    // waiting for input
    print('Sugly (' + $void.runtime('core') + ')', $void.runtime('version'))
    reader.prompt()
    reader.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      reader.setPrompt(depth > 1 ? '..' : '> ')
      reader.prompt()
    })
  }
}
