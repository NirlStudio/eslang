'use strict'

function iterator ($void) {
  var Range$ = $void.Range
  return function () {
    if (!(this instanceof Range$)) {
      return null
    }
    var range = this
    var current = null
    var next = this.begin
    return function range$iterate (inSitu) {
      if (current !== null &&
          typeof inSitu !== 'undefined' && inSitu !== false &&
          inSitu !== null && inSitu !== 0) {
        return current
      }
      if (range.step > 0 ? next >= range.end : next <= range.end) {
        return null
      }
      current = next
      next += range.step
      return current
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.range
  var Range$ = $void.Range
  var link = $void.link
  var initializeType = $void.initializeType
  var protoIndexer = $void.protoIndexer

  // the empty value
  initializeType(Type, new Range$(0, 0, 1))

  // create a range
  link(Type, 'of', function (begin, end, step) {
    // begin: must be a finite value.
    if (typeof begin !== 'number' || isNaN(begin) || !isFinite(begin)) {
      begin = 0
    }
    // end: must be a finite value.
    if (typeof end === 'undefined') {
      end = begin
      begin = 0
    } else if (typeof end !== 'number' || isNaN(end) || !isFinite(end)) {
      end = 0
    }
    // step: must be non-zero and finite.
    if (typeof step !== 'number' || isNaN(step) || !isFinite(step)) {
      step = 0
    }
    return new Range$(begin, end, step || (begin <= end ? 1 : -1))
  })

  var proto = Type.proto
  // generate an iterator function
  link(proto, 'iterate', iterator($void))

  // Identity and Equivalence: to be determined by field values.
  link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || (
      this instanceof Range$ && another instanceof Range$ &&
      this.begin === another.begin &&
      this.end === another.end &&
      this.step === another.step)
  }, ['is-not', 'not-equals', '!='])

  // override comparison logic to keep consistent with Identity & Equivalence.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : this instanceof Range$ && another instanceof Range$ && this.step === another.step
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
    return this instanceof Range$
      ? (this.step > 0 ? this.begin >= this.end : this.begin <= this.end)
      : null
  }, 'not-empty')

  // Encoding
  link(proto, 'to-code', function () {
    return this instanceof Range$ ? this : null
  })

  // Representation
  link(proto, 'to-string', function () {
    return this instanceof Range$
      ? '(' + [this.begin, this.end, this.step].join(' ') + ')'
      : this === proto ? '(range proto)' : null
  })

  // add indexer
  protoIndexer(Type, Object.assign(Object.create(null), {
    begin: 'begin',
    end: 'end',
    step: 'step'
  }))
}
