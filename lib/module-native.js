'use strict'

var InCoreModules = { paths: [] }

module.exports = function module$native ($void) {
  var runtimeModules = require('./modules')($void)

  var warn = $void.$warn
  var native = Object.create(null)

  native.resolve = function (target, srcModuleDir, appHome, appDir, userHome) {
    if (runtimeModules.has(target)) {
      return target
    }

    var request = target.substring(1) // remove leading '$'
    try {
      return '$' + require.resolve(request, InCoreModules)
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        warn('module:native', 'unknown error:[', err.code || err.message,
          '] when resolving core module:', target, '\n', err)
      }
    }

    try {
      return '$' + require.resolve(request, {
        paths: [srcModuleDir, appHome, appDir, userHome]
      })
    } catch (err) {
      warn('module:native', 'error:', err.code || err.message,
        'when resolving ', request,
        '\n', [target, srcModuleDir, appHome, appDir, userHome, err])
      return null
    }
  }

  native.load = function load (resolvedUri) {
    var request = resolvedUri.substring(1)
    return runtimeModules.load(request) || require(request)
  }

  return native
}
