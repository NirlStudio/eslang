'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.bool
  var link = $void.link
  var Symbol$ = $void.Symbol

  // the empty value of bool is the false.
  link(Type, 'empty', false)

  // booleanize
  $void.boolValueOf = link(Type, 'of', function (value) {
    return value !== null && value !== 0 && value !== false && typeof value !== 'undefined'
  })

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
  link(proto, ':', function (index) {
    return typeof index === 'string' ? proto[index]
      : index instanceof Symbol$ ? proto[index.key] : null
  })

  // inject type
  Boolean.prototype.type = Type // eslint-disable-line no-extend-native
}
