'use strict'

module.exports = function ($void, reader, proc) {
  var $ = $void.$
  var typeOf = $.type.of
  var warn = $void.$warn
  var print = $void.$print
  var thisCall = $void.thisCall

  return function agent (args, echo, profile) {
    var initialized = typeof profile !== 'string'
    if (!echo) {
      echo = print.bind(null, '=')
    }
    // display version.
    print('Sugly (' + $void.runtime('core') + ')', $void.runtime('version'))

    // expose local loader cache
    $['loader-cache'] = $void.loader.cache.store
    print('#', 'loader-cache is exported.')

    // add alias to exit.
    $.quit = $.bye = exit
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
      } else if (initialized) {
        resolve(value)
      }
    }, args, proc.env('PWD'))

    // initialize shell environment
    if (!initialized) {
      interpret(profile + '\n')
      initialized = true
    }

    // waiting for input
    reader.prompt()
    reader.on('line', function (input) {
      interpret(input)
      var depth = interpret('\n')
      reader.prompt(depth > 1 ? '..' : '> ')
    })
  }
}
