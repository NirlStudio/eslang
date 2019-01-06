
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable

  // the noop lambda
  var noop = link(Type, 'noop', $void.lambda(function () {
    return null
  }, $Tuple.lambda), true)

  link(Type, 'static', $void.lambda(function () {
    return null
  }, $Tuple.stambda), true)

  var proto = Type.proto
  link(proto, 'is-static', function () {
    return (this.code instanceof Tuple$) && (
      this.code.$[0] === $Symbol.stambda
    )
  })

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.lambda)

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.lambda)
}
