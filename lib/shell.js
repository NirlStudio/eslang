'use strict'

module.exports = function ($void, reader, proc) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var printf = $void.$printf
  var thisCall = $void.thisCall

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

    // expose local loader cache
    printf('# object', 'gray'); printf(' .loader', 'yellow')
    $['.loader'] = $void.loader.cache.store
    printf(' and', 'gray')
    printf(' function', 'gray'); printf(' .echo', 'blue')
    $['.echo'] = function echo () {
      echoing = !echoing
      if (echoing) {
        return 'echo is enabled.'
      }
      printf('  ') // this is only visible on console.
      return printf('#(string)# "echo is disabled."\n', 'gray')
    }
    printf(' are imported.\n', 'gray')

    // initialize shell environment
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
