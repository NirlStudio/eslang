
'use strict'

module.exports = function operatorIn ($void) {
  var $ = $void.$
  var Type = $.operator
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the noop operator
  var noop = link(Type, 'noop', $void.operator(function () {
    return null
  }, $Tuple.operator), true)

  // implement common operation features.
  prepareOperation(Type, noop, $Tuple.operator)
}
