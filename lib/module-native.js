'use strict'

var fs = require('fs')
var path = require('path')

var localDir = path.sep === '/' ? /^[.]{1,2}\// : /^[.]{1,2}[/|\\]/

module.exports = function ($void) {
  var warn = $void.$warn
  var $require = $void.require
  var completeFile = $void.completeFile

  // expose native modules in default mode (make everything accessible).
  var exposingAll = false
  var exposed = Object.create(null)

  function resolve (moduleUri, baseUri) {
    return path.isAbsolute(moduleUri) || !localDir.test(moduleUri) ? moduleUri
      : path.resolve(path.dirname(baseUri), moduleUri)
  }

  function expose (resolvedUri, moduleUri) {
    return function importing (exporting, context, $void) {
      try {
        $require.copy(exporting, require(resolvedUri), context, $void)
        return true
      } catch (err) {
        warn('module',
          'failed to load native module:', moduleUri,
          '\nfrom: ', resolvedUri, ', for\n', err)
        return false
      }
    }
  }

  function tryToMount (name) {
    var profile
    try {
      profile = require(path.join(name, 'profile'))
    } catch (err) {
      warn('module:mount',
        'error occurred in loading profile of', name, ':', err)
      return false
    }
    if (typeof profile !== 'function') {
      warn('module:mount',
        'module profile does not export a function: ', name)
      return false
    }
    // chain to the dependency module's profile.
    profile($void)
    return true
  }

  // support to dynamically load native modules.
  $require.register(function (moduleUri, baseUri) {
    var resolvedUri = resolve(moduleUri, baseUri)
    return exposed[resolvedUri] || (!exposingAll ? null
      : (exposed[resolvedUri] = expose(resolvedUri, moduleUri))
    )
  })

  $require.exposeAll = function () {
    return (exposingAll = true)
  }

  $require.expose = function (moduleUri/* , ... */) {
    for (var i = 0; i < arguments.length; i++) {
      moduleUri = arguments[i]
      if (moduleUri && typeof moduleUri === 'string') {
        if (localDir.test(moduleUri)) {
          warn('module:expose',
            'exposeFrom is required to expose local module:', moduleUri, 'at', i)
        } else if (!exposed[moduleUri]) {
          exposed[moduleUri] = expose(moduleUri, moduleUri)
        }
      } else {
        warn('module:expose', 'invalid moduleUri:', moduleUri, 'at', i)
      }
    }
    return exposed
  }

  $require.exposeFrom = function (baseUri, moduleUri/* , ... */) {
    if (!path.isAbsolute(baseUri)) {
      warn('module:expose-from', 'invalid baseUri:', baseUri)
      return exposed
    }
    for (var i = 1; i < arguments.length; i++) {
      moduleUri = arguments[i]
      if (moduleUri && typeof moduleUri === 'string') {
        var resolvedUri = resolve(moduleUri, baseUri)
        if (!exposed[resolvedUri]) {
          exposed[resolvedUri] = expose(resolvedUri, moduleUri)
        }
      } else {
        warn('module:expose-from', 'invalid moduleUri:', moduleUri, 'at', i)
      }
    }
    return exposed
  }

  // avoid to reload profiles for the same package.
  var nativeEspressoModules = Object.create(null)

  // try to resolve a compatible Espresso NPM package.
  $require.resolve = function (source, appHome, appDir, userHome) {
    // a package's or scope's name cannot be '@' or empty.
    if (source === '@' || source.startsWith('@/')) {
      warn('module:resolve', 'invalid scoped package:', source)
      return null
    }
    // a package is always treated as a package.
    var offset, filePath
    if (source.startsWith('@')) {
      filePath = completeFile(completeScope(source))
      offset = filePath.indexOf('/', filePath.indexOf('/') + 1)
    } else {
      filePath = completeFile(completePackage(source))
      offset = filePath.indexOf('/')
    }
    // split package name and module (file) path.
    var pack = filePath.substring(0, offset)
    var mod = filePath.substring(offset + 1)
    // try to resolve the package by underlying require.resolve logic.
    var paths = pathsOf(appHome, appDir, userHome)
    var dir = tryToResolveDir(pack, paths)
    if (typeof dir !== 'string') {
      // when no conflict in installation, the @eslang prefix can be skipped.
      if (pack.startsWith('@')) {
        warn('module:resolve', 'failed to resolve', source,
          'as', filePath, 'in', pack, 'with', paths)
        return null
      } else { // not giving a scope yet.
        dir = tryToResolveDir('@eslang/' + pack, paths)
        if (typeof dir !== 'string') {
          warn('module:resolve', 'failed to resolve', source, 'as', filePath,
            'in either', pack, 'or', '@eslang/' + pack, 'with', paths)
          return null
        }
      }
    }
    // the npm package must has package.json and an es folder.
    var uri = path.join(dir, 'es', mod)
    if (!fs.existsSync(uri)) {
      warn('module:resolve', 'failed to resolve', source, 'at', uri)
      return null
    }
    // try to prepare native dependencies.
    if (!nativeEspressoModules[dir]) {
      nativeEspressoModules[dir] = true
      if (fs.existsSync(path.join(dir, 'profile.js'))) {
        tryToMount(dir)
      }
    }
    // the Espresso module is ready to be imported.
    return uri
  }

  function completePackage (source) {
    return source.indexOf('/') > 0
      ? source // a source likes "pack/"" or "pack/mod"
      : source + '/' // a source likes "pack"
  }

  function completeScope (source) {
    var offset = source.indexOf('/')
    if (offset < 0) { // scope only: @scope -> @scope/scope/
      return source + '/' + source.substring(1) + '/'
    }
    offset += 1
    if (offset >= source.length) { // scope only too: @scope/ -> @scope/scope/
      return source + source.substring(1)
    }
    var next = source.indexOf('/', offset)
    return next > offset ? source // @scope/pack/mod
      : next < 0 ? source + '/' // @scope/pack -> @scope/pack/
        // next === offset: @scope//... -> @scope/scope/...
        : source.substring(0, offset) +
          source.substring(1, offset) +
          source.substring(offset + 1)
  }

  function isEspressoPackage (dir) {
    return fs.existsSync(path.join(dir, 'es')) &&
      fs.existsSync(path.join(dir, 'package.json'))
  }

  function findPackage (dir) {
    var offset = dir.indexOf('/es/')
    if (offset === 0) { // es must be in a package so it must have a parent dir.
      offset = dir.indexOf(3)
    }
    dir = offset > 0 ? dir.substring(0, offset)
      : dir.endsWith('/es') ? path.resolve(dir, '..') : null
    return dir && isEspressoPackage(dir) ? dir : null
  }

  function pathsOf (appHome, appDir, userHome) {
    var pack = findPackage(appHome)
    var paths = pack ? [path.join(pack, 'node_modules')] : []
    if (appDir !== appHome) {
      (pack = findPackage(appDir)) && paths.push(path.join(pack, 'node_modules'))
    }
    paths.push(path.join(userHome, '.es/node_modules'))
    return paths
  }

  function tryToResolveDir (pack, paths) {
    try {
      var dir = path.dirname(require.resolve(pack, { paths: paths }))
      return isEspressoPackage(dir) ? dir : null
    } catch (err) {
      return err
    }
  }

  return $require
}
