'use strict'

module.exports = function execute ($void) {
  var Signal$ = $void.Signal
  var evaluate = $void.evaluate
  var createModuleSpace = $void.createModuleSpace

  $void.execute = function execute (code, uri, args) {
    var scope = createModuleSpace(uri || null)
    if (args) {
      scope.context['arguments'] = args
    }
    try {
      if (!code.plain) { // a single expression
        return [evaluate(code, scope), scope]
      }
      var result = null
      for (var expr in code.$) {
        result = evaluate(expr, scope)
      }
      return [result, scope.export]
    } catch (signal) {
      if (signal instanceof Signal$) {
        if (signal.id === 'exit' || signal.id === 'return') {
          return [signal.value, scope]
        }
        throw signal
      }
      console.warn('execute > unknown error:', signal,
        'with', args, 'for', code, 'from', uri)
      return [null, null]
    }
  }
}
