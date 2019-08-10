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
modules.resolve = function (source, appDir, userHome, $void) {
  // try to split package name and module (file) path.
  var offset = source.indexOf('/')
  var pack = offset > 0 ? source.substring(0, offset) : source
  var mod = (offset > 0 && source.substring(offset + 1)) || pack
  // a trailing folder separator indicates a folder.
  if (mod.endsWith('/')) {
    while (mod.endsWith('/')) {
      mod = mod.substring(0, mod.length - 1)
    }
    // the <default> module has the same name of its container folder.
    // or, when multiple trailing '/', falls back to package name again.
    mod = mod ? path.join(mod, path.basename(mod)) : pack
  }
  // try to resolve the package by underlying require.resolve logic.
  var paths = pathsOf(appDir, userHome)
  var dir = tryToResolveDir(pack, paths)
  if (typeof dir !== 'string') {
    // when no conflict in installation, the @eslang prefix can be skipped.
    dir = tryToResolveDir('@eslang/' + pack, paths)
    if (typeof dir !== 'string') {
      $void.$warn('modules:resolve', 'failed to resolve', moduleUri, 'for', dir)
      return null
    }
  }
  // the npm package must has package.json and an es folder.
  var uri = path.join(dir, 'es', mod)
  if (!fs.existsSync(uri) || !fs.existsSync(path.join(dir, 'package.json'))) {
    $void.$warn('modules:resolve', 'failed to resolve', moduleUri, 'at', dir)
    return null
  }
  // try to prepare native dependencies.
  if (!nativeEspressoModules[dir]) {
    nativeEspressoModules[dir] = true
    if (!tryToMount(dir)) {
      $void.$warn('modules:resolve',
        'an Espresso module without native dependency does not need to be ' +
        'published as a npm package.', [moduleUri, dir])
      return null
    }
  }
  // the Espresso module is ready to be imported.
  return uri
}

function pathsOf (appDir, userHome) {
  return appDir.endsWith('/es') && fs.existsSync(
    path.resolve(appDir, '../package.json')
  ) ? [ // for a (possibly) compatible Espresso npm package.
      path.resolve(appDir, '../node_modules'),
      path.join(userHome, '.es/node_modules')
    ] : [ // for a single Espresso app file, only check shared modules.
      path.join(userHome, '.es/node_modules')
    ]
}

function tryToResolveDir (pack, paths) {
  try {
    return path.dirname(require.resolve(pack, { paths: paths }))
  } catch (err) {
    return err
  }
}

module.exports = modules
