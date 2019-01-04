'use strict'

module.exports = function execute ($void) {
  var Signal$ = $void.Signal
  var warn = $void.$.warn
  var evaluate = $void.evaluate
  var createAppSpace = $void.createAppSpace
  var createModuleSpace = $void.createModuleSpace

  $void.execute = function execute (space, code, uri, args, mainApp) {
    var scope
    if (mainApp) {
      scope = createAppSpace(uri)
      if (typeof uri === 'string') {
        scope.modules[uri] = Object.assign(Object.create(null), {
          status: 201,
          exports: scope.exporting,
          timestamp: Date.now()
        })
      }
    } else {
      scope = createModuleSpace(uri, space)
    }
    scope.populate(args)

    try {
      return [evaluate(code, scope), scope]
    } catch (signal) {
      if (signal instanceof Signal$) {
        if (signal.id === 'exit' || signal.id === 'return') {
          return [signal.value, scope]
        }
        throw signal
      }
      warn('execute', 'unknown error:', signal,
        'with', args, 'for', code, 'from', uri
      )
      return [null, null]
    }
  }
}
