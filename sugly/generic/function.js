
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Tuple = $.tuple
  var link = $void.link
  var bindThis = $void.bindThis
  var prepareOperation = $void.prepareOperation
  var prepareApplicable = $void.prepareApplicable
  var defineTypeProperty = $void.defineTypeProperty

  // the noop function
  var noop = link(Type, 'noop', $void.function(function () {
    return null
  }, $Tuple.function), true)

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.function)

  var proto = Type.proto
  // bind a function to a fixed subject.
  link(proto, 'bind', function ($this) {
    return bindThis(typeof $this !== 'undefined' ? $this : null, this)
  })

  // implement applicable operation features.
  prepareApplicable(Type, $Tuple.function)

  // inject function as the default type for native functions.
  defineTypeProperty(Function.prototype, Type)
}
