'use strict'

var KeyPrefix = '/sugly/loaded:'
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

function tryGlobal () {
  return typeof window === 'undefined' ? null
    : window.localStorage ? createStore(window.localStorage) : useMemory()
}

function tryModule () {
  if (typeof window !== 'undefined') {
    return null
  }
  try {
    // optional dependency
    var LocalStorage = require('node-localstorage').LocalStorage
    return createStore(new LocalStorage('./.sugly/loaded'))
  } catch (err) {
    return null
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

module.exports = function (inStorage) {
  var store = inStorage ? tryGlobal() || tryModule() || useMemory()
    : useMemory()

  return {
    store: { // management API
      list: function (filter) {
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
      },
      read: function (uri) {
        var keys = store.keys()
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].startsWith(KeyVersion)) {
            if (typeof uri !== 'string' || keys[i].indexOf(uri) > 0) {
              return store.getItem(keyOf(keys[i].substring(KeyVersion.length)))
            }
          }
        }
      },
      reset: function (filter) {
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
      },
      clear: function () {
        store.clear()
        return true
      }
    },

    get: function (uri) {
      var key = keyOf(uri)
      return key ? store.getItem(key) : null
    },
    ver: function (uri) {
      var key = versionKeyOf(uri)
      return key ? store.getItem(key) : null
    },
    isTimestamp: function (version) {
      return version.startsWith('local:')
    },
    isExpired: function (version) {
      return version !== generateTimestamp()
    },
    set: function (uri, value, version) {
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
  }
}
