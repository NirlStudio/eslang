'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Array = $.Array
  var constant = $void.constant
  var readonly = $void.readonly

  var iterator = constant($Array, 'Iterator', $.class({
    _array: null,
    key: -1,
    value: null,

    constructor: function Array$Iterator$constructor (array) {
      this._array = Array.isArray(array) ? array : []
    },

    next: function Array$Iterator$next () {
      this.key += 1
      if (this.key >= this._array.length) {
        return false
      }

      this.value = this._array[this.key]
      return true
    },

    'is-empty': function Array$Iterator$isEmpty () {
      return this._array === null ||
        this._array.length < 1 || this.key >= this._array.length
    }
  }))

  readonly($Array.proto, 'iterate', function array$iterate () {
    return iterator.construct(this)
  })
}
