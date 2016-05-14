'use strict'

var $export = require('../export')

function isNull () {
  return function Null$is_null (value) {
    return typeof value === 'undefined' || value === null
  }
}

function isTypeOf () {
  return function Null$is_type_of (value) {
    return true
  }
}

function toCode () {
  return function Null$to_code () {
    return 'null'
  }
}

function nullIsSame () {
  return function null$is_same (another) {
    return Object.is(this, another)
  }
}

function nullIsTypeOf () {
  return function null$is_type_of (value) {
    return typeof this.class !== 'undefined' && Object.getPrototypeOf(value) === this.class
  }
}

function nullIsInstanceOf () {
  return function null$is_instance_of (type) {
    return typeof type.class !== 'undefined' && Object.getPrototypeOf(this) === type.class
  }
}

function nullToCode () {
  return function null$to_code () {
    // if code indeed goes here, this is not null, but we have to take this as null.
    return '()'
  }
}

module.exports = function ($) {
  // Null is the type and incarnation *object* of null.
  var Null = $.Null

  // only null is null.
  $export(Null, 'is', isNull())

  // only null equals null.
  $export(Null, 'equals', isNull())

  // Null is the type of null
  $export(Null, 'get-type', function () {
    return Null
  })

  // null is the type of everything, including itself.
  $export(Null, 'is-type-of', isTypeOf())

  // null is the instance of itself, no other entities can be.
  $export(Null, 'is-instance-of', isNull())

  // persistency
  $export(Null, 'to-code', toCode())

  // readable description
  $export(Null, 'to-string', toCode())

  // emptiness
  $export(Null, 'is-empty', function Null$is_empty () {
    return true
  })
  $export(Null, 'not-empty', function Null$not_empty () {
    return false
  })

  // Null is the original type of all other entities.
  var class_ = Null.class

  // the general identitiness
  $export(class_, 'is', nullIsSame())

  // the general inheritence hierarchy
  $export(class_, 'super', function () {
    return null
  })

  // the general equivalence - placeholder
  $export(class_, 'equals', nullIsSame())

  // the general class_-relationship logic
  $export(class_, 'get-type', function () {
    return Object.getPrototypeOf(this) || Null
  })
  $export(class_, 'is-type-of', nullIsTypeOf())
  $export(class_, 'is-instance-of', nullIsInstanceOf())

  // the general persistency - placeholder
  $export(class_, 'to-code', nullToCode())

  // the general description - placeholder
  $export(class_, 'to-string', nullToCode())

  // the general emptiness logic - placeholder
  $export(class_, 'is-empty', function () {
    return true
  })
  $export(class_, 'not-empty', function () {
    return false
  })

  // indexer: general & primary predicate.
  // readonly & to be overridden by all primary types.
  $export(class_, ':', function (name) {
    return typeof name === 'string' && typeof class_[name] !== 'undefined' ? class_[name] : null
  })

  // common logical predicates. Generally, not to be overridden.
  // A-B test.
  $export(class_, '?', function (a, b) {
    if (typeof this === 'undefined' || this === null || this === 0 || this === false) {
      a = b
    }
    return typeof a === 'undefined' ? null : a
  })
  // value fallback.
  $export(class_, '??', function (alternative) {
    if (typeof this !== 'undefined' && this !== null) {
      return this
    }
    return typeof alternative === 'undefined' ? null : alternative
  })

  // support general equivalence operators, being consistent with equals
  $export(class_, '==', function (another) {
    return Object.is(this, another)
  })
  $export(class_, '!=', function (another) {
    return !Object.is(this, another)
  })
}
