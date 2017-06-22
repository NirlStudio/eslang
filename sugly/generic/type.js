'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.type
  var proto = Type.proto
  var Type$ = $void.Type
  var link = $void.link
  var sharedSymbolOf = $void.sharedSymbolOf
  var isPrototypeOf = $void.isPrototypeOf

  /* The Supreme Prototype */
  // Identity inherits null: the default identity logic.
  // Equivalence inherits null: the identity-based equivalence logic.
  // Ordering inherits null: the identity-based equivalence or non-sortable.

  // Type Verification: override to support descendant protos.
  link(proto, 'is-a', function (type) {
    return this !== proto ? type === proto
      : typeof type === 'undefined' || type === null
  }, 'is-not-a', function (type) {
    return this !== proto ? type !== proto
      : typeof type !== 'undefined' && type !== null
  })

  // Emptiness inherits null: all prototypes are taken as empty.

  // Encoding inherits null. Here means prototypes are not encodable.

  // Description
  link(proto, 'to-string', function () { // TODO for class and device
    return typeof this !== 'object' ? null // not a valid prototype
      : this.type && typeof this.type.name === 'string' && this.type.name
          ? '(' + this.type.name + ' proto)' // the prototype of a name type.
          : '(? proto)' // the prototype of an anonymous type.
  })

  // Indexer
  link(proto, ':', function (name) {
    return typeof name !== 'string' || name === ':' ? null
      : name === 'type' ? null // fake field
        : (typeof proto[name] !== 'undefined' ? proto[name] : null)
  })

  /* The Primal Type */
  // Identity inherits type.proto.
  // Equivalence inherits type.proto.
  // Ordering inherits type.proto.

  // Type Verification: shared for all instantiable types.
  // the primal type is a prototype.
  // Another instantiable type is a type.
  link(Type, 'is-a', function (type) {
    return type === (this === Type ? proto : Type)
  }, 'is-not-a', function (type) {
    return type !== (this === Type ? proto : Type)
  })

  // Type Hierarchy: shared for all types.
  // retrieve the most recent super type of a type.
  link(Type, 'super', function () {
    return this instanceof Type$ ? Object.getPrototypeOf(this) : null
  })
  // test if a type is a specific type or its descendant.
  link(Type, 'is-of', function (type) {
    return this === type || isPrototypeOf(type, this)
  }, 'is-not-of')

  // Emptiness: shared by all types
  // a type is not taken as empty.
  link(Type, 'is-empty', function () {
    return false
  }, 'not-empty', function () {
    return true
  })

  // Encoding: shared for all global types.
  link(Type, 'to-code', function () {
    return this instanceof Type$ ? sharedSymbolOf(this.name) : null
  })

  // Description: shared for all global types.
  link(Type, 'to-string', function () {
    return this && typeof this.name === 'string' ? this.name : null
  })

  // Indexer: only for the primal type.
  link(Type, ':', function (name) {
    return typeof name !== 'string' || name === ':' ? null
      : name === 'type' ? this === Type ? proto : Type // fake field
        : (typeof Type[name] !== 'undefined' ? Type[name] : null)
  })
}
