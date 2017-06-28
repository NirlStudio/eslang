'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.bool
  var link = $void.link
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer

  // the empty value of bool is the false.
  link(Type, 'empty', false)

  // booleanize
  $void.boolValueOf = link(Type, 'of', function (value) {
    return typeof value !== 'undefined' && value !== null && value !== 0 && value !== false
  })

  // override type's indexer
  typeIndexer(Type)

  var proto = Type.proto

  // logical operations are defined as general operators.

  typeVerifier(Type)

  // Emptiness - false is the empty value
  link(proto, 'is-empty', function () {
    return typeof this === 'boolean' ? !this : null
  }, 'not-empty', function bool$notEmpty () {
    return typeof this === 'boolean' ? this : null
  })

  // Encoding: standardize to a boolean value.
  link(proto, 'to-code', function () {
    return typeof this === 'boolean' ? this : null
  })

  // Representation
  link(proto, 'to-string', function () {
    return typeof this === 'boolean'
      ? this ? 'true' : 'false'
      : null
  })

  nativeIndexer(Type, Boolean, 'boolean')
}
