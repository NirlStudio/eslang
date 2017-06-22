
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Operator = $.operator
  var link = $void.link
  var Tuple$ = $void.Tuple
  var $export = $void.export
  var prepareOperation = $void.prepareOperation

  // the empty function
  link(Type, 'empty', $void.function(function () {
    return null
  }, new Tuple$( // (= () )
    [$Symbol.lambda, $Tuple.empty, new Tuple$([], true)]
  )))

  // prepare common type implementation.
  prepareOperation(Type)

  // Encoding: downgrade to a lambda.
  // Desccription
  link(Type.proto, 'to-string', function () {
    return typeof this !== 'function' ? null
      : (this.name || '?function') + $Tuple.of($Symbol.function,
        this.code instanceof Tuple$ ? this.code.$[1] : $Tuple.unknown,
        $Symbol.etc)['to-string']()
  })

  // apply a function and expand arguments from an array.
  $export($, 'apply', function (subject, func, args) {
    // re-arrange arguments
    switch (arguments.length) {
      case 0:
        return null
      case 1:
        func = subject
        subject = null
        args = []
        break
      case 2:
        args = func
        func = subject
        subject = null
        break
      default:
        break
    }
    if (typeof subject === 'undefined') {
      subject = null
    }
    if (!Array.isArray(args)) {
      args = []
    }
    return typeof func === 'function' && func.type !== $Operator
      ? func.apply(subject, args) : null
  })
}
