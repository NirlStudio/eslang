'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.bool
  var link = $void.link
  var initializeType = $void.initializeType
  var protoIndexer = $void.protoIndexer

  // the empty value of bool is the false.
  initializeType(Type, false)

  // booleanize
  $void.boolValueOf = link(Type, 'of', function (value) {
    return typeof value !== 'undefined' && value !== null && value !== 0 && value !== false
  })

  var proto = Type.proto
  // logical operations are defined as general operators.

  // Emptiness - false is the empty value
  link(proto, 'is-empty', function () {
    return this === false
  }, 'not-empty', function () {
    return this !== false
  })

  // Encoding
  link(proto, 'to-code', function () {
    return typeof this === 'boolean' ? this : null
  })

  // Representation
  link(proto, 'to-string', function () {
    return typeof this === 'boolean' ? this ? 'true' : 'false'
      : this === proto ? '(bool proto)' : null
  })

  // add indexer
  protoIndexer(Type)

  // inject type
  Boolean.prototype.type = Type // eslint-disable-line no-extend-native
}
