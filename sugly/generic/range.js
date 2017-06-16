'use strict'

function iterator ($void) {
  var Range$ = $void.Range
  return function (counting) {
    if (!(this instanceof Range$)) {
      return null
    }
    var range = this
    var value = this.begin
    return function (inSitu) {
      if (range.step > 0 ? value >= range.end : value <= range.end) {
        return null
      }
      if (typeof inSitu !== 'undefined' && inSitu !== false && inSitu !== null && inSitu !== 0) {
        return value
      }
      var v = value; value += range.step
      return v
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.range
  var Range$ = $void.Range
  var Integer$ = $void.Integer
  var link = $void.link
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var managedIndexer = $void.managedIndexer

  // the empty value
  link(Type, 'empty', new Range$(0, 0, 1))

  // create a range
  link(Type, 'of', function (begin, end, step) {
    // begin: must be a finite value.
    if (begin instanceof Integer$) {
      begin = begin.number
    }
    if (typeof begin !== 'number' || isNaN(begin) || !isFinite(begin)) {
      begin = 0
    }
    // end: must be a finite value.
    if (end instanceof Integer$) {
      end = end.number
    }
    if (typeof end === 'undefined') {
      end = begin
      begin = 0
    } else if (typeof end !== 'number' || isNaN(end) || !isFinite(end)) {
      end = 0
    }
    // step: must be non-zero and finite.
    if (step instanceof Integer$) {
      step = step.number
    }
    if (typeof step !== 'number' || isNaN(step) || !isFinite(step)) {
      step = 0
    }
    return new Range$(begin, end, step || begin <= end ? 1 : -1)
  })

  typeIndexer(Type)

  var proto = Type.proto
  // generate an iterator function
  link(proto, 'iterate', iterator($void))

  // Identity and Equivalence: to be determined by field values.
  var equals = link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || (
      this instanceof Range$ && another instanceof Range$ &&
      this.begin === another.begin &&
      this.end === another.end &&
      this.step === another.step)
  }, ['is-not', 'not-equals', '!='])

  // override comparison logic to keep consistent with Identity & Equivalence.
  link(proto, 'compare', function (another) {
    return equals.call(this, another) ? 0 : null
  })

  // Type Verification
  typeVerifier(Type)

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
      : null
  })

  // Indexer for proto and instance values
  managedIndexer(Type, Range$, {
    begin: 1, end: 1, step: 1 // public fields
  })
}
