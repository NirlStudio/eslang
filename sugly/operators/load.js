'use strict'

module.exports = function load ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var execute = $void.execute
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // import: a module from source.
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

  function loadData (space, moduleUri, source, type) {
    if (typeof source !== 'string') {
      console.warn('load > invalid source:', source)
      return null
    }
    if (type === 'js') { // json data?
      // TODO: wrap native objects
      // return importJSModule($, source)
    }
    if (!source.endsWith('.s')) {
      source += '.s'
    }
    // space uri > app uri.
    var loader = $void.loader
    var baseUri = loader.dir(moduleUri)
    var dirs = baseUri ? [baseUri, // under the same directory
      $.env('uri')] : [$.env('uri')] // the app directory
    // try to locate the source
    var uri = loader.resolve(source, dirs)
    if (typeof uri !== 'string') {
      console.warn('load > failed to resolve for', uri)
      return null
    }
    // try to load file
    var text = loader.read(uri)
    if (typeof text !== 'string') {
      console.warn('load > failed to load source', source, 'for', text)
      return null
    }
    // compile text
    var code = compile(text)
    if (!(code instanceof Tuple$)) {
      console.warn('load > compiler warnings:', code)
      return null
    }
    try { // to load data
      return execute(space, code, uri)[0]
    } catch (signal) {
      console.warn('load > invalid call to', signal.id,
        'in', code, 'from', uri, 'on', moduleUri)
      return null
    }
  }
}
