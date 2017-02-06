'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.Object
  var variable = $void.variable
  var virtual = $void.virtual

  var iterator = variable($Object, 'Iterator', $.class({
    _object: null,
    _fields: [],
    _index: -1,
    key: null,
    value: null,

    constructor: function Object$Iterator$constructor (obj) {
      if (typeof obj !== 'object') {
        obj = {}
      }
      this._object = obj
      this._fields = Object.getOwnPropertyNames(obj)
    },

    next: function Object$Iterator$next () {
      this._index += 1
      if (this._index >= this._fields.length) {
        return false
      }

      this.key = this._fields[this._index]
      this.value = this._object[this.key]
      return true
    },

    'is-empty': function Object$Iterator$isEmpty () {
      return this._fields.length < 1 || this._index >= this._fields.length
    }
  }))

  virtual($Object.proto, 'iterate', function () {
    return iterator.construct(this)
  })
}
