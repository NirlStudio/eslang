'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var proto = $.Range.proto

  proto.begin = 0
  proto.end = 0
  proto.step = 1

  proto.constructor = function (begin, end, step) {
    if (typeof begin !== 'number') {
      begin = 0
    }
    if (typeof end !== 'number') {
      end = begin
      begin = 0
    }
    if (typeof step !== 'number' || step === 0) {
      step = end >= begin ? 1 : -1
    }
    this.begin = begin
    this.end = end
    this.step = step
  }

  require('./range-iterator')($)
}
