'use strict'

var fs = require('fs')
var path = require('path')

module.exports = function ($void) {
  var warn = $void.$warn
  var $require = $void.require
  var completeFile = $void.completeFile

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
