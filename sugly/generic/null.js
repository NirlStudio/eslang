'use strict'

module.exports = function ($void) {
  var Null = $void.null
  var link = $void.link
  var Symbol$ = $void.Symbol

  // Fundamental Entity Relationships: Identity, Equivalence and Ordering
  // Identity, Equivalence and Ordering logics must be symmetrical.
  // An identity must be equivalent with itself.
  // Ordering Equal must comply with Equivalence Equal.

  link(Null, [
    // Identity: to recognize two different entities.
    'is', '===',
    // Equivalence: to test if two entities are equivalent in effect.
    // Equivalence logic should be implemented symmetrically.
    // So it's different with the behaviour of NaN in JS, since an identity must be
    // equivalent in effect with itself, or as an identity's behaviour cannot be
    // defined by any property that's unrelevant with its effect to its environment.
    'equals', '=='
  ], function (another) {
    return Object.is(typeof this === 'undefined' ? null : this,
      typeof another === 'undefined' ? null : another)
  })
  link(Null, [
    // the negative method of Identity test.
    'is-not', '!==',
    // the negative method of Equivalence test.
    'not-equals', '!='
  ], function (another) {
    return !Object.is(typeof this === 'undefined' ? null : this,
      typeof another === 'undefined' ? null : another)
  })

  // Ordering: general comparison
  //     0 - identical
  //     1 - from this to another is descending.
  //    -1 - from this to another is ascending.
  //  null - not-sortable
  link(Null, 'compare', function (another) {
    return Object.is(this, typeof another === 'undefined' ? null : another)
      ? 0 : null
  })

  // Emptiness: null, type.proto and all protos are empty.
  link(Null, 'is-empty', function () {
    return true
  })
  link(Null, 'not-empty', function () {
    return false
  })

  // Type Verification: to test if an entity is an instance of a type.
  link(Null, 'is-a', function (type) {
    // null is null and null is a null.
    // type.proto is not null but is a null.
    return typeof type === 'undefined' || type === null
  })
  link(Null, 'is-not-a', function (type) {
    return typeof type !== 'undefined' && type !== null
  })

  // Encoding
  link(Null, 'to-code', function () {
    return this
  })

  // Representation (static values) or Description (non-static values)
  link(Null, 'to-string', function () {
    return 'null'
  })

  // Indexer
  link(Null, ':', function (index) {
    return typeof index === 'string' ? Null[index]
      : index instanceof Symbol$ ? Null[index.key] : null
  })
}
