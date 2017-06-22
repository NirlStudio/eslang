'use strict'

module.exports = function run ($void) {
  var $ = $void.$
  var compiler = $.compiler
  var setEnv = $void.setEnv
  var Signal$ = $void.Signal
  var $export = $void.export
  var evaluate = $void.evaluate
  var createModuleSpace = $void.createModuleSpace

  // interactively feed & evaluate
  $export($, 'interpreter', function (shell, args, baseUri) {
    // save the base uri of whole application.
    if (typeof baseUri === 'string') {
      if (!baseUri.endsWith('/')) {
        baseUri += '/'
      }
    } else {
      baseUri = null
    }
    setEnv('uri', baseUri)

    // create a module space.
    var scope = createModuleSpace(baseUri)
    if (Array.isArray(args)) {
      scope.context.arguments = args
    } else { // interpreting is always taken as in an application.
      scope.context.arguments = []
    }

    var compile = compiler(function (expr, status) {
      if (status) {
        shell.apply(null, [null, 'compiler:' + status].concat(
          Array.prototype.slice.call(arguments, 2)))
        return
      }
      try {
        shell(evaluate(expr, scope))
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'exit' || signal.id === 'return') {
            shell(signal.value)
          } else {
            shell(null, 'warning', 'invalid call to ' + signal.id, [expr])
          }
        } else {
          shell(null, 'warning', 'unexpected error in evaluation', [signal, expr])
        }
      }
    })

    return function interpret (text) {
      if (typeof text === 'string') {
        compile(text) // push input into compiler
      } else {
        compile() // reset status.
      }
    }
  })
}
