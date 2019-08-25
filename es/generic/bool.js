'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.bool
  var link = $void.link
  var Symbol$ = $void.Symbol
  var bindThis = $void.bindThis
  var protoValueOf = $void.protoValueOf

  // the empty value of bool is the false.
  link(Type, 'empty', false)

  // booleanize
  $void.boolValueOf = link(Type, 'of', bindThis(Type, $void.isTruthy), true)

  var proto = Type.proto
  // Emptiness
  link(proto, 'is-empty', function () {
    return this === false
  })
  link(proto, 'not-empty', function () {
    return this !== false
  })

  // Representation
  link(proto, 'to-string', function () {
    return this === true ? 'true' : 'false'
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
