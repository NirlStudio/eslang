'use strict'

var localStore = tryGlobal() || tryModule() || useMemory()

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

function isTimestamp (version) {
  return version.startsWith('local:')
}

function generateTimestamp (version) {
  return 'local:' + Math.trunc(Date.now() / 600 / 1000)
}

module.exports = function ($void) {
  return {
    isTimestamp: isTimestamp,
    timestamp: generateTimestamp,

    get: function (url) {
      var key = keyOf(url)
      return key ? localStore.getItem(key) : null
    },
    ver: function (url) {
      var key = versionKeyOf(url)
      return key ? localStore.getItem(key) : null
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
