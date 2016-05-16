'use strict'

var $export = require('../export')

module.exports = function ($) {
  var Range = $.Range

  var iterator = $export(Range, 'Iterator', $.Class.new({}, {
    _begin: 0,
    _end: 0,
    _step: 1,
    value: 0,

    constructor: function (range) {
      if (Range['is-type-of'](range)) {
        this._begin = range.begin
        this._end = range.end
        this._step = range.step
        this.value = range.begin - range.step
      }
    },

    next: function Range$Iterator$next () {
      this.value += this._step

      if (this.value >= this._begin && this.value < this._end) {
        return true
      }
      if (this.value <= this._begin && this.value > this._end) {
        return true
      }
      return false
    }
  }))

  $export(Range.proto, 'iterate', function () {
    return iterator.create(this)
  })
}
