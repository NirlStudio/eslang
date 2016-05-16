'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var Type = $void.Type
  var isPrototypeOf = $void.isPrototypeOf

  // Null is equivalent with null since null is the only instance of itself.
  // But because null is the logical singular point and its noumenon only exists
  // metaphysically, Null can be taken as its incarnation in phycial space.
  var Null = $.Null

  // define universal properties for all entities.
  // Identity: only null is null.
  // So Null is not itself, ((Null is Null) is false)
  $export(Null, 'is', function Null$is (another) {
    return typeof another === 'undefined' || another === null
  })
  $export(Null, 'is-not', function Null$is_not (another) {
    return typeof another !== 'undefined' && another !== null
  })

  // Equivalence: only null equals null.
  // So Null does not equal itself, ((Null equals Null) is false)
  $export(Null, 'equals', function Null$equals (another) {
    return typeof another === 'undefined' || another === null
  })
  $export(Null, 'not-equals', function Null$not_equals (another) {
    return typeof another !== 'undefined' && another !== null
  })

  // Derivation: null is a type.
  $export(Null, 'is-type', function Null$is_type () {
    return true
  })
  // Derivation Test: Null is the type of null.
  $export(Null, 'is-type-of', function Null$is_type_of (value) {
    return typeof value === 'undefined' || value === null
  })
  // Derivation Hierarchy: null is the super type of itself.
  $export(Null, 'super', function Null$super () {
    return null
  })

  // Generalization: null is the type of itself.
  $export(Null, 'get-type', function Null$get_type () {
    return null
  })

  // Instantiation: null is also an instance.
  $export(Null, 'is-instance', function Null$get_type () {
    return true
  })
  // Object Test: null is the instance of itself.
  $export(Null, 'is-instance-of', function Null$is_instance_of (type) {
    return typeof type === 'undefined' || type === null || type === Null
  })

  // persistency
  $export(Null, 'to-code', function Null$to_code () {
    return 'null'
  })

  // readable description
  $export(Null, 'to-string', function Null$to_string () {
    return 'Null'
  })

  // null is taken as empty
  $export(Null, 'is-empty', function Null$is_empty () {
    return true
  })
  $export(Null, 'not-empty', function Null$not_empty () {
    return false
  })

  // override to boost the evaluation.
  $export(proto, ':', function Null$indexer (name) {
    return typeof name !== 'string' ? null
      : (typeof Null[name] !== 'undefined' ? Null[name] : null)
  })
  $export(proto, '?', function Null$bool_test (a, b) {
    if (typeof a === 'undefined') {
      return false
    }
    return typeof b === 'undefined' ? a : b
  })
  $export(proto, '??', function Null$null_fallback (alternative) {
    return typeof alternative === 'undefined' ? null : alternative
  })
  $export(Null, '==', function Null$opr_equals (another) {
    return typeof another === 'undefined' || another === null
  })
  $export(Null, '!=', function Null$opr_not_equals (another) {
    return typeof another !== 'undefined' && another !== null
  })

  // Null can support some common behaviours of entities of unknown class.
  var proto = Null.proto

  // the general identitiness
  $export(proto, 'is', function entity$is (another) {
    return this === another
  })
  $export(proto, 'is-not', function entity$is_not (another) {
    return this !== another
  })

  // the general equivalence: different identities are always different.
  $export(proto, 'equals', function entity$equals (another) {
    return this === another
  })
  $export(proto, 'not-equals', function entity$not_equals (another) {
    return this !== another
  })

  // the general type Hierarchy logic
  // Derivation: all types are instantiated from Type.
  $export(proto, 'is-type', function entity$is_type () {
    return this instanceof Type
  })
  // Derivation Test: an instance is determined by its prototype.
  // a type is determined by its proto field
  $export(proto, 'is-type-of', function entity$is_type_of (value) {
    return this instanceof Type
      ? isPrototypeOf(this.proto,
        value instanceof Type ? value.proto : value) : false
  })
  // Derivation: the super type is determined by the proto field.
  $export(proto, 'super', function entity$super () {
    if (this instanceof Type) {
      return Object.getPrototypeOf(this).type || null
    }
    var type = (Object.getPrototypeOf(this).type || null)
    return type instanceof type ? (Object.getPrototypeOf(this).type || null) : null
  })

  // Typed: any enity has a type, which could be null.
  $export(proto, 'get-type', function entity$get_type () {
    return this instanceof Type ? null
      : (Object.getPrototypeOf(this).type || null)
  })

  // Instantiation: Ordinarily, a type would not be an instance, except null.
  $export(proto, 'is-instance', function entity$is_instance () {
    return !(this instanceof Type)
  })
  // Instantiation Test: an entity is an instance of its type.
  $export(proto, 'is-instance-of', function entity$is_instance_of (type) {
    return !(this instanceof Type) && (type instanceof Type) &&
      isPrototypeOf(type.proto, this)
  })

  // all known types should implement their own to-code logic.
  $export(proto, 'to-code', function entity$to_code () {
    return this.identityName || '()' // differ it from 'null'
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
  // an entity can have the properties of Null.proto at least.
  $export(proto, ':', function entity$indexer (name) {
    return typeof name !== 'string' ? null
      : (typeof this[name] !== 'undefined' ? this[name]
        // for generc value types
        : (typeof proto[name] !== 'undefined' ? proto[name] : null))
  })

  // common logical predicates to serve all null and entities.
  // A boolean test basing on this value's boolean logic.
  $export(proto, '?', function enity$bool_test (a, b) {
    if (typeof a === 'undefined') {
      a = true; b = false // booleanize
    } else if (typeof b === 'undefined') {
      b = a; a = this // logical fallback
    }
    // A-B test
    if (typeof this === 'undefined' || this === null ||
      this === 0 || this === false) {
      a = b
    }
    return typeof a === 'undefined' ? null : a
  })
  // a null value fallback.
  $export(proto, '??', function enity$null_fallback (alternative) {
    return this
  })

  // support general equivalence operators, being consistent with equals
  // any known type can implement its own equivalence logic. And the result of
  // operators '==' and '!=' should always be consistent with 'equals'
  $export(proto, '==', function entity$opr_equals (another) {
    return this === another
  })
  $export(proto, '!=', function entity$opr_not_equals (another) {
    return this !== another
  })
}
