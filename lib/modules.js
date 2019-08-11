'use strict'

var fs = require('fs')
var path = require('path')
var modules = require('../modules')

// expose native modules in default mode (make everything accessible).
var exposingAll = false
var exposed = Object.create(null)

var localDir = path.sep === '/' ? /^[.]{1,2}\// : /^[.]{1,2}[/|\\]/

function resolve (moduleUri, baseUri) {
  return path.isAbsolute(moduleUri) || !localDir.test(moduleUri) ? moduleUri
    : path.resolve(path.dirname(baseUri), moduleUri)
}

function expose (resolvedUri, moduleUri) {
  return function importing (exporting, context, $void) {
    try {
      modules.copy(exporting, require(resolvedUri), context, $void)
      return true
    } catch (err) {
      $void.$warn('modules',
        'failed to load native module:', moduleUri,
        '\nfrom: ', resolvedUri, ', for\n', err)
      return false
    }
  }
}

function tryToMount (name, $void) {
  var profile
  try {
    profile = require(name + '/profile')
  } catch (err) {
    $void.$warn('modules:mount',
      'error occurred in loading profile of', name, ':', err)
    return false
  }
  if (typeof profile !== 'function') {
    $void.$warn('modules:mount',
      'module profile does not export a function: ', name)
    return false
  }
  // chain to the dependency module's profile.
  profile($void)
  return true
}

// support to dynamically load native modules.
modules.register(function (moduleUri, baseUri, $void) {
  var resolvedUri = resolve(moduleUri, baseUri)
  return exposed[resolvedUri] || (!exposingAll ? null
    : (exposed[resolvedUri] = expose(resolvedUri, moduleUri))
  )
})

modules.exposeAll = function () {
  return (exposingAll = true)
}

modules.expose = function (moduleUri/* , ... */) {
  for (var i = 0; i < arguments.length; i++) {
    moduleUri = arguments[i]
    if (moduleUri && typeof moduleUri === 'string') {
      var resolvedUri = resolve(moduleUri)
      if (!exposed[resolvedUri]) {
        exposed[resolvedUri] = expose(resolvedUri, moduleUri)
      }
    }
  }
  return exposed
}

modules.mount = function ($void, moduleName/* , ... */) {
  var result = Object.create(null)
  for (var i = 1; i < arguments.length; i++) {
    moduleName = arguments[i]
    if (moduleName && typeof moduleName === 'string') {
      result[moduleName] = tryToMount(moduleName, $void)
    } else {
      throw new TypeError(
        'a module name should be a string, not a' + (typeof moduleName)
      )
    }
  }
  return result
}

// avoid to reload profiles for the same package.
var nativeEspressoModules = Object.create(null)

// try to resolve a compatible Espresso NPM module.
modules.resolve = function (source, appHome, appDir, userHome, $void) {
  // a package is always treated as a directory.
  var filePath = $void.completeFile(source.indexOf('/') > 0 ? source : source + '/')
  // split package name and module (file) path.
  var offset = filePath.indexOf('/')
  var pack = filePath.substring(0, offset)
  var mod = filePath.substring(offset + 1)
  // try to resolve the package by underlying require.resolve logic.
  var paths = pathsOf(appHome, appDir, userHome)
  var dir = tryToResolveDir(pack, paths)
  if (typeof dir !== 'string') {
    // when no conflict in installation, the @eslang prefix can be skipped.
    dir = tryToResolveDir('@eslang/' + pack, paths)
    if (typeof dir !== 'string') {
      $void.$warn('modules:resolve', 'failed to resolve', source,
        'as', filePath, 'on either', pack, 'or', '@eslang/' + pack, 'in', paths)
      return null
    }
  }
  // the npm package must has package.json and an es folder.
  var uri = path.join(dir, 'es', mod)
  if (!fs.existsSync(uri) || !fs.existsSync(path.join(dir, 'package.json'))) {
    $void.$warn('modules:resolve', 'failed to resolve', source, 'at', dir)
    return null
  }
  // try to prepare native dependencies.
  if (!nativeEspressoModules[dir]) {
    nativeEspressoModules[dir] = true
    if (!tryToMount(dir)) {
      $void.$warn('modules:resolve',
        'an Espresso module without native dependency does not need to be ' +
        'published as a npm package.', [source, dir])
      return null
    }
  }
  // the Espresso module is ready to be imported.
  return uri
}

function findPackage (dir) {
  var offset = dir.indexOf('/es/')
  if (offset === 0) { // es must be in a package so it must have a parent dir.
    offset = dir.indexOf(3)
  }
  dir = offset > 0 ? dir.substring(0, offset)
    : dir.endsWith('/es') ? path.resolve(dir, '..') : null
  return dir && fs.existsSync(path.join(dir, 'es')) &&
    fs.existsSync(path.join(dir, 'package.json')) ? dir : null
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
    return path.dirname(require.resolve(pack, { paths: paths }))
  } catch (err) {
    return err
  }
}

module.exports = modules
