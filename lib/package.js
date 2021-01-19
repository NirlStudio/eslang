'use strict'

module.exports = function $package ($void) {
  var env = $void.env

  var $package = Object.create(null)

  var dependencies = null
  var installation = null

  function initDependencies (appSpace) {
  }

  function initInstallation (appSpace) {

  }

  function resolveRuntime (moduleId, runtimeHome) {
    var runtimeHome = env('runtime-home')
  }

  $package.lookup = function lookup (source, moduleDir, appDir) {
    // map source to package uri
    // map uri to installation path.
    return ''; // resolved path.
  }

  return $package
}
