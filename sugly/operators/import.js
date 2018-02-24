'use strict'

module.exports = function import_ ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var execute = $void.execute
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator
  var symbolFrom = $void.sharedSymbolOf('from')

  // import: a module from source.
  //   (import src), or
  //   (import field from src), or
  //   (import (fields ...) from src)
  staticOperator('import', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    if (clist.length < 4 || clist[2] !== symbolFrom) {
      // look into current space to have the base uri.
      return importModule(space.local['-module'],
      evaluate(clist[1], space),
        clist.length > 2 ? evaluate(clist[2], space) : null
      )
    }
    // (import field-or-fields from src)
    var src = evaluate(clist[3], space)
    var imported = src instanceof Object$ ? src // importing from an object
      : importModule(space.local['-module'], src,
          clist.length > 4 ? evaluate(clist[4], space) : null)
    if (!imported) {
      return null // importing failed.
    }
    // find out fields
    var i
    var fields = clist[1]
    if (fields instanceof Symbol$) {
      fields = [fields.key]
    } else if (fields instanceof Tuple$) {
      var flist = fields.$
      fields = []
      for (i = 0; i < flist.length; i++) {
        if (flist[i] instanceof Symbol$) {
          fields.push(flist[i].key)
        }
      }
    }
    // import fields into an array.
    var values = []
    for (i = 0; i < fields.length; i++) {
      var value = imported[fields[i]]
      values.push(typeof value === 'undefined' ? null : value)
    }
    return values
  })

  // expose to be called by native code.
  $void.importModule = importModule

  // the cached modules
  var modules = $void.modules = Object.create(null)

  function importModule (moduleUri, source, type) {
    if (typeof source !== 'string') {
      console.warn('import > invalid source:', source)
      return null
    }
    if (type === 'js') {
      return importJSModule(source)
    }
    if (!source.endsWith('.s')) {
      source += '.s'
    }
    // space uri > app uri > runtime uri
    var loader = $void.loader
    var baseUri = moduleUri ? loader.dir(moduleUri) : null
    var dirs = baseUri ? [baseUri, // under the same directory
      baseUri + '/modules'] : [] // local modules directory
    dirs.push($.env('uri') + '/modules', // app shared modules
      $void.runtime('uri') + '/modules' // runtime shared modules
    )
    // try to locate the source in dirs.
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      console.warn('import > failed to resolve source for', uri)
      return null
    }
    // look up it in cache.
    if (modules[uri]) {
      return modules[uri].exporting
    }
    // try to load file
    var text = loader.read(uri)
    if (typeof text !== 'string') {
      console.warn('import > failed to read source', source, 'for', text)
      return null
    }
    // compile text
    var code = compile(text)
    if (!(code instanceof Tuple$)) {
      console.warn('import > compiler warnings:', code)
      return null
    }

    try { // to load module
      var scope = execute(code, uri)[1]
      if (scope) { // try to cache it.
        scope.time = new Date()
        modules[uri] = scope
        return scope.exporting
      }
      console.warn('import > failed when executing', code)
      return null
    } catch (signal) {
      console.warn('import > invalid call to', signal.id,
        'in', code, 'from', uri, 'on', moduleUri)
      return null
    }
  }

  function importJSModule (source) {
    var loader = $void.loader
    if (loader.isAbsolute(source)) {
      console.warn("import > It's forbidden to load a native module",
        'from a absolute uri.')
      return null
    }
    if (!source.endsWith('.js')) {
      source += '.js'
    }
    var dirs = [
      $.env('uri') + '/modules', // app shared modules
      $void.runtime('uri') + '/modules' // runtime shared modules
    ]
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      console.warn('import > failed to resolve source for', source, 'in', dirs)
      return null
    }
    // look up it in cache.
    if (modules[uri]) {
      return modules[uri].exporting
    }
    try {
      var importing = require(uri) // the JS module must export a loader function.
      if (typeof importing !== 'function') {
        console.warn('import > invalid JS module', source, 'at', uri)
        return null
      }
      var scope = $void.createModuleSpace(uri)
      var status = importing(scope.exporting, scope.context)
      if (status !== true) { // the loader can report error details
        console.warn('import > failed to import JS module of', source,
          'for', status, 'at', uri)
        return null
      }
      scope.time = new Date()
      modules[uri] = scope
      return scope.exporting
    } catch (err) {
      console.warn('import > failed to import JS module of', source,
        'for', err, 'from', uri)
      return null
    }
  }
}
