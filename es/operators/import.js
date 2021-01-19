'use strict'

module.exports = function import_ ($void) {
  var $ = $void.$
  var $Object = $.object
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var execute = $void.execute
  var evaluate = $void.evaluate
  var isObject = $void.isObject
  var safelyAssign = $void.safelyAssign
  var completeFile = $void.completeFile
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolFrom = sharedSymbolOf('from')
  var symbolImport = sharedSymbolOf('import')

  // import: a module from source.
  //   (import src), or
  //   (import field from module), or
  //   (import (fields ...) from module)
  var operator = staticOperator('import', function (space, clause) {
    if (!space.app) {
      warn('import', 'invalid without an app context.')
      return null
    }
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    var src, imported
    if (clist.length < 3 || clist[2] !== symbolFrom) {
      // look into current space to have the base uri.
      imported = importModule(space, evaluate(clist[1], space))
      // clone to protect inner exporting object.
      return imported && referModule(imported)
    }
    // (import field-or-fields from src)
    src = evaluate(clist[3], space)
    if (isObject(src)) {
      imported = src // expanding object fields.
    } else if (typeof src !== 'string') {
      typeof src === 'undefined' || src === null
        ? warn('import', 'missing source object or path.')
        : warn('import', 'invalid source object or path:', src)
      return null
    } else {
      imported = importModule(space, src)
      if (!imported) {
        return null // importing failed.
      }
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

  function referModule (imported) {
    var ref = Object.create(imported)
    for (var key in imported) {
      // inner fields will not be copied by statement like:
      //   (var * (import "module"))
      if (!key.startsWith('-')) {
        ref[key] = imported[key]
      }
    }
    return ref
  }

  function importModule (space, source) {
    if (typeof source !== 'string' || !source) {
      warn('import', 'invalid module source:', source)
      return null
    }
    var userHome = $void.$env('user-home')
    var moduleUri = space.local['-module']
    var moduleDir = space.local['-module-dir']
    var appHome = space.local['-app-home']
    var appDir = space.local['-app-dir']

    var isNative = source.startsWith('$')
    var uri = isNative
      ? $void.module.native.resolve(source, moduleDir, appHome, appDir, userHome)
      : resolve(space, appHome, userHome, moduleUri, source)
    if (!uri) {
      return null
    }
    // look up it in cache.
    var module_ = lookupInCache(space.modules, uri, moduleUri)
    if (module_.status) {
      return module_.exporting
    }

    module_.status = 100 // indicate loading
    module_.exporting = (isNative ? loadNativeModule : loadModule)(
      space, uri, module_, source, moduleUri
    )
    // make sure system properties cannot be overridden.
    if (!module_.exporting) {
      module_.exporting = Object.create($Object.proto)
    }
    return Object.assign(module_.exporting, module_.props)
  }

  function resolve (space, appHome, userHome, moduleUri, source) {
    var loader = $void.loader
    var isResolved = loader.isResolved(source)
    if (!moduleUri && isResolved) {
      warn('import', "It's forbidden to import a module from an absolute uri.")
      return null
    }
    var dirs = isResolved ? [] : dirsOf(source,
      moduleUri && loader.dir(moduleUri),
      appHome + '/modules',
      userHome + '/.es/modules',
      $void.$env('home') + '/modules', // working dir
      $void.runtime('home') + '/modules'
    )
    var uri = loader.resolve(completeFile(source), dirs)
    if (typeof uri === 'string') {
      return uri
    }
    warn('import', 'failed to resolve', source, 'in', dirs)
    return null
  }

  function isRelative (source) {
    return source.startsWith('./') || source.startsWith('../')
  }

  function dirsOf (source, moduleDir, appDir, userDir, homeDir, runtimeDir) {
    return moduleDir
      ? isRelative(source)
        ? [ moduleDir ]
        : [ runtimeDir, appDir, userDir, homeDir ]
      : [ runtimeDir ] // for dynamic or unknown-source code.
  }

  function lookupInCache (modules, uri, moduleUri) {
    var module_ = modules[uri] || (modules[uri] = {
      status: 0, // an empty module.
      props: {
        '-module': uri
      }
    })
    if (module_.status === 100) {
      warn('import', 'loop dependency on', module_.props, 'from', moduleUri)
      return module_
    }
    if (module_.status !== 200) {
      module_.status = 0 // reset statue to re-import.
      module_.props['-imported-by'] = moduleUri
      module_.props['-imported-at'] = Date.now()
    }
    return module_
  }

  function loadModule (space, uri, module_, source, moduleUri) {
    try {
      // -module-dir is only meaningful for an Espresso module.
      module_.props['-module-dir'] = $void.loader.dir(uri)
      // try to load file
      var doc = $void.loader.load(uri)
      var text = doc[0]
      if (typeof text !== 'string') {
        module_.status = 415 // unsupported media type
        warn('import', 'failed to read', source, 'for', doc[1])
        return null
      }
      // compile text
      var code = compile(text, uri, doc[1])
      if (!(code instanceof Tuple$)) {
        module_.status = 400 //
        warn('import', 'failed to compile', source, 'for', code)
        return null
      }
      // to load module
      var scope = execute(space, code, uri)[1] // ignore evaluation result.
      if (scope) {
        module_.status = 200
        return scope.exporting
      }
      module_.status = 500
      warn('import', 'failed when executing', code)
    } catch (signal) {
      module_.status = 503
      warn('import', 'invalid call to', signal.id,
        'in', code, 'at', uri, 'from', moduleUri)
    }
    return null
  }

  function loadNativeModule (space, uri, module_, source, moduleUri) {
    try {
      // the native module must export a loader function.
      var exporting = $void.module.native.load(uri)
      module_.status = 200
      return typeof exporting !== 'function' && typeof exporting !== 'object'
        ? exporting
        : safelyAssign(Object.create(null), exporting)
    } catch (err) {
      module_.status = 503 // service unavailable
      warn('import', 'failed to import native module of', source,
        'for', err, 'at', uri, 'from', moduleUri)
    }
    return null
  }

  $void.bindOperatorImport = function (space) {
    return (space.$import = function (uri) {
      if (!uri || typeof uri !== 'string') {
        warn('$import', 'invalid source uri:', uri)
        return null
      }
      return operator(space, new Tuple$([symbolImport, uri]))
    })
  }
}
