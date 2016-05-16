'use strict'

var $export = require('../export')

module.exports = function ($) {
  var Class = $.Class

  var iterator = $export(Class, 'Iterator', Class.new({}, {
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
    }
  })
)
  $export(Class.proto, 'iterate', function () {
    return iterator.create(this)
  })
}
