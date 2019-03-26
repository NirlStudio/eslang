'use strict'

module.exports = function load ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var execute = $void.execute
  var evaluate = $void.evaluate
  var appendExt = $void.appendExt
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolLoad = sharedSymbolOf('load')

  // load: a module from source.
  var operator = staticOperator('load', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    if (!space.app) {
      warn('load', 'invalid without an app context.')
      return null
    }
    // look into current space to have the base uri.
    return loadData(space, space.local['-app'], space.local['-module'],
      evaluate(clist[1], space),
      clist.length > 2 ? evaluate(clist[2], space) : null
    )
  })

  function loadData (space, appUri, moduleUri, source, args) {
    if (!source || typeof source !== 'string') {
      warn('load', 'invalid source:', source)
      return null
    }
    // try to locate the sourcevar uri
    var uri = resolve(appUri, moduleUri, appendExt(source))
    if (typeof uri !== 'string') {
      return null
    }
    // try to load file
    var doc = $void.loader.load(uri)
    var text = doc[0]
    if (!text) {
      warn('load', 'failed to load', source, 'for', doc[1])
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
        'in', code, 'from', uri, 'on', moduleUri)
      return null
    }
  }

  function resolve (appUri, moduleUri, source) {
    if (!moduleUri) {
      warn('load', "It's forbidden to load a module", 'from an anonymous module.')
      return null
    }
    var loader = $void.loader
    var dirs = loader.isResolved(source) ? [] : dirsOf(source,
      loader.dir(moduleUri),
      loader.dir(appUri),
      $void.$env('home')
    )
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      warn('load', 'failed to resolve', source, 'in', dirs)
      return null
    }
    if (uri !== moduleUri) {
      return uri
    }
    warn('load', 'a module,', moduleUri, ', cannot load itself by resolving', source, 'in', dirs)
    return null
  }

  function dirsOf (source, moduleDir, appDir, homeDir) {
    return source.startsWith('./') || source.startsWith('../')
      ? [ moduleDir ]
      : [ moduleDir, appDir, homeDir, $void.runtime('home') ]
  }

  $void.bindOperatorLoad = function (space) {
    return (space.$load = function (uri) {
      if (!uri || typeof uri !== 'string') {
        warn('$load', 'invalid source uri:', uri)
        return null
      }
      return operator(space, new Tuple$([symbolLoad, uri]))
    })
  }
}
