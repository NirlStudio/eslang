
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.lambda
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var link = $void.link
  var Tuple$ = $void.Tuple
  var prepareOperation = $void.prepareOperation

  // the empty function
  link(Type, 'empty', $void.lambda(function () {
    return null
  }, new Tuple$( // (= () )
    [$Symbol.lambda, $Tuple.empty, new Tuple$([], true)]
  )))

  // prepare common type implementation.
  prepareOperation(Type)

  var proto = Type.proto
  // Encoding: convert this lambda or function to a tuple.
  link(proto, 'to-code', function () {
    return typeof this !== 'function' ? null
      : this.code instanceof Tuple$ ? this.code : $Tuple.lambda
  })

  // Desccription
  link(proto, 'to-string', function () {
    return typeof this !== 'function' ? null
      : (this.name || '?lambda') + $Tuple.of($Symbol.lambda,
        this.code instanceof Tuple$ ? this.code.$[1] : $Tuple.unknown,
        $Symbol.etc)['to-string']()
  })
}
