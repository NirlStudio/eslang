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
      case 'window':
        return require('./window')
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

  function register (loader) {
    if (typeof loader === 'function') {
      loaders.unshift(loader)
      return loader
    }
    return null
  }

  function unregister (loader) {
    for (var i = loaders.length - 1; i >= 0; i--) {
      if (loaders[i] === loader) {
        loaders.splice(i, 1)
        return loader
      }
    }
    return null
  }

  function copy (exporting, source, context) {
    context._generic = source // mostly reserved for future.
    $void.safelyAssign(exporting, source)
    return exporting
  }

  function use (targetUri, module_, profile) {
    return register(function loader (moduleUri) {
      return moduleUri !== targetUri ? null
        // generate a default importing-all function for a native module.
        : function importing (exporting, context, $void) {
          copy(exporting, module_, context)
          return true
        }
    })
  }

  $require.register = register
  $require.unregister = unregister
  $require.copy = copy
  $require.use = use

  return $require
}
