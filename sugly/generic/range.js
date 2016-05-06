'use strict'

function RangeIterator (begin, end, step) {
  this._begin = begin
  this._end = end
  this._step = step

  this.value = begin - step
}

RangeIterator.prototype.next = function () {
  this.value += this._step

  if (this.value >= this._begin && this.value < this._end) {
    return true
  }
  if (this.value <= this._begin && this.value > this._end) {
    return true
  }
  return false
}

function Range (begin, end, step) {
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

Range.prototype.iterate = function () {
  return new RangeIterator(this.begin, this.end, this.step)
}

module.exports = function (begin, end, step) {
  return new Range(begin, end, step)
}
