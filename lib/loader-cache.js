'use strict'

function tryGlobal () {
  return typeof window === 'undefined' ? null
    : typeof window.localStorage !== 'undefined' && window.localStorage
      ? window.localStorage : useMemory()
}

function tryModule () {
  try {
    // optional dependency
    var LocalStorage = require('node-localstorage').LocalStorage
    return new LocalStorage('./.sugly/loaded')
  } catch (err) {
    return null
  }
}

function useMemory () {
  var store = Object.create(null)
  return {
    getItem: function (key) {
      return store[key] || null
    },
    setItem: function (key, value) {
      store[key] = value
    }
  }
}

function keyOf (url) {
  return typeof url === 'string' && url ? '/sugly/loaded:' + url : null
}

function versionKeyOf (url) {
  return typeof url === 'string' && url ? '/sugly/loaded:version:' + url : null
}

function generateTimestamp (version) {
  return 'local:' + Math.trunc(Date.now() / 600 / 1000)
}

module.exports = function (inStorage) {
  var localStore = inStorage ? tryGlobal() || tryModule() || useMemory()
    : useMemory()

  return {
    get: function (url) {
      var key = keyOf(url)
      return key ? localStore.getItem(key) : null
    },
    ver: function (url) {
      var key = versionKeyOf(url)
      return key ? localStore.getItem(key) : null
    },
    isTimestamp: function (version) {
      return version.startsWith('local:')
    },
    set: function (url, value, version) {
      if (typeof value !== 'string') {
        return null // invalid call.
      }
      var key = keyOf(url)
      var verKey = versionKeyOf(url)
      if (!key || !verKey) {
        return null // invalid call.
      }
      if (typeof version !== 'string' || !key) {
        version = generateTimestamp()
      }
      localStore.setItem(key, value)
      localStore.setItem(verKey, version)
      return version
    }
  }
}
