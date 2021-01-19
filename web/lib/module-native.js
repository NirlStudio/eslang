'use strict'

module.exports = function module$native ($void, packer) {
  var warn = $void.$warn
  var native = Object.create(null)
  var runtimeModules = require('./modules')($void)

  native.resolve = function (moduleUri, moduleDir, appHome, appDir, userHome) {
    if (runtimeModules.has(moduleUri)) {
      return moduleUri
    }

    if (!packer) {
      warn('module-native', 'no packer provided.', [moduleUri, moduleDir])
      return null
    }

    try {
      var request = moduleUri.substring(1)
      var moduleId = packer.resolve(request, moduleDir)
      if (moduleId) {
        return '$' + moduleId
      }
      warn('module-native', 'failed to resolve native module.', [
        moduleUri, moduleDir, appHome, appDir, userHome
      ])
    } catch (err) {
      warn('module-native', 'error in resolving native module.', [
        err, moduleUri, moduleDir, appHome, appDir, userHome
      ])
    }
    return null
  }

  native.load = function load (resolvedUri) {
    var request = resolvedUri.substring(1)
    return runtimeModules.load(request) || (packer && packer.load(request))
  }

  return native
}
