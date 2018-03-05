'use strict'

module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var $export = $void.export
  var execute = $void.execute

  // run: a module from source as an application.
  $export($, 'run', function (source, args, baseUri) {
    if (typeof source !== 'string') {
      return null
    }
    // try to resolve the base uri of the whole application
    if (typeof baseUri !== 'string') {
      baseUri = $.env('home-uri')
    }
    if (!source.endsWith('.s')) {
      source += '.s'
    }
    // try to resolve the uri for source
    var loader = $void.loader
    var uri = loader.resolve(source, [baseUri])
    if (typeof uri !== 'string') {
      console.warn('run > failed to resolve source for', uri)
      return null
    }
    // try to load file
    var text = loader.read(uri)
    if (typeof text !== 'string') {
      console.warn('run > failed to read source', source, 'for', text)
      return null
    }
    // compile text
    var code = compile(text)
    if (!(code instanceof Tuple$)) {
      console.warn('run > compiler warnings:', code)
      return null
    }
    try {
      return execute(null, code, uri, args, true)[0]
    } catch (signal) {
      console.warn('run > invalid call to', signal.id,
        'in', text, 'from', uri, 'with', args)
      return null
    }
  })
}
