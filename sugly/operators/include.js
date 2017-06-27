'use strict'

module.exports = function include ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var evaluate = $void.evaluate
  var staticOperator = $void.staticOperator

  // import: a module from source.
  staticOperator('include', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    // look into current space to have the base uri.
    return includeCode(space,
      space.local['-module'].uri,
      evaluate(clist[1], space)
    )
  })

  function includeCode (space, moduleUri, source) {
    if (typeof source !== 'string') {
      console.warn('include > invalid source:', source)
      return null
    }
    if (baseUri !== 'string') {
      baseUri = null
    }
    if (!source.endsWith('.s')) {
      source += '.s'
    }
    // only implicitly include code from current space's base uri.
    var loader = $void.loader
    var baseUri = moduleUri ? loader.dir(moduleUri) : null
    // try to locate the source.
    var uri = loader.resolve(source, baseUri ? [baseUri] : [])
    if (typeof uri !== 'string') {
      console.warn('include > fialed to resolve for', uri)
      return null
    }
    // try to load file
    var text = loader.read(uri)
    if (typeof text !== 'string') {
      console.warn('include > failed to load source', source, 'for', text)
      return null
    }
    // compile text
    var code = compile(text)
    if (!(code instanceof Tuple$)) {
      console.warn('include > compiler warnings:', code)
      return null
    }
    // to evaluate the code from source in current space.
    return evaluate(code, space)
  }
}
