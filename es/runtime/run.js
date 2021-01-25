'use strict'

module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var warn = $void.$warn
  var $export = $void.export
  var execute = $void.execute
  var completeFile = $void.completeFile
  var atomicArrayOf = $void.atomicArrayOf

  // late binding: transient wrappers
  var isRemote = function $isRemote () {
    isRemote = $void.loader.isRemote.bind($void.loader)
    return isRemote.apply(null, arguments)
  }
  var isAbsolutePath = function $isAbsolutePath () {
    isAbsolutePath = $void.$path.isAbsolute.bind($void.$path)
    return isAbsolutePath.apply(null, arguments)
  }
  var resolvePath = function $resolvePath () {
    resolvePath = $void.$path.resolve.bind($void.$path)
    return resolvePath.apply(null, arguments)
  }

  // run a module from source as an application.
  $void.$run = $export($void.$app, 'run', function (appUri, args, appHome) {
    if (typeof appUri !== 'string') {
      warn('run', 'invalid app uri type:', typeof appUri, 'of', appUri)
      return null
    }
    // formalize arguments values to separate spaces.
    args = Array.isArray(args) ? atomicArrayOf(args) : []

    // try to resolve the base uri of the whole application
    if (typeof appHome !== 'string' || appHome.length < 1) {
      appHome = $void.$env('home')
    }

    // try to resolve the uri for source
    appUri = completeFile(appUri)
    var uri = isAbsolutePath(appUri) || isRemote(appUri) ? appUri
      : resolvePath(appHome, appUri)
    if (typeof uri !== 'string') {
      warn('run', 'failed to resolve app at', uri)
      return null
    }

    // try to load file
    var doc = $void.loader.load(uri)
    var text = doc[0]
    if (!text) {
      warn('run', 'failed to read source', appUri, 'for', doc[1])
      return null
    }

    var code = compile(text, uri, doc[1])
    if (!(code instanceof Tuple$)) {
      warn('run', 'compiler warnings:', code)
      return null
    }

    try {
      return execute(null, code, uri, args, appHome)[0]
    } catch (signal) {
      warn('run', 'invalid call to', signal.id,
        'in', text, 'from', uri, 'with', args)
      return null
    }
  })
}
