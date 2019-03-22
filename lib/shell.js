'use strict'

module.exports = function ($void, reader, proc) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var thisCall = $void.thisCall

  var feedbackAsCode = false

  return function agent (args, echo) {
    if (!echo) {
      echo = print.bind(null, '=')
    }
    // add alias to exit.
    $.quit = $.bye = exit
    function exit () {
      print('See you again.')
      reader.close()
      return proc.exit(0)
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
    var interpret = $void.$interpreter(function (value, status) {
      if (status) {
        if (status === 'exiting') {
          return echo(exit())
        } else {
          return warn.apply(null, Array.prototype.slice.call(arguments, 1))
        }
      }
      if (!(value instanceof Promise)) {
        var typeInfo = '#(' + thisCall(typeOf(value), 'to-string') + ')# '
        if (feedbackAsCode) {
          value = thisCall(value, 'to-code')
        }
        return echo(typeInfo + thisCall(value, 'to-string'))
      }
      echo('waiting ...')
      value.then(function (result) {
        echo('... result: ' + $void.thisCall(result, 'to-string'))
      }, function (err) {
        echo('... excuse: ' + $void.thisCall(err, 'to-string'))
      })
    }, args, proc.env('PWD'))
    // waiting for input
    print('Sugly (' + $void.runtime('core') + ')', $void.runtime('version'))
    reader.prompt()
    reader.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      reader.prompt(depth > 1 ? '..' : '> ')
    })
  }
}
