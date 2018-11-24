
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable

  // the noop lambda
  var noop = link(Type, 'noop', $void.lambda(function () {
    return null
  }, $Tuple.lambda))

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.lambda)

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.lambda)
}
