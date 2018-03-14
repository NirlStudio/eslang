'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.range
  var Range$ = $void.Range
  var Symbol$ = $void.Symbol
  var link = $void.link

  // the empty value
  link(Type, 'empty', new Range$(0, 0, 1))

  // create a range
  link(Type, 'of', function (begin, end, step) {
    if (typeof begin !== 'number' || isNaN(begin) || !isFinite(begin)) {
      begin = 0
    }
    if (typeof end === 'undefined') {
      end = begin
      begin = 0
    } else if (typeof end !== 'number' || isNaN(end) || !isFinite(end)) {
      end = 0
    }
    if (typeof step !== 'number' || isNaN(step) || !isFinite(step)) {
      step = 0
    }
    return new Range$(begin, end, step || (begin <= end ? 1 : -1))
  })

  var proto = Type.proto
  // generate an iterator function
  link(proto, 'iterate', function () {
    var range = this
    var current = null
    var next = this.begin
    return function (inSitu) {
      if (current !== null && inSitu === true) {
        return current
      }
      if (range.step > 0 ? next >= range.end : next <= range.end) {
        return null
      }
      current = next; next += range.step
      return current
    }
  })

  // Identity and Equivalence: to be determined by field values.
  link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || (
      another instanceof Range$ &&
      this.begin === another.begin &&
      this.end === another.end &&
      this.step === another.step)
  })
  link(proto, ['is-not', 'not-equals', '!='], function (another) {
    return this !== another && (
      !(another instanceof Range$) ||
      this.begin !== another.begin ||
      this.end !== another.end ||
      this.step !== another.step)
  })

  // override comparison logic to keep consistent with Identity & Equivalence.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : another instanceof Range$ && this.step === another.step
        ? this.begin < another.begin
          ? this.end >= another.end ? 1 : null
          : this.begin === another.begin
            ? this.end < another.end ? -1
              : this.end === another.end ? 0 : 1
            : this.end <= another.end ? -1 : null
        : null
  })

  // range is empty if it cannot iterate at least once.
  link(proto, 'is-empty', function () {
    return this.step > 0 ? this.begin >= this.end : this.begin <= this.end
  })
  link(proto, 'not-empty', function () {
    return this.step > 0 ? this.begin < this.end : this.begin > this.end
  })

  // Representation
  link(proto, 'to-string', function () {
    return '(' + [this.begin, this.end, this.step].join(' ') + ')'
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'string' ? this[index]
      : index instanceof Symbol$ ? this[index.key] : null
  })

  // export type indexer.
  link(Type, 'indexer', indexer)
}
