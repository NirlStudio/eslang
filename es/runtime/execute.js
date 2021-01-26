'use strict'

module.exports = function execute ($void) {
  var Signal$ = $void.Signal
  var warn = $void.$warn
  var evaluate = $void.evaluate
  var createAppSpace = $void.createAppSpace
  var createModuleSpace = $void.createModuleSpace

  $void.execute = function execute (space, code, uri, args, appHome) {
    var scope = appHome ? prepareAppSpace(uri, appHome) : createModuleSpace(uri, space)
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
      warn('execute', 'unknown error:', signal.code || signal.message,
        'with', args, 'for', code, 'from', uri, '\n', signal)
      return [null, null]
    }
  }

  function prepareAppSpace (uri, appHome) {
    var scope = $void.bootstrap
    if (scope && scope['-app'] === uri) { // bootstrap app
      if (scope.app.modules.cache[uri]) { // re-run the bootstrap app
        scope = createAppSpace(uri, appHome)
      } // start to run bootstrap app
    } else { // a new app
      scope = createAppSpace(uri, appHome)
    }
    scope.app.modules.cache[uri] = Object.assign(Object.create(null), {
      status: 201,
      exports: scope.exporting,
      timestamp: Date.now()
    })
    return scope
  }
}
