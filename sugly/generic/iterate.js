'use strict'

var range = require('./range')

function PropertyIterator (obj) {
  this._object = obj
  this._index = -1

  this._keys = []
  for (var key in obj) {
    if (!key.startsWith('$') && !key.startsWith('__')) {
      this._keys.push(key)
    }
  }

  this.key = null
  this.value = null
}

PropertyIterator.prototype.next = function () {
  this._index += 1
  if (this._index >= this._keys.length) {
    return false
  }

  this.key = this._keys[this._index]
  this.value = this._object[this.key]
  return true
}

function ArrayIterator (array) {
  this._array = array

  this.key = -1
  this.value = null
}

ArrayIterator.prototype.next = function () {
  this.key += 1
  if (this.key >= this._array.length) {
    return false
  }

  this.value = this._array[this.key]
  return true
}

module.exports = function iterate (target) {
  if (typeof target === 'undefined' || target === null) {
    return null
  }

  if (Array.isArray(target)) {
    return new ArrayIterator(target)
  }

  if (typeof target === 'number') {
    return range(target).iterate()
  }

  if (typeof target === 'object' || typeof target === 'function') {
    return typeof target.iterate === 'function' ? target.iterate() : new PropertyIterator(target)
  }

  return null
}
