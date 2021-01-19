'use strict'

const RuntimeModules = new Set([
  '$global', '$io', '$path', '$restful', '$symbols'
])

module.exports = function ($void) {
  $void.$io = require('./io')($void)
  $void.$restful = require('../../../lib/modules/restful')($void)
  $void.$symbols = require('../../../lib/modules/symbols')($void)

  var modules = Object.create(null)

  modules.has = function has (moduleUri) {
    return RuntimeModules.has(moduleUri)
  }

  modules.load = function load (name) {
    switch (name) {
      case 'global':
        return window
      case 'io':
        return $void.$io
      case 'restful':
        return $void.$restful
      case 'symbols':
        return $void.$symbols
      default:
        return null
    }
  }

  return modules
}
