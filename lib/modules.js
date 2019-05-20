'use strict'

var path = require('path')
var modules = require('../modules')

var proc = global.process
var PWD = proc.env.PWD || proc.cwd()

// expose native modules in default mode (make everything accessible).
var exposingAll = false
var exposed = Object.create(null)

function expose (moduleUri, originalUri) {
  return function importing (exporting, context, $void) {
    try {
      modules.copy(exporting, require(moduleUri), context, $void)
      return true
    } catch (err) {
      $void.$warn('modules',
        'failed to load native module:', originalUri,
        '\nfrom: ', moduleUri, ', for\n', err)
      return false
    }
  }
}

// support to dynamically load native modules.
modules.register(function (moduleUri) {
  return exposed[moduleUri] || (!exposingAll ? null
    : (exposed[moduleUri] = expose(moduleUri))
  )
})

modules.exposeAll = function () {
  return (exposingAll = true)
}

modules.expose = function (moduleUri/* , ... */) {
  for (var i = 0; i < arguments.length; i++) {
    moduleUri = arguments[i]
    if (typeof moduleUri === 'string') {
      if (!path.isAbsolute(moduleUri) && (
        moduleUri.indexOf('/') >= 0 ||
        moduleUri.indexOf(path.sep) >= 0 ||
        moduleUri.endsWith('.js')
      )) {
        // relative path is resolved basing on $PWD.
        moduleUri = path.resolve(PWD, moduleUri)
      }
      if (!exposed[moduleUri]) {
        exposed[moduleUri] = expose(moduleUri, arguments[i])
      }
    }
  }
  return exposed
}

module.exports = modules
