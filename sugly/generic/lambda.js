
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var link = $void.link
  var bindThis = $void.bindThis
  var constambda = $void.constambda
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable

  // the noop lambda
  var noop = link(Type, 'noop', $void.lambda(function () {
    return null
  }, $Tuple.lambda), true)

  link(Type, 'static', $void.constambda(function () {
    return null
  }, $Tuple.stambda), true)

  var proto = Type.proto
  link(proto, 'is-static', function () {
    return this.static === true || this.const === true
  })

  link(proto, 'is-const', function () {
    return this.const === true
  })

  // bind a lambda to a fixed subject.
  link(proto, 'bind', function (arg) {
    if (typeof this.bound === 'function') {
      return this
    }
    if (typeof arg === 'undefined') {
      arg = null
    }
    return this.static !== true || typeof this.this === 'undefined'
      ? bindThis(arg, this)
      : constambda(this.bind(null, arg), this.code)
  })

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.lambda)

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.lambda)
}
