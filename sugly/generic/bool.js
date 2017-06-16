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
  var valueOf = $void.boolValueOf = link(Type, 'of', function (value) {
    return typeof value !== 'undefined' && value !== null && value !== 0 && value !== false
  })

  // static boolean operations
  // TODO - convert to operators
  var and = link(Type, ['and', '&&'], function () {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'boolean') {
        arg = valueOf(arg)
      }
      if (!arg) {
        return false
      }
    }
    return true
  })
  var or = link(Type, ['or', '||'], function () {
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'boolean') {
        arg = valueOf(arg)
      }
      if (arg) {
        return true
      }
    }
    return false
  })
  link(Type, ['not', '!'], function (value) {
    return !(typeof value === 'boolean' ? value : valueOf(value))
  })

  // override type's indexer
  typeIndexer(Type)

  var proto = Type.proto
  // function form logical operations
  // TODO - convert to operators
  link(proto, ['and', '&&'], function (value) {
    return typeof this !== 'boolean' ? null
      : this && (arguments.length > 1
        ? and.apply(null, arguments) : valueOf(value))
  })
  link(proto, ['or', '||'], function (value) {
    return typeof this !== 'boolean' ? null
      : this || (arguments.length > 1
        ? or.apply(null, arguments) : valueOf(value))
  })
  link(proto, ['not', '!'], function () {
    return typeof this === 'boolean' ? !this : null
  })

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
