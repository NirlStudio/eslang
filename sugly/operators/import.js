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
  var warn = (console.warn || console.log).bind(console)

  // const values
  var RefreshInterval = 60 * 1000 // milliseconds

  // import: a module from source.
  //   (import src), or
  //   (import field from module), or
  //   (import (fields ...) from module)
  staticOperator('import', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    var src
    if (clist.length < 4 || clist[2] !== symbolFrom) {
      // look into current space to have the base uri.
      src = importModule(space, space.local['-module'],
        evaluate(clist[1], space),
        clist.length > 2 ? evaluate(clist[2], space) : null
      )
      // clone to protect inner exports object.
      return Object.assign(new Object$(), src)
    }
    // (import field-or-fields from src)
    src = evaluate(clist[3], space)
    var imported = src instanceof Object$ ? src
      : typeof src !== 'string' ? null
        : importModule(space, space.local['-module'], src,
          clist.length > 4 ? evaluate(clist[4], space) : null
        )
    if (typeof imported !== 'object') {
      return null // importing failed.
    }

    // find out fields
    var fields = clist[1]
    if (fields instanceof Symbol$) {
      return imported[fields.key] // import only a single field.
    }
    if (!(fields instanceof Tuple$)) {
      return null // invalid field descriptor
    }

    var i
    var flist = fields.$
    fields = []
    for (i = 0; i < flist.length; i++) {
      if (flist[i] instanceof Symbol$) {
        fields.push(flist[i].key)
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

  function importModule (space, moduleUri, source, type) {
    if (typeof source !== 'string') {
      if (source instanceof Symbol$) {
        source = source.key
      } else {
        warn('import > invalid module source:', source)
        return null
      }
    }
    // try to locate the source in dirs.
    var check = function (ext) {
      return source.endsWith(ext) ? source : source + ext
    }
    var uri = resolve(moduleUri, check(type === 'js' ? '.js' : '.s'))
    if (!uri) {
      return null
    }
    // look up it in cache.
    var module_ = lookupInCache(uri, moduleUri)
    var reloading
    switch (module_.status) {
      case 0:
        module_.status = 100
        break // continue to load
      case 205:
        reloading = true
        break // try to reload
      default:
        return module_.exports
    }

    var exporting = (type === 'js' ? loadJsModule : loadModule)(
      space, uri, module_, source, moduleUri
    )
    if (!exporting || exporting === module_.exporting) {
      return module_.exports
    }
    module_.exporting = exporting
    if (reloading) {
      module_.exports = new Object$()
    }
    var keys = Object.getOwnPropertyNames(exporting)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (!/^[-_]/.test(key)) { // only expose public fields
        module_.exports[key] = exporting[key]
      }
    }
    return module_.exports
  }

  function resolve (moduleUri, source) {
    var loader = $void.loader
    var isAbsolute = loader.isAbsolute(source)
    if (!moduleUri && isAbsolute) {
      warn("import > It's forbidden to import a module", 'from a absolute uri.')
      return null
    }
    var dirs = isAbsolute ? [] : dirsOf(
      source,
      moduleUri && loader.dir(moduleUri),
      $.env('home-uri') + '/modules',
      $void.runtime('uri') + '/modules'
    )
    var uri = loader.resolve(source, dirs)
    if (typeof uri === 'string') {
      return uri
    }
    warn('import > failed to resolve module ', source, 'in', dirs)
    return null
  }

  function dirsOf (source, baseUri, appDir, runtimeDir) {
    return baseUri
      ? source.startsWith('.')
        ? [ baseUri ]
        : [ appDir, runtimeDir, baseUri ]
      : [ runtimeDir ]
  }

  function lookupInCache (uri, moduleUri) {
    var module = modules[uri]
    if (!module) {
      module = modules[uri] = Object.assign(Object.create(null), {
        status: 0, // loading
        exports: new Object$(),
        timestamp: Date.now()
      })
    } else if (module.status === 100) {
      warn('import > loop dependency when loading', uri, 'from', moduleUri)
    } else if ((Date.now() - modules[uri].timestamp) > RefreshInterval) {
      module.status = 205
    }
    return module
  }

  function loadModule (space, uri, module_, source, moduleUri) {
    try {
      // try to load file
      var text = $void.loader.read(uri)
      if (typeof text !== 'string') {
        module_.status = 415 // unspported media type
        warn('import > failed to read source', source, 'for', text)
        return null
      }
      // compile text
      var code = compile(text)
      if (!(code instanceof Tuple$)) {
        module_.status = 400 //
        warn('import > failed to compile source', source, 'for', code)
        return null
      }
      // to load module
      var scope = execute(space, code, uri, { this: module_.exporting })[1]
      if (scope) {
        module_.status = 200
        return scope.exporting
      }
      module_.status = 500
      warn('import > failed when executing', code)
    } catch (signal) {
      module_.status = 503
      warn('import > invalid call to', signal.id,
        'in', code, 'at', uri, 'from', moduleUri)
    }
    return null
  }

  function loadJsModule (space, uri, module_, source, moduleUri) {
    try {
      var importing = require(uri) // the JS module must export a loader function.
      if (typeof importing !== 'function') {
        module_.status = 400
        warn('import > invalid JS module', source, 'at', uri)
        return null
      }
      var scope = $void.createModuleSpace(uri, space)
      var status = importing.call(
        module_.exporting, scope.exporting, scope.context
      )
      if (status === true) { // the loader can report error details
        module_.status = 200
        return scope.exporting
      }
      module_.status = 500 // internal error
      warn('import > failed to import JS module of', source,
        'for', status, 'at', uri)
    } catch (err) {
      module_.status = 503 // service unavailable
      warn('import > failed to import JS module of', source,
        'for', err, 'at', uri, 'from', moduleUri)
    }
    return null
  }
}
