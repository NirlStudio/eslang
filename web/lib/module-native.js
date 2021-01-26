'use strict'

module.exports = function module$native ($void, packer) {
  var warn = $void.$warn
  var native = Object.create(null)
  var runtimeModules = require('./modules')($void)

  native.resolve = function (target, srcModuleDir, appHome, appDir, userHome) {
    if (runtimeModules.has(target)) {
      return target
    }

    if (!packer) {
      warn('module:native', 'no module packer provided.',
        '\n', [target, srcModuleDir, appHome, appDir, userHome])
      return null
    }

    try {
      var request = target.substring(1) // skip leading '$'
      var moduleId = packer.resolve(request, srcModuleDir)
      if (moduleId) {
        return '$' + moduleId
      }
      warn('module:native', 'failed to resolve module.', request,
        '\n', [target, srcModuleDir, appHome, appDir, userHome])
    } catch (err) {
      warn('module:native', 'error:', err.code || err.message,
        'in resolving native module.', request,
        '\n', [target, srcModuleDir, appHome, appDir, userHome])
    }
    return null
  }

  native.load = function load (resolvedUri) {
    var request = resolvedUri.substring(1)
    var mod = runtimeModules.load(request)
    if (mod) {
      return mod
    }
    if (packer) {
      return packer.load(request)
    }
    var err = new Error('[No Packer] Cannot find module ' + request)
    err.code = 'MODULE_NOT_FOUND'
    throw err
  }

  return native
}
