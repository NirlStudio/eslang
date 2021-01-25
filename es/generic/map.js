'use strict'

module.exports = function arrayIn ($void) {
  var $ = $void.$
  var Type = $.map
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var iterateOf = $void.iterateOf
  var boolValueOf = $void.boolValueOf
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var EncodingContext$ = $void.EncodingContext

  // create an empty array.
  link(Type, 'empty', function () {
    return new Map()
  }, true)

  link(Type, 'of', function () {
  }, true)

  link(Type, 'from', function () {

  })

  var proto = Type.proto
  link(proto, 'size', function () {
    return this.size
  })

  link(proto, 'has', function () {

  })

  link(proto, 'contains', function () { // an array, set of keys, or another map.

  })

  link(proto, 'set', function () {

  })

  link(proto, 'get', function () {

  })

  link(proto, 'merge', function () { // other maps

  })

  link(proto, 'delete', function () { // keys

  })

  link(proto, 'remove', function () { // other maps, or set/array of keys

  })

  link(proto, 'clear', function () {

  })

  link(proto, 'keys', function () { //

  })

  link(proto, 'values', function () { //

  })

  link(proto, 'for-each', function () {

  })

  // add set operation
  // override iterate, compare?, to-code (@:set ..), to-string
}
