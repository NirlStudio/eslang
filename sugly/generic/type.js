'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var Type$ = $void.Type
  var isPrototypeOf = $void.isPrototypeOf
  var Type = $.Type

  // all types will inherits here.
  $export(Type, 'is-a', function Type$is_a (type) {
    return typeof type === 'undefined' || type === null ? false
      : isPrototypeOf(type, this)
  })
  $export(Type, 'is-not-a', function Type$is_not_a (type) {
    return typeof type === 'undefined' || type === null ? true
      : !isPrototypeOf(type, this)
  })
  $export(Type, 'get-type', function Type$get_type () {
    return Type // Type is the type of all types
  })
  $export(Type, 'super', function Type$super () {
    return Object.getPrototypeOf(this.proto).type || null
  })

  // all types and their instances will inherits here.
  var proto = Type.proto

  // Identity and Equivalence behaviour inherits from null.

  // Type Verification: to test if an entity is an instance of a type.
  // native types should override all these logic.
  $export(proto, 'is-a', function entity$is_a (type) {
    if (typeof type === 'undefined' || type === null ||
      !(type instanceof Type$)) {
      return false
    }
    var proto = Object.getPrototypeOf(this)
    if (!(proto.type instanceof Type$)) {
      return false
    }
    return proto.type === type || isPrototypeOf(type, proto.type)
  })
  $export(proto, 'is-not-a', function entity$is_not_a (type) {
    if (typeof type === 'undefined' || type === null ||
      !(type instanceof Type$)) {
      return true
    }
    var proto = Object.getPrototypeOf(this)
    if (!(proto.type instanceof Type$)) {
      return true
    }
    return proto.type === type || isPrototypeOf(type, proto.type)
  })
  // Type Determination: any enity has a type, which could be null.
  $export(proto, 'get-type', function entity$get_type () {
    return typeof this.type !== 'undefined'
      ? this.type : typeof this === 'object' ? $.Class : null
  })
  // Generalization: the super type is determined by the proto field.
  $export(proto, 'super', function entity$super () {
    var proto = Object.getPrototypeOf(this)
    return proto && proto.type instanceof Type$ ? proto.type.super() : null
  })

  // all known types should implement their own to-code logic.
  $export(proto, 'to-code', function entity$to_code () {
    return this.identityName || this.name || '()' // differ it from 'null'
  })

  // all known types should implement their own describing logic.
  $export(proto, 'to-string', function entity$to_string () {
    return this.identityName || this.name || '()'
  })

  // Ordinarily, an entity will be taken as a non-empty since it's different
  // with null. So null can be the default empty value of all entities, but a
  // type can define its own empty entity.
  $export(proto, 'is-empty', function entity$is_empty () {
    return false
  })
  $export(proto, 'not-empty', function entity$not_empty () {
    return true
  })

  // indexer: general & primary predicate.
  // any entity can have the capabilities of Type.proto at least.
  $export(proto, ':', function entity$indexer (name) {
    return typeof name !== 'string' ? null
      : typeof this[name] !== 'undefined' ? this[name] : null
  })

  // common logical predicates to serve all null and entities.
  $export(proto, '?', function enity$bool_test (a, b) {
    if (typeof a === 'undefined') {
      // booleanize
      a = true; b = false
    } else if (typeof b === 'undefined') {
      // logical fallback
      b = a; a = this
    }
    // A-B test
    return this !== 0 && this !== false ? a : b
  })
  $export(proto, '??', function enity$null_fallback (alternative) {
    return this
  })
}
