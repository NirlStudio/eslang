'use strict'

module.exports = function load ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var execute = $void.execute
  var evaluate = $void.evaluate
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolLoad = sharedSymbolOf('load')

  // load a module
  var operator = staticOperator('load', function (space, clause) {
    if (!space.app) {
      warn('load', 'invalid without an app context.')
      return null
    }
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    // look into current space to have the base uri.
    return loadData(space, space.local['-module-dir'],
      evaluate(clist[1], space),
      clist.length > 2 ? evaluate(clist[2], space) : null
    )
  })

  function loadData (space, srcModuleDir, target, args) {
    if (!target || typeof target !== 'string') {
      warn('load', 'invalid module identifer:', target)
      return null
    }
    // try to locate the target uri
    var uri = space.app.modules.resolve(target, srcModuleDir)
    if (!uri) {
      return null
    }
    // try to load file
    var doc = $void.loader.load(uri)
    var text = doc[0]
    if (!text) {
      warn('load', 'failed to load:', target, 'for:', doc[1][0], doc[1][1],
        '\n', doc[1])
      return null
    }
    // compile text
    var code = compile(text, uri, doc[1])
    if (!(code instanceof Tuple$)) {
      warn('load', 'compiler warnings:', code)
      return null
    }

    try { // to load data
      var result = execute(space, code, uri,
        Array.isArray(args) ? args.slice() : args)
      var scope = result[1]
      return scope && Object.getOwnPropertyNames(scope.exporting).length > 0
        ? scope.exporting : result[0]
    } catch (signal) {
      warn('load', 'invalid call to', signal.id,
        'in', code, 'from', uri, 'in', srcModuleDir)
      return null
    }
  }

  $void.bindOperatorLoad = function (space) {
    return (space.$load = function (uri) {
      if (!uri || typeof uri !== 'string') {
        warn('$load', 'invalid module uri:', uri)
        return null
      }
      return operator(space, new Tuple$([symbolLoad, uri]))
    })
  }
}
