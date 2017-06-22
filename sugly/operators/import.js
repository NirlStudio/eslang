'use strict'

module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var execute = $void.execute
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // import: a module from source.
  staticOperator('import', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    // look into current space to have the base uri.
    return importModule(space.local['-module'].uri,
      evaluate(clist[1], evaluate),
      clause.length > 2 ? evaluate(clist[2], space) : null
    )
  })

  // the cached modules
  var modules = $void.modules = Object.create(null)

  function importModule (moduleUri, source, type) {
    if (typeof source !== 'string') {
      console.warn('import > invalid source:', source)
      return null
    }
    if (type === 'js') {
      // TODO: wrap native objects
      // return importJSModule($, source)
    }
    if (!source.endsWith('.s')) {
      source += '.s'
    }
    // space uri > app uri > runtime uri
    var loader = $void.loader
    var baseUri = moduleUri ? loader.dir(moduleUri) : null
    var dirs = baseUri ? [baseUri] : []
    dirs.push($.env('uri'), $['-runtime'].uri)
    // try to locate the source in dirs.
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      console.warn('import > fialed to resolve source for', uri)
      return null
    }
    // look up it in cache.
    if (modules[uri]) {
      return modules[uri].export
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
        return scope.export
      }
      console.warn('import > failed when executing', code)
      return null
    } catch (signal) {
      console.warn('import > invalid call to', signal.id,
        'in', code, 'from', uri, 'on', moduleUri)
      return null
    }
  }
}
