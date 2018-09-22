
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the noop lambda
  var noop = link(Type, 'noop', $void.lambda(function () {
    return null
  }, $Tuple.lambda))

  // prepare common type implementation.
  prepareOperation(Type, noop, $Tuple.lambda)

  var proto = Type.proto

  // apply a function and expand arguments from an array.
  link(proto, 'apply', function (subject, args) {
    return typeof subject === 'undefined' ? this.apply(null)
      : Array.isArray(args) ? this.apply(subject, args)
        : typeof args === 'undefined' ? this.call(subject)
          : this.call(subject, args)
  })

  // Desccription
  link(proto, 'to-string', function () {
    return (this.code || $Tuple.lambda)['to-string']()
  })
}
