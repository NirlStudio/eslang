'use strict'

module.exports = function import_ ($void) {
  var $ = $void.$
  var $Symbol = $.symbol
  var $Object = $.object
  var compile = $.compile
  var warn = $void.$warn
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var execute = $void.execute
  var evaluate = $void.evaluate
  var isObject = $void.isObject
  var ownsProperty = $void.ownsProperty
  var safelyAssign = $void.safelyAssign
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolAll = $Symbol.all
  var symbolFrom = sharedSymbolOf('from')
  var symbolImport = sharedSymbolOf('import')

  // late binding: transient wrappers
  var nativeResolve = function $nativeResolve () {
    nativeResolve = $void.module.native.resolve.bind($void.module.native)
    return nativeResolve.apply(null, arguments)
  }
  var nativeLoad = function $nativeLoad () {
    nativeLoad = $void.module.native.load.bind($void.module.native)
    return nativeLoad.apply(null, arguments)
  }
  var dirname = function $dirname () {
    dirname = $void.$path.dirname.bind($void.$path)
    return dirname.apply(null, arguments)
  }

  // import a module.
  //   (import module), or
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
    var module_
    if (clist.length < 3 || clist[2] !== symbolFrom) {
      // look into current space to have the base uri.
      module_ = importModule(space, evaluate(clist[1], space))
      // clone to protect inner exporting object.
      return module_ && referModule(module_)
    }
    // (import field-or-fields from target)
    var target = evaluate(clist[3], space)
    var imported
    if (isObject(target)) {
      module_ = null
      imported = target // expanding object fields.
    } else if (typeof target === 'string') {
      module_ = importModule(space, target)
      imported = module_ && module_.exporting
      if (!imported) {
        return null // importing failed.
      }
    } else {
      typeof target === 'undefined' || target === null
        ? warn('import', 'missing target object or path.')
        : warn('import', 'invalid target object or path:', target)
      return null
    }

    // find out fields
    var fields = clist[1]
    if (fields instanceof Symbol$) {
      return fields !== symbolAll ? imported[fields.key]
        : module_ ? referModule(module_) : imported
    }
    if (!(fields instanceof Tuple$)) {
      warn('import', 'invalid field descriptor.', fields)
      return null
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

  function referModule (module_) {
    var exporting = module_.exporting
    if (module_.isNative) {
      // not try to wrap a native module which is supposed to protect itself if
      // it intends so.
      return exporting
    }

    var ref = Object.create(exporting)
    for (var key in exporting) {
      // inner fields will not be copied by statement like:
      //   (var * (import "module"))
      if (!key.startsWith('-') && ownsProperty(exporting, key)) {
        ref[key] = exporting[key]
      }
    }
    return ref
  }

  function importModule (space, target) {
    if (typeof target !== 'string' || !target) {
      warn('import', 'invalid module identifer:', target)
      return null
    }
    var srcModuleUri = space.local['-module']
    var srcModuleDir = space.local['-module-dir']

    var isNative = target.startsWith('$')
    var appModules = space.app.modules
    var uri = isNative
      ? nativeResolve(target, srcModuleDir,
        space.local['-app-home'],
        space.local['-app-dir'],
        $void.$env('user-home')
      )
      : appModules.resolve(target, srcModuleDir)
    if (!uri) {
      // any warning should be recorded in resolving process.
      return null
    }

    // look up it in cache.
    var module_ = appModules.lookupInCache(uri, srcModuleUri)
    if (module_.status) {
      return module_
    }

    module_.status = 100 // indicate loading
    module_.exporting = (isNative ? loadNativeModule : loadModule)(
      space, uri, module_, target, srcModuleUri
    )
    // make sure system properties cannot be overridden.
    if (!module_.exporting) {
      module_.exporting = Object.create($Object.proto)
    }
    if (!module_.isNative) {
      Object.assign(module_.exporting, module_.props)
    }
    return module_
  }

  function loadModule (space, uri, module_, target, moduleUri) {
    try {
      module_.props['-module'] = uri
      module_.props['-module-dir'] = dirname(uri)
      // try to load file
      var doc = $void.loader.load(uri)
      var text = doc[0]
      if (typeof text !== 'string') {
        module_.status = 415 // unsupported media type
        warn('import', 'failed to read', target, 'for', doc[1])
        return null
      }
      // compile text
      var code = compile(text, uri, doc[1])
      if (!(code instanceof Tuple$)) {
        module_.status = 400 //
        warn('import', 'failed to compile', target, 'for', code)
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

  function loadNativeModule (space, uri, module_, target, moduleUri) {
    try {
      // the native module must export a loader function.
      module_.isNative = true
      module_.props['-module'] = uri
      var exporting = nativeLoad(uri)
      module_.status = 200
      return typeof exporting !== 'function' ? exporting
        : safelyAssign(Object.create(null), exporting)
    } catch (err) {
      module_.status = 503 // service unavailable
      warn('import', 'failed to import native module of', target,
        'for', err, 'at', uri, 'from', moduleUri)
    }
    return null
  }

  $void.bindOperatorImport = function (space) {
    return (space.$import = function (uri) {
      if (!uri || typeof uri !== 'string') {
        warn('$import', 'invalid module uri:', uri)
        return null
      }
      return operator(space, new Tuple$([symbolImport, uri]))
    })
  }
}
