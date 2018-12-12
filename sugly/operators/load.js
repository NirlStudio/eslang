'use strict'

module.exports = function load ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var execute = $void.execute
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator
  var warn = (console.warn || console.log).bind(console)

  // load: a module from source.
  staticOperator('load', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    // look into current space to have the base uri.
    return loadData(space, space.local['-module'],
      evaluate(clist[1], space),
      clist.length > 2 ? evaluate(clist[2], space) : null
    )
  })

  // expose to be called by native code
  $void.loadData = loadData

  function loadData (space, moduleUri, source, args) {
    if (typeof source !== 'string') {
      warn('load > invalid source:', source)
      return null
    }
    if (!source.endsWith('.s')) {
      source += '.s'
    }
    // try to locate the sourcevar uri
    var uri = resolve(moduleUri, source)
    if (typeof uri !== 'string') {
      return null
    }
    // try to load file
    var text = $void.loader.read(uri)
    if (typeof text !== 'string') {
      warn('load > failed to load source', source, 'for', text)
      return null
    }
    // compile text
    var code = compile(text)
    if (!(code instanceof Tuple$)) {
      warn('load > compiler warnings:', code)
      return null
    }

    try { // to load data
      var result = execute(space, code, uri, args)
      var scope = result[1]
      return scope && Object.getOwnPropertyNames(scope.exporting).length > 0
        ? scope.exporting : result[0]
    } catch (signal) {
      warn('load > invalid call to', signal.id,
        'in', code, 'from', uri, 'on', moduleUri)
      return null
    }
  }

  function resolve (moduleUri, source) {
    if (!moduleUri) {
      warn("load > It's forbidden to load a module", 'from an anonymous module.')
      return null
    }
    var loader = $void.loader
    var dirs = loader.isAbsolute(source) ? []
      : dirsOf(source, loader.dir(moduleUri), $.env('home-uri'))
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      warn('load > failed to resolve module ', source, 'in', dirs)
      return null
    }
    if (uri !== moduleUri) {
      return uri
    }
    warn('load > a module,', moduleUri, ',cannot load itself by resolving', source, 'in', dirs)
    return null
  }

  function dirsOf (source, baseUri, appDir) {
    return source.startsWith('.') ? [ baseUri ] : [ baseUri, appDir ]
  }
}
