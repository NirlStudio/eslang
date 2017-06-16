
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var link = $void.link
  var Tuple$ = $void.Tuple
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
}
