'use strict'

module.exports = function $shell ($void, reader, proc) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var printf = $void.$printf
  var thisCall = $void.thisCall

  var context = Object.create(null)
  var interpreter = require('./interpreter')($void)

  context['test-bootstrap'] = require('../test/test')($void)
  context['.loader'] = $void.loader.cache.store

  return function agent (args, echo) {
    var echoing = false
    if (typeof echo !== 'function') {
      echo = print.bind(null, '=')
    }

    function exit () {
      print('See you again.')
      reader.close()
      return proc.exit(0)
    }

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

    function explain (status) {
      status === 'exiting' ? echo(exit())
        : warn.apply(null, Array.prototype.slice.call(arguments, 1))
    }

    //  toggle on/of the printing of evaluation result.
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
      var isDebugging = $void.env('is-debugging')
      return typeof enabled === 'undefined' ? isDebugging
        : $void.env('is-debugging',
          enabled !== null && enabled !== 0 && enabled !== false
        )
    }
    //  display or update logging level.
    context['.logging'] = function logging (level) {
      var loggingLevel = $void.env('logging-level')
      return typeof level !== 'number' ? loggingLevel
        : $void.env('logging-level', (level >>= 0) < 0 ? 0
          : level > 127 ? 127 : level
        )
    }

    var interpret = interpreter(function (value, status) {
      if (status) {
        explain(status)
      } else if (echoing) {
        resolve(value)
      }
    }, context, proc.env('PWD'))

    // display version.
    interpret('(run "tools/version")\n')

    // expose local loader cache.
    printf('# object', 'gray'); printf(' .loader', 'yellow')
    printf(', and', 'gray')
    printf(' functions', 'gray'); printf(' .echo', 'blue')
    printf(',', 'gray'); printf(' .debug', 'blue')
    printf(' and', 'gray'); printf(' .logging', 'blue')
    printf(' are imported.\n', 'gray')

    // initialize shell environment
    interpret('(var * (load "profile"))\n')
    echoing = true

    // waiting for input
    reader.prompt()
    reader.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      reader.prompt(depth > 1 ? '..' : '> ')
    })
  }
}
