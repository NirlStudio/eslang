'use strict'

module.exports = function import_ ($void) {
  var $ = $void.$
  var compile = $.compile
  var $Object = $.object
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var execute = $void.execute
  var evaluate = $void.evaluate
  var isObject = $void.isObject
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
    var clist = clause.$
    if (clist.length < 2) {
      return null
    }
    if (!space.app) {
      warn('import', 'invalid without an app context.')
      return null
    }
    var src
    if (clist.length < 3 || clist[2] !== symbolFrom) {
      // look into current space to have the base uri.
      src = importModule(space,
        space.local['-app-home'],
        space.local['-module'],
        evaluate(clist[1], space)
      )
      // clone to protect inner exporting object.
      return src && Object.assign($Object.empty(), src)
    }
    // (import field-or-fields from src)
    src = evaluate(clist[3], space)
    var imported
    if (isObject(src)) {
      imported = src
    } else if (typeof src !== 'string') {
      warn('import', 'invalid source object or path:', src)
      return null
    } else {
      imported = importModule(space,
        space.local['-app-home'],
        space.local['-module'],
        src
      )
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

  function importModule (space, appHome, moduleUri, source) {
    if (typeof source !== 'string' || !source) {
      warn('import', 'invalid module source:', source)
      return null
    }
    var type
    var offset = source.indexOf('$')
    if (offset >= 0) {
      type = source.substring(0, ++offset)
    }
    // try to locate the source in dirs.
    var uri = type ? source.substring(offset) // native module
      : resolve(space, appHome, moduleUri, source)
    if (!uri) {
      return null
    }
    // look up it in cache.
    var module_ = lookupInCache(space.modules, type ? source : uri, moduleUri)
    if (module_.status) {
      return module_.exporting
    }

    module_.status = 100 // indicate loading
    module_.exporting = (type ? loadNativeModule : loadModule)(
      space, uri, module_, source, moduleUri
    )
    return Object.assign(module_.exporting, module_.props)
  }

  function resolve (space, appHome, moduleUri, source) {
    var loader = $void.loader
    var isResolved = loader.isResolved(source)
    if (!moduleUri && isResolved) {
      warn('import', "It's forbidden to import a module from an absolute uri.")
      return null
    }
    var dirs = isResolved ? [] : dirsOf(source,
      moduleUri && loader.dir(moduleUri),
      appHome + '/modules',
      $void.$env('user-home') + '/.es/modules',
      $void.$env('home') + '/modules', // working dir
      $void.runtime('home') + '/modules'
    )
    var uri = loader.resolve(completeFile(source), dirs)
    if (typeof uri === 'string') {
      return uri
    }
    // try to load native Espresso modules.
    if ($void.require.resolve && !isRelative(source)) {
      uri = $void.require.resolve(source, appHome,
        space.local['-app-dir'], $void.$env('user-home')
      )
      if (typeof uri === 'string') {
        return uri
      } // else, make sure to display both warnings.
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
    var module_ = modules[uri]
    if (!module_) {
      module_ = modules[uri] = Object.assign(Object.create(null), {
        status: 0, // an empty module.
        props: Object.assign($Object.empty(), {
          '-module': uri
        }),
        timestamp: Date.now()
      })
    } else if (module_.status === 100) {
      warn('import', 'loop dependency when loading', uri, 'from', moduleUri)
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
      var scope = execute(space, code, uri, {
        // in reloading, the old exporting is accessible for module code.
        this: module_.exporting || null
      })[1]
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
      var importing = $void.require(uri, moduleUri)
      if (typeof importing !== 'function') {
        module_.status = 400
        warn('import', 'invalid native module', source, 'at', uri)
        return null
      }
      var scope = $void.createModuleSpace(uri, space)
      var status = importing.call(
        module_.exporting || null, // to serve reloading.
        scope.exporting, scope.context, $void
      )
      if (status === true) { // the loader can report error details
        module_.status = 200
        return scope.exporting
      }
      module_.status = 500 // internal error
      warn('import', 'failed to import native module of', source,
        'for', status, 'at', uri)
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
