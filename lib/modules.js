'use strict'

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

module.exports = modules
