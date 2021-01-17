'use strict'

module.exports = function ($void) {
  // a loader can fully control the importing process of a native module.
  var loaders = []

  function loadDefault (moduleUri) {
    switch (moduleUri) {
      case 'io':
        return require('./io')
      case 'restful':
        return require('./restful')
      case 'shell':
        return require('./shell')
      case 'symbols':
        return require('./symbols')
      case 'global':
        return require('./global')
      default:
        return null
    }
  }

  function $require (moduleUri, baseUri) {
    var importing = loadDefault(moduleUri)
    if (importing) {
      return importing
    }
    // latest loader has higher priority.
    for (var i = loaders.length - 1; i >= 0; i--) {
      importing = loaders[i](moduleUri, baseUri, $void)
      if (typeof importing === 'function') {
        return importing
      }
    }
    return null
  }

  return $require
}
