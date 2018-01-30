
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Lambda = $.lambda
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the empty function
  link(Type, 'empty', $void.function(function () {
    return null
  }, $Tuple.function))

  // prepare common type implementation.
  prepareOperation(Type, $Tuple.function)

  var proto = Type.proto

  // type verification: a function is also a lambda
  link(proto, 'is-a', function (t) {
    return t === Type || t === $Lambda
  }, 'is-not-a', function (t) {
    return t !== Type && t !== $Lambda
  })

  // Desccription
  link(proto, 'to-string', function () {
    return typeof this !== 'function'
      ? this === proto ? '(function proto)' : null
      : '#( ' + (this.name || '?function') + ' )# ' +
        (this.code || $Tuple.function)['to-string']()
  })

  // inject type
  Function.prototype.type = Type // eslint-disable-line no-extend-native
}
