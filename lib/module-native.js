'use strict'

const InCoreModules = { paths: [] }

module.exports = function module$native ($void) {
  var runtimeModules = require('./modules')($void)

  var warn = $void.$warn
  var native = Object.create(null)

  native.resolve = function (moduleUri, moduleDir, appHome, appDir, userHome) {
    if (runtimeModules.has(moduleUri)) {
      return moduleUri
    }

    var request = moduleUri.substring(1)
    try {
      return '$' + require.resolve(request, InCoreModules)
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        warn('module-native', 'error in resolving core module.', [
          moduleUri, err
        ])
      }
    }

    try {
      return '$' + require.resolve(request, {
        paths: [moduleDir, appHome, appDir, userHome]
      })
    } catch (err) {
      warn('module-native', 'error in resolving native module', [
        err, moduleUri, moduleDir, appHome, appDir, userHome
      ])
      return null
    }
  }

  native.load = function load (resolvedUri) {
    var request = resolvedUri.substring(1)
    return runtimeModules.load(request) || require(request)
  }

  return native
}
