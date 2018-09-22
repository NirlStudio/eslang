
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Lambda = $.lambda
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the noop function
  var noop = link(Type, 'noop', $void.function(function () {
    return null
  }, $Tuple.function))

  // prepare common type implementation.
  prepareOperation(Type, noop, $Tuple.function)

  var proto = Type.proto
  // apply a function and expand arguments from an array.
  link(proto, 'apply', $Lambda.proto.apply)

  // Desccription
  link(proto, 'to-string', function () {
    return (this.code || $Tuple.function)['to-string']()
  })

  // inject type
  Function.prototype.type = Type // eslint-disable-line no-extend-native
}
