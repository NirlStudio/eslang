'use strict'

var tempStorage = Object.create(null)
var tempSession = Object.create(null)

function storeOf (storage) {
  return {
    getItem: function (key) {
      return storage[key]
    },
    setItem: function (key, value) {
      storage[key] = value
    }
  }
}

module.exports = function ($void) {
  var warn = $void.$warn
  var thisCall = $void.thisCall
  var stringOf = $void.$.string.of

  var $io = $void.$io = {}

  var storage = window.localStorage || storeOf(tempStorage)
  var session = window.sessionStorage || storeOf(tempSession)

  function chooseStoreBy (path) {
    return path.startsWith('~/') ? session : storage
  }

  function formatPath (method, path) {
    if (path && typeof path === 'string') {
      return path
    }
    if (!Array.isArray(path)) {
      warn('io:' + method, 'argument path is not a string or strings.', [path])
      return null
    }
    path = path.slice()
    for (var i = 0, len = path.length; i < len; i++) {
      if (typeof path[i] !== 'string') {
        path[i] = thisCall(path[i], 'to-string')
      }
    }
    return path.join('/')
  }

  $io.read = function read (path) {
    path = formatPath('read', path)
    return path ? chooseStoreBy(path).getItem(path) : null
  }

  $io.write = function write (path, value) {
    path = formatPath('write', path)
    if (!path) {
      return null
    }
    value = typeof value === 'undefined' ? stringOf() : stringOf(value)
    chooseStoreBy(path).setItem(path, value)
    return value
  }

  $io['to-read'] = function read_ (path) {
    path = formatPath('to-read', path)
    return !path ? Promise.reject(warn())
      : Promise.resolve(chooseStoreBy(path).getItem(path))
  }

  $io['to-write'] = function write_ (path, value) {
    path = formatPath('to-write', path)
    if (!path) {
      return Promise.reject(warn())
    }
    value = typeof value === 'undefined' ? stringOf() : stringOf(value)
    chooseStoreBy(path).setItem(path, value)
    return Promise.resolve(value)
  }
}
