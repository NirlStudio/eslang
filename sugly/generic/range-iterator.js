'use strict'

var $export = require('../export')

module.exports = function ($) {
  var $Range = $.Range
  var iterator = $export($Range, 'Iterator', $.Iterator.derive({
    derive: null  // prevent inheritence
  }, {
    _begin: 0,
    _end: 0,
    _step: 1,

    value: 0,

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

  // prevent direct invocation.
  var create = iterator.create.bind(iterator)
  iterator.create = null

  var $Class = $Range.class
  $export($Class, 'iterate', function () {
    return create({
      _begin: this.begin,
      _end: this.end,
      _step: this.step,
      value: this.begin - this.step
    })
  })
}
