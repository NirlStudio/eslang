'use strict'

module.exports = function interpreter ($void) {
  var $ = $void.$
  var compiler = $.compiler
  var Signal$ = $void.Signal
  var $export = $void.export
  var evaluate = $void.evaluate
  var createModuleSpace = $void.createModuleSpace
  var populateArguments = $void.populateArguments

  // interactively feed & evaluate
  $export($, 'interpreter', function (shell, args, baseUri) {
    // save the base uri of whole application.
    if (typeof baseUri !== 'string') {
      baseUri = null
    }
    // save the base uri into environment.
    $void.env('uri', baseUri)
    // create a module space.
    var scope = createModuleSpace(baseUri)
    populateArguments(scope, args, true)
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
  })
}
