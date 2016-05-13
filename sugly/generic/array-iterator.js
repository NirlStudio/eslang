'use strict'

var $export = require('../export')

module.exports = function ($) {
  var $Array = $.Array

  var iterator = $export($Array, 'Iterator', $.Iterator.derive({
    derive: null  // prevent inheritence
  }, {
    _array: null,

    key: -1,
    value: null,

    next: function Array$Iterator$next () {
      this.key += 1
      if (this.key >= this._array.length) {
        return false
      }

      this.value = this._array[this.key]
      return true
    }
  }))

  // prevent direct invocation.
  var create = iterator.create.bind(iterator)
  iterator.create = null

  var $Class = $Array.class
  $export($Class, 'iterate', function () {
    return create(Array.isArray(this) ? { _array: this } : [])
  })
}
