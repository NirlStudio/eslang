'use strict'

var RuntimeModules = new Set([
  '$eslang/global',
  '$eslang/io',
  '$eslang/path',
  '$eslang/symbols'
])

module.exports = function modulesIn ($void) {
  $void.$io = require('./io')($void)
  $void.$path = require('../../../lib/modules/path-http')($void)
  $void.$symbols = require('../../../lib/modules/symbols')($void)

  var modules = Object.create(null)
  var eslang = Object.create(null) // not recommended to import all.

  modules.has = function has (moduleUri) {
    return moduleUri === '$eslang' ||
      moduleUri.startsWith('$eslang/') ||
      RuntimeModules.has(moduleUri)
  }

  modules.load = function load (name) {
    if (name === '$eslang' || name.startsWith('$eslang/')) {
      return eslang
    }
    switch (name) {
      case 'eslang/global':
        return window
      case 'eslang/io':
        return $void.$io
      case 'eslang/path':
        return $void.$path
      case 'eslang/symbols':
        return $void.$symbols
      default:
        return null
    }
  }

  return modules
}
