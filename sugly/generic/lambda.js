
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var $Array = $.Array
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the noop lambda
  var noop = link(Type, 'noop', $void.lambda(function () {
    return null
  }, $Tuple.lambda))

  // the empty function
  link(Type, 'empty', function () {
    return noop
  })

  // prepare common type implementation.
  prepareOperation(Type, $Tuple.lambda)

  var proto = Type.proto

  // apply a function and expand arguments from an array.
  link(proto, 'apply', function (subject, args) {
    return typeof subject === 'undefined' ? this.apply(null)
      : Array.isArray(args)
        ? this.apply(subject, args)
        : this.apply(subject, $Array.from(args))
  })

  // Desccription
  link(proto, 'to-string', function () {
    return (this.$name ? '#( ' + this.$name + ' )#\n' : '') +
        (this.code || $Tuple.lambda)['to-string']()
  })
}
