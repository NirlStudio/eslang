'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Range = $.Range
  var readonly = $void.readonly

  readonly(Range, 'create', function Range$create (begin, end, step) {
    if (typeof begin !== 'number' || isNaN(begin)) {
      begin = 0
    }
    if (typeof end !== 'number' || isNaN(end)) {
      end = begin
      begin = 0
    }
    if (typeof step !== 'number' || isNaN(step) || step === 0) {
      step = end >= begin ? 1 : -1
    }

    var range = Object.create(Range.proto)
    range.begin = begin
    range.end = end
    range.step = step
    return range
  })

  var proto = Range.proto
  proto.begin = 0
  proto.end = 0
  proto.step = 1
}
