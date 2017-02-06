'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Range = $.Range
  var constant = $void.constant
  var readonly = $void.readonly

  var iterator = constant(Range, 'Iterator', $.class({
    _begin: 0,
    _end: 0,
    _step: 1,
    value: 0,

    constructor: function (range) {
      if (range['is-a'](Range)) {
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
    },

    'is-empty': function Range$Iterator$isEmpty () {
      return this._step === 0 ? false
        : this._step > 0 ? this._end > this._begin : this._end < this._begin
    }
  }))

  readonly(Range.proto, 'iterate', function () {
    return iterator.construct(this)
  })
}
