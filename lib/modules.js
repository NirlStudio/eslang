'use strict'

var path = require('path')
var modules = require('../modules')

// expose native modules in default mode (make everything accessible).
var exposingAll = false
var exposed = Object.create(null)

function resolve (moduleUri, baseUri) {
  return path.isAbsolute(moduleUri) || (
    moduleUri.indexOf('/') < 0 &&
    moduleUri.indexOf(path.sep) < 0 &&
    !moduleUri.endsWith('.js')
  ) ? moduleUri : path.resolve(path.dirname(baseUri), moduleUri)
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
    if (typeof moduleUri === 'string') {
      var resolvedUri = resolve(moduleUri)
      if (!exposed[resolvedUri]) {
        exposed[resolvedUri] = expose(resolvedUri, moduleUri)
      }
    }
  }
  return exposed
}

module.exports = modules
