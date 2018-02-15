'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.type
  var proto = Type.proto
  var link = $void.link
  var typeEncoder = $void.typeEncoder
  var typeIndexer = $void.typeIndexer

  /* The Supreme Prototype */
  // Identity inherits null: the default identity logic.
  // Equivalence inherits null: the identity-based equivalence logic.
  // Ordering inherits null: the identity-based equivalence or non-sortable.

  // Type Verification: the (type proto) is a null.
  link(proto, 'is-a', function (type) {
    return typeof type === 'undefined' || type === null
  }, 'is-not-a', function (type) {
    return typeof type !== 'undefined' && type !== null
  })

  // Emptiness inherits null: all prototypes are taken as empty.

  // Encoding inherits null

  // Description.
  link(proto, 'to-string', function () {
    return '(type proto)'
  })

  // Indexer
  typeIndexer(proto)

  /* The Primal Type */
  link(Type, 'of', $void.typeOf)

  // Identity inherits type.proto.
  // Equivalence inherits type.proto.
  // Ordering inherits type.proto.

  // Type Verification: shared for all instantiable types.
  // The primal type is a (type proto).
  // Any other type is a type.
  link(Type, 'is-a', function (type) {
    return type === (this === Type ? proto : Type)
  }, 'is-not-a', function (type) {
    return type !== (this === Type ? proto : Type)
  })

  // Emptiness: shared by all types
  // The primal type is taken as empty.
  // Any other type is not empty.
  link(Type, 'is-empty', function () {
    return this === Type
  }, 'not-empty', function () {
    return this !== Type
  })

  // Encoding && Description.
  typeEncoder(Type)

  // Indexer: only for the primal type.
  typeIndexer(Type)
}
