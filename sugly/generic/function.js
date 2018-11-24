
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable
  var defineTypeProperty = $void.defineTypeProperty

  // the noop function
  var noop = link(Type, 'noop', $void.function(function () {
    return null
  }, $Tuple.function))

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.function)

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.function)

  // inject function as the default type for native functions.
  defineTypeProperty(Function.prototype, Type)
}
