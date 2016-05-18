'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var Null = $void.null

  // Identity: to recognize two different entities.
  // Currently, only Number needs to override this logic for the sake of NaN.
  $export(Null, 'is', function null$is (another) {
    return this === (typeof another === 'undefined' ? null : another)
  })
  $export(Null, 'is-not', function null$is_not (another) {
    return this !== (typeof another === 'undefined' ? null : another)
  })

  // Equivalence: to test if two entities are equivalent in effect.
  // any known type can implement its own equivalence logic.
  // NaN is not equivalent with itself. TODO - to remove NaN at all?
  $export(Null, 'equals', function null$equals (another) {
    return this === (typeof another === 'undefined' ? null : another)
  })
  $export(Null, 'not-equals', function null$not_equals (another) {
    return this !== (typeof another === 'undefined' ? null : another)
  })
  // support equivalence operators. The behaviour of operators '==' and '!='
  // should always be consistent with 'equals' and 'not-equals'
  $export(Null, '==', function null$opr_equals (another) {
    return this === (typeof another === 'undefined' ? null : another)
  })
  $export(Null, '!=', function null$opr_not_equals (another) {
    return this !== (typeof another === 'undefined' ? null : another)
  })

  // Type Hierarchy: all generic type should override these methods.
  // Type Verification: to test if an entity is an instance of a type.
  $export(Null, 'is-a', function null$is_a (type) {
    // null is a null.
    return typeof type === 'undefined' || type === null
  })
  $export(Null, 'is-not-a', function null$is_not_a (type) {
    // and the null is nothing except null.
    return typeof type !== 'undefined' && type !== null
  })
  // Type Determination: any enity has a type, which could be null.
  $export(Null, 'get-type', function null$get_type () {
    // from all being's point of view, null is from null.
    return null
  })
  // Generalization: the super type is determined by the proto field.
  $export(Null, 'super', function null$super () {
    // from being's point of view, null has no superior.
    return null
  })

  // null is taken as empty
  $export(Null, 'is-empty', function null$is_empty () {
    return true
  })
  $export(Null, 'not-empty', function null$not_empty () {
    return false
  })

  // persistency
  $export(Null, 'to-code', function null$to_code () {
    return 'null'
  })
  // readable description
  $export(Null, 'to-string', function null$to_string () {
    return 'null'
  })

  // the indexer function for null. It's readonly since null is readonly.
  $export(Null, ':', function Null$indexer (name) {
    return typeof name !== 'string' ? null
      : (typeof Null[name] !== 'undefined' ? Null[name] : null)
  })

  // common logical predicates.
  // A boolean logical test operator.
  // - (x ?) returns true or false.
  // - (x ? y) returns y if x is evaluated to false.
  // - (x ? y z) return y if x is evaluated to true, z otherwise.
  $export(Null, '?', function Null$bool_test (a, b) {
    return typeof a === 'undefined' ? false : typeof b === 'undefined' ? a : b
  })
  // null fallback.
  // (x ?? y) returns y if and only if x is null.
  $export(Null, '??', function Null$null_fallback (alternative) {
    // for null, always returns the alternative value.
    return typeof alternative === 'undefined' ? null : alternative
  })
}
