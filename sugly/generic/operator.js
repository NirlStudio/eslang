
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.operator
  var $Tuple = $.tuple
  var link = $void.link
  var prepareOperation = $void.prepareOperation

  // the empty operator
  link(Type, 'empty', $void.operator(function () {
    return null
  }, $Tuple.operator))

  // prepare common type implementation.
  prepareOperation(Type, $Tuple.operator)

  var proto = Type.proto
  // Desccription
  link(proto, 'to-string', function () {
    return (this.$name ? '#( ' + this.$name + ' )#\n' : '') +
        (this.code || $Tuple.operator)['to-string']()
  })
}
