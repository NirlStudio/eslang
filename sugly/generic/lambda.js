
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Operator = $.operator
  var $Tuple = $.tuple
  var $Array = $.Array
  var link = $void.link
  var typeVerifier = $void.typeVerifier
  var prepareOperation = $void.prepareOperation

  // the empty function
  link(Type, 'empty', $void.lambda(function () {
    return null
  }, $Tuple.lambda))

  // prepare common type implementation.
  prepareOperation(Type, $Tuple.lambda)

  // common type verifier
  typeVerifier(Type)

  var proto = Type.proto

  // apply a function and expand arguments from an array.
  link(proto, 'apply', function (subject, args) {
    if (typeof this !== 'function' || this.type === $Operator) {
      return null
    }
    if (typeof subject === 'undefined') {
      return this.apply(null)
    }
    return Array.isArray(args) ? this.apply(subject, args)
      : this.apply(subject, $Array.from(args))
  })

  // Desccription
  link(proto, 'to-string', function () {
    return typeof this !== 'function'
      ? this === proto ? '(lambda proto)' : null
      : '#( ' + (this.name || '?lambda') + ' )# ' +
        (this.code || $Tuple.lambda)['to-string']()
  })
}
