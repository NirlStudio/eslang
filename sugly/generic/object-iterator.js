'use strict'

var $export = require('../export')

module.exports = function ($) {
  var $Object = $.Object

  var iterator = $export($Object, 'Iterator', $.Iterator.derive({
    derive: null  // prevent inheritence
  }, {
    _object: null,
    _fields: [],
    _index: -1,

    key: null,
    value: null,

    next: function Object$Iterator$next () {
      this._index += 1
      if (this._index >= this._fields.length) {
        return false
      }

      this.key = this._fields[this._index]
      this.value = this._object[this.key]
      return true
    }
  }))

  // prevent direct invocation.
  var create = iterator.create.bind(iterator)
  iterator.create = null

  var $Class = $Object.class
  var isObject = Object.prototype.isPrototypeOf.bind($Class)
  $export($Class, 'iterate', function () {
    return create(isObject(this) ? {
      _object: this,
      _fields: this['get-fields']()
    } : null)
  })
}
