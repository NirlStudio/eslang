
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.operator
  var $Tuple = $.tuple
  var link = $void.link
  var typeVerifier = $void.typeVerifier
  var prepareOperation = $void.prepareOperation

  // the empty operator
  link(Type, 'empty', $void.operator(function () {
    return null
  }, $Tuple.operator))

  // prepare common type implementation.
  prepareOperation(Type, $Tuple.operator)

  // common type verifier
  typeVerifier(Type)

  var proto = Type.proto
  // Desccription
  link(proto, 'to-string', function () {
    return typeof this !== 'function'
      ? this === proto ? '(operator proto)' : null
      : '#( ' + (this.name || '?operator') + ' )# ' +
        (this.code || $Tuple.operator)['to-string']()
  })
}
