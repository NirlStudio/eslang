'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.Type
  var typeOf = $void.typeOf
  var readonly = $void.readonly
  var virtual = $void.virtual
  var isPrototypeOf = $void.isPrototypeOf

  // all types will inherits here.
  readonly(Type, 'is-a', function Type$isA (type) {
    return typeof type === 'undefined' || type === null ? false
      : this === type || isPrototypeOf(type, this)
  })
  readonly(Type, 'is-not-a', function Type$isNotA (type) {
    return typeof type === 'undefined' || type === null ? true
      : this !== type && !isPrototypeOf(type, this)
  })
  readonly(Type, 'super', function Type$super () {
    var type = Object.getPrototypeOf(this)
    return type === Type || isPrototypeOf(Type, type) ? type : null
  })

  // all types and their instances will inherits here.
  var proto = Type.proto

  // Type Verification: to test if an entity is an instance of a type.
  // native types should override all these logic.
  virtual(proto, 'is-a', function entity$isA (type) {
    var thisType = typeOf(this)
    return thisType === type || isPrototypeOf(type, thisType)
  })

  virtual(proto, 'is-not-a', function entity$isNotA (type) {
    var thisType = typeOf(this)
    return thisType !== type && !isPrototypeOf(type, typeOf(this))
  })
  // Generalization: the super type is determined by the proto field.
  virtual(proto, 'super', function entity$super () {
    return this && this.type && typeof this.type.super === 'function'
      ? this.type.super() : null
  })

  // all known types should implement their own to-code logic.
  readonly(proto, 'to-code', function entity$toCode () {
    return '()' // differ it from 'null'
  })

  // all known types should implement their own describing logic.
  virtual(proto, 'to-string', function entity$toString () {
    return '()'
  })

  // Ordinarily, an entity will be taken as a non-empty since it's different
  // with null. So null can be the default empty value of all entities, but a
  // type can define its own empty entity.
  virtual(proto, 'is-empty', function entity$isEmpty () {
    return false
  })
  virtual(proto, 'not-empty', function entity$notEmpty () {
    return true
  })

  // indexer: general & primary predicate.
  // any entity can have the capabilities of Type.proto at least.
  readonly(proto, ':', function entity$indexer (name) {
    return typeof name !== 'string' ? null
      : typeof this[name] !== 'undefined' ? this[name] : null
  })

  // common logical predicates to serve all null and entities.
  virtual(proto, '?', function enity$boolTest (a, b) {
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
  virtual(proto, '??', function enity$nullFallback () {
    return this
  })
}
