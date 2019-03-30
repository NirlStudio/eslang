'use strict'

var loaders = []

module.exports = function (uri) {
  switch (uri) {
    case 'restful':
      return require('./restful')
    case 'shell':
      return require('./shell')
    case 'symbols':
      return require('./symbols')
    case 'web':
      return require('./web')
    default:
      break
  }
  for (var i = loaders.length - 1; i >= 0; i--) {
    var module_ = loaders[i](uri)
    if (module_) {
      return module_
    }
  }
  throw new Error('Undefine native module: ' + uri)
}

module.exports.register = function (loader) {
  loaders.unshift(loader)
}

module.exports.unregister = function (loader) {
  for (var i = loaders.length - 1; i >= 0; i--) {
    if (loaders[i] === loader) {
      loaders.splice(i, 1)
    }
  }
}
