'use strict'

var RuntimeModules = new Set([
  '$global', '$io', '$restful', '$symbols'
])

module.exports = function modulesIn ($void) {
  $void.$io = require('./io')($void)
  $void.$restful = require('./restful')($void)
  $void.$symbols = require('./symbols')($void)

  var modules = Object.create(null)

  modules.has = function has (moduleUri) {
    return RuntimeModules.has(moduleUri)
  }

  modules.load = function load (name) {
    switch (name) {
      case 'global':
        return global
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
