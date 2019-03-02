'use strict'

module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var $export = $void.export
  var execute = $void.execute
  var atomicArrayOf = $void.atomicArrayOf

  // run a module from source as an application.
  $export($void, '$run', function (appSource, args, appHome) {
    if (typeof appSource !== 'string') {
      return null
    }
    // formalize arguments values to separate spaces.
    args = Array.isArray(args) ? atomicArrayOf(args) : []
    // try to resolve the base uri of the whole application
    if (typeof appHome !== 'string' || appHome.length < 1) {
      appHome = $void.$env('home')
    }
    if (!appSource.endsWith('.s')) {
      appSource += '.s'
    }
    // try to resolve the uri for source
    var loader = $void.loader
    var uri = loader.resolve(appSource, [
      appHome, $void.runtime('home')
    ])
    if (typeof uri !== 'string') {
      warn('run', 'failed to resolve source for', uri)
      return null
    }
    // try to load file
    var doc = loader.read(uri)
    var text = doc[0]
    if (!text) {
      warn('run', 'failed to read source', appSource, 'for', doc[1])
      return null
    }
    // compile text
    var code = compile(text)
    if (!(code instanceof Tuple$)) {
      warn('run', 'compiler warnings:', code)
      return null
    }
    try {
      return execute(null, code, uri, args, true)[0]
    } catch (signal) {
      warn('run', 'invalid call to', signal.id,
        'in', text, 'from', uri, 'with', args)
      return null
    }
  })
}
