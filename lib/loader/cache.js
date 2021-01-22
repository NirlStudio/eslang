'use strict'

var KeyPrefix = '/es/loaded:'
var KeyVersion = KeyPrefix + 'version:'

function createStore (localStorage) {
  function enumKeys () {
    var keys = []
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var key = localStorage.key(i)
      if (key.startsWith(KeyPrefix)) {
        keys.push(localStorage.key(i))
      }
    }
    return keys
  }

  return {
    keys: enumKeys,
    getItem: localStorage.getItem.bind(localStorage),
    setItem: localStorage.setItem.bind(localStorage),
    removeItem: localStorage.removeItem.bind(localStorage),
    clear: function () {
      var keys = enumKeys()
      for (var i = 0, len = keys.length; i < len; i++) {
        localStorage.removeItem(keys[i])
      }
      return keys
    }
  }
}

function useMemory () {
  var store = Object.create(null)

  return {
    keys: function () {
      return Object.getOwnPropertyNames(store)
    },
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value
    },
    removeItem: function (key) {
      delete store[key]
    },
    clear: function () {
      store = Object.create(null)
    }
  }
}

function keyOf (uri) {
  return typeof uri === 'string' && uri ? KeyPrefix + uri : null
}

function versionKeyOf (uri) {
  return typeof uri === 'string' && uri ? KeyVersion + uri : null
}

function generateTimestamp (version) {
  return 'local:' + Math.trunc(Date.now() / 600 / 1000)
}

function manage (store) {
  var management = Object.create(null)

  management.list = function list (filter) {
    var uris = []
    var keys = store.keys()
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].startsWith(KeyVersion)) {
        if (typeof filter !== 'string' || keys[i].indexOf(filter) > 0) {
          uris.push([keys[i].substring(KeyVersion.length), store.getItem(keys[i])])
        }
      }
    }
    return uris
  }
  management.read = function read (uri) {
    var keys = store.keys()
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].startsWith(KeyVersion)) {
        if (typeof uri !== 'string' || keys[i].indexOf(uri) > 0) {
          return store.getItem(keyOf(keys[i].substring(KeyVersion.length)))
        }
      }
    }
  }
  management.reset = function reset (filter) {
    var counter = 0
    var keys = store.keys()
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].startsWith(KeyVersion)) {
        if (typeof filter !== 'string' || keys[i].indexOf(filter) > 0) {
          counter++
          store.removeItem(keys[i])
          store.removeItem(keyOf(keys[i].substring(KeyVersion.length)))
        }
      }
    }
    return counter
  }
  management.clear = function clear () {
    store.clear()
    return true
  }
  return management
}

module.exports = function cacheIn ($void) {
  var store = $void.isNativeHost ? useMemory()
    : createStore(window.localStorage)

  var cache = Object.create(null)
  cache.store = manage(store)

  cache.get = function get (uri) {
    var key = keyOf(uri)
    return key ? store.getItem(key) : null
  }
  cache.ver = function ver (uri) {
    var key = versionKeyOf(uri)
    return key ? store.getItem(key) : null
  }
  cache.isTimestamp = function isTimestamp (version) {
    return version.startsWith('local:')
  }
  cache.isExpired = function isExpired (version) {
    return version !== generateTimestamp()
  }
  cache.set = function set (uri, value, version) {
    if (typeof value !== 'string') {
      return null // invalid call.
    }
    var key = keyOf(uri)
    var verKey = versionKeyOf(uri)
    if (!key || !verKey) {
      return null // invalid call.
    }
    if (typeof version !== 'string' || !key) {
      version = generateTimestamp()
    }
    store.setItem(key, value)
    store.setItem(verKey, version)
    return version
  }

  return cache
}
