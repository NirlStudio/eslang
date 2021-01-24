'use strict'

module.exports = function shellIn ($void) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var printf = $void.$printf
  var isTruthy = $void.isTruthy
  var thisCall = $void.thisCall
  var safelyAssign = $void.safelyAssign

  var context = Object.create(null)
  var interpreter = require('./interpreter')($void)

  context['test-bootstrap'] = require('../test/test')($void)
  context['.loader'] = safelyAssign(Object.create(null), $void.loader.cache.store)

  return function shell (stdin, exit) {
    var echo = typeof stdin.echo === 'function'
      ? stdin.echo.bind(stdin)
      : print.bind(null, '=')

    // create the interpreter
    function typeInfoOf (prefix, value) {
      var info = '#(' + prefix + thisCall(typeOf(value), 'to-string')
      var name = !value ? ''
        : typeof value.name === 'string' ? value.name
          : ''
      return name ? info + ': ' + name + ')# ' : info + ')# '
    }

    function format (value, prefix) {
      return typeInfoOf(prefix || '', value) + thisCall(value, 'to-string')
    }

    function resolve (value) {
      if (!(value instanceof Promise)) {
        return echo(format(value))
      }
      echo('#(promise: waiting ...)#')
      value.then(function (result) {
        echo(format(result, '... result: '))
      }, function (err) {
        echo(format(err, '... excuse: '))
      })
    }

    function exiting (code) {
      if (typeof code === 'undefined' || code === null) {
        code = 0
      } else {
        if (echoing) {
          echo(format(code))
        }
        code = typeof code === 'number' ? code >> 0 : 1
      }

      code ? printf('Good luck.\n', 'red')
        : printf('See you again.\n', 'green')

      stdin.close()
      return exit(code)
    }

    function explain (status, value) {
      status === 'exiting' ? echo(exiting(value))
        : warn.apply(null, Array.prototype.slice.call(arguments, 1))
    }

    //  toggle on/of the printing of evaluation result.
    var echoing = false
    context['.echo'] = function echo () {
      echoing = !echoing
      if (echoing) {
        return true
      }
      printf('  ') // this is only visible on console.
      return printf('#(bool)# false\n', 'gray')
    }
    //  display, enable or disable debug output.
    context['.debug'] = function debug (enabled) {
      var isDebugging = $void.$env('is-debugging')
      return typeof enabled === 'undefined' ? isDebugging
        : $void.env('is-debugging', isTruthy(enabled))
    }
    //  display or update logging level.
    context['.logging'] = function logging (level) {
      var loggingLevel = $void.$env('logging-level')
      return typeof level !== 'number' ? loggingLevel
        : $void.env('logging-level', (level >>= 0) < 0 ? 0
          : level > 127 ? 127 : level
        )
    }

    var interpret = interpreter(context, function (value, status) {
      if (status) {
        explain(status, value)
      } else if (echoing) {
        resolve(value)
      }
    })

    // initialize shell environment
    interpret('(var path (import ("$eslang/path").\n')
    interpret('(var * (load (path resolve (env "runtime-home"), "profile").\n')
    echoing = true

    // waiting for input
    stdin.prompt()
    stdin.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      stdin.prompt(depth > 1 ? '..' : '> ')
    })
  }
}
