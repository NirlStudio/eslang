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
  var stringOf = $void.$.string.of

  var $io = $void.$io = {}

  var storage = window.localStorage || storeOf(tempStorage)
  var session = window.sessionStorage || storeOf(tempSession)

  function chooseStoreBy (path) {
    return path.startsWith('~/') ? session : storage
  }

  function checkPath (method, path) {
    if (path && typeof path === 'string') {
      return true
    }
    warn('io:' + method, 'argument path is not a string.', [path])
    return false
  }

  $io.read = function read (path) {
    return checkPath('read', path) ? chooseStoreBy(path).getItem(path) : null
  }

  $io.write = function write (path, value) {
    if (!checkPath('write', path)) {
      return null
    }
    chooseStoreBy(path).setItem(path,
      (value = typeof value === 'undefined' ? stringOf() : stringOf(value))
    )
    return value
  }

  $io['to-read'] = function read_ (path) {
    return checkPath('to-read', path)
      ? Promise.resolve(chooseStoreBy(path).getItem(path))
      : Promise.reject(warn())
  }

  $io['to-write'] = function write_ (path, value) {
    if (!checkPath('to-write', path)) {
      return Promise.reject(warn())
    }
    chooseStoreBy(path).setItem(path,
      (value = typeof value === 'undefined' ? stringOf() : stringOf(value))
    )
    return Promise.resolve(value)
  }
}
