'use strict'

module.exports = function interpreterIn ($void) {
  var $ = $void.$
  var compiler = $.compiler
  var Signal$ = $void.Signal
  var evaluate = $void.evaluate
  var isApplicable = $void.isApplicable
  var createAppSpace = $void.createAppSpace

  // late binding: transient wrappers
  var joinPath = function $joinPath () {
    joinPath = $void.$path.join.bind($void.$path)
    return joinPath.apply(null, arguments)
  }

  // interactively feed & evaluate
  return function interpreter (context, shell) {
    if (!isApplicable(shell)) {
      return null
    }
    // create a module space.
    var appUri = joinPath($void.env('runtime-home'), '@')
    var scope = createAppSpace(appUri, $void.env('home'))
    scope.populate(context)
    // create compiler.
    var compile = compiler(function (expr, status) {
      if (status) {
        shell.apply(null, [null, 'compiler:' + status].concat(
          Array.prototype.slice.call(arguments, 2)))
        return
      }
      var value = expr[0]
      var src = expr[1]
      try {
        shell(evaluate(value, scope))
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'return') {
            shell(signal.value)
          } else if (signal.id === 'exit') {
            shell(signal.value, 'exiting')
          } else {
            shell(null, 'warning', 'invalid call to ' + signal.id, [value, src])
          }
        } else {
          shell(null, 'warning', 'unexpected error in evaluation', [signal, value, src])
        }
      }
    })

    return function interpret (text) {
      if (typeof text === 'string') {
        return compile(text) // push input into compiler
      } else {
        return compile() // reset status.
      }
    }
  }
}
