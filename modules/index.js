'use strict'

// a loader can fully control the importing process of a native module.
var loaders = []

function loadDefault (moduleUri) {
  switch (moduleUri) {
    case 'restful':
      return require('./restful')
    case 'shell':
      return require('./shell')
    case 'symbols':
      return require('./symbols')
    case 'web':
      return require('./web')
    default:
      return null
  }
}

module.exports = function (moduleUri, baseUri, $void) {
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

module.exports.register = function (loader) {
  if (typeof loader === 'function') {
    loaders.unshift(loader)
    return loader
  }
  return null
}

module.exports.unregister = function (loader) {
  for (var i = loaders.length - 1; i >= 0; i--) {
    if (loaders[i] === loader) {
      loaders.splice(i, 1)
      return loader
    }
  }
  return null
}

module.exports.copy = function (exporting, source, context, $void) {
  context._native = source // mostly reserved for future.
  for (var key in source) {
    if ($void.ownsProperty(source, key)) {
      var value = source[key]
      exporting[key] = typeof value === 'function' ? value.bind(source) : value
    }
  }
  if (typeof source === 'function') {
    // If the module is exporting a 'do' function, it will be just overridden.
    // This behavior can be changed if it's really worthy in future.
    exporting.do = source.bind(null)
  }
  return exporting
}
