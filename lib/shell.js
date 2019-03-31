'use strict'

module.exports = function ($void, reader, proc) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var printf = $void.$printf
  var thisCall = $void.thisCall

  var $shell = $void.$shell = {}

  return function agent (args, echo, profile) {
    var echoing = false
    if (typeof echo !== 'function') {
      echo = print.bind(null, '=')
    }
    if (typeof profile !== 'string' || !profile) {
      profile = '(var * (load "profile"))'
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
        : typeof value.$name === 'string' ? value.$name
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

    var interpret = $void.$interpreter(function (value, status) {
      if (status) {
        explain(status)
      } else if (echoing) {
        resolve(value)
      }
    }, args, proc.env('PWD'))

    // display version.
    interpret('(run "tools/version")\n')

    // expose local loader cache.
    printf('# shell object', 'gray'); printf(' .loader', 'yellow')
    $shell['.loader'] = $void.loader.cache.store

    printf(', and', 'gray')
    printf(' functions', 'gray'); printf(' .echo', 'blue')
    //  toggle on/of the printing of evaluaion result.
    $shell['.echo'] = function echo () {
      echoing = !echoing
      if (echoing) {
        return true
      }
      printf('  ') // this is only visible on console.
      return printf('#(bool)# false\n', 'gray')
    }

    printf(',', 'gray'); printf(' .debug', 'blue')
    //  display, enable or disable debug output.
    $shell['.debug'] = function debug (enabled) {
      var isDebugging = $void.env('is-debugging')
      return typeof enabled === 'undefined' ? isDebugging
        : $void.env('is-debugging',
          enabled !== null && enabled !== 0 && enabled !== false
        )
    }

    printf(' and', 'gray'); printf(' .logging', 'blue')
    //  display or update logging level.
    $shell['.logging'] = function logging (level) {
      var loggingLevel = $void.env('logging-level')
      return typeof level !== 'number' ? loggingLevel
        : $void.env('logging-level', (level >>= 0) < 0 ? 0
          : level > 127 ? 127 : level
        )
    }
    printf(' are imported.\n', 'gray')

    // initialize shell environment
    interpret('(var * (import "$shell"))\n')
    interpret(profile + '\n')
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
