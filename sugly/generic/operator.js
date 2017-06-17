
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.operator
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var link = $void.link
  var Tuple$ = $void.Tuple
  var prepareOperation = $void.prepareOperation

  // the empty function
  link(Type, 'empty', $void.function(function () {
    return null
  }, new Tuple$( // (= () )
    [$Symbol.operator, $Tuple.empty, new Tuple$([], true)]
  )))

  // prepare common type implementation.
  prepareOperation(Type, $Tuple.operator)

  // Desccription
  link(Type.proto, 'to-string', function () {
    return typeof this !== 'function' ? null
      : (this.name || '?lambda') + $Tuple.of($Symbol.operator,
        this.code instanceof Tuple$ ? this.code.$[1] : $Tuple.unknown,
        $Symbol.etc)['to-string']()
  })
}
