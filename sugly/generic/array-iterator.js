'use strict'

var $export = require('../export')

module.exports = function ($) {
  var $Array = $.Array

  var iterator = $export($Array, 'Iterator', $.Class.new({}, {
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
    }
  }))

  $export($Array.proto, 'iterate', function array$iterate () {
    return iterator.create(this)
  })
}
