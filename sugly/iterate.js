'use strict'

function SeqenceIterator (to, from, step) {
  this._to = to
  this._from = from
  this._step = step

  this.value = from - step
}

SeqenceIterator.prototype.next = function () {
  this.value += this._step

  if (this.value >= this._from && this.value < this._to) {
    return true
  }
  if (this.value <= this._from && this.value > this._to) {
    return true
  }
  return false
}

function PropertyIterator (obj) {
  this._object = obj
  this._index = -1

  this._keys = Object.getOwnPropertySymbols(obj)
  // expose native properties
  for (var key in obj) {
    if (key.startsWith('$') || key.startsWith('__')) {
      continue
    }
    var sym = Symbol.for(key)
    if (!this._object.hasOwnProperty(sym)) {
      this._keys.push(key)
    }
  }

  this.key = null
  this.value = null

  this.next = function () {
    this._index += 1
    if (this._index >= this._keys.length) {
      return false
    }

    this.key = this._keys[this._index]
    this.value = this._object[this.key]
    return true
  }
}

function ArrayIterator (array) {
  this._array = array

  this.key = -1
  this.value = null

  this.next = function () {
    this.key += 1
    if (this.key >= this._array.length) {
      return false
    }

    this.value = this._array[this.key]
    return true
  }
}

module.exports = function (to, from, step) {
  if (typeof to === 'number') {
    if (typeof from !== 'number') {
      from = 0
    }
    if (typeof step !== 'number' || step === 0) {
      step = (to - from) >= 0 ? 1 : -1
    }
    return new SeqenceIterator(to, from, step)
  }

  if (Array.isArray(to)) {
    return new ArrayIterator(to)
  }

  if (typeof to === 'object' || typeof to === 'function') {
    return typeof to.iterate === 'function' ? to.iterate() : new PropertyIterator(to)
  }

  return null
}
