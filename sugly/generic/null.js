'use strict'

module.exports = function ($void) {
  var Null = $void.null
  var virtual = $void.virtual
  var readonly = $void.readonly

  // Identity: to recognize two different values.
  virtual(Null, 'is', function null$is (another) {
    return Object.is(this, typeof another === 'undefined' ? null : another)
  })
  virtual(Null, 'is-not', function null$isNot (another) {
    return !Object.is(this, typeof another === 'undefined' ? null : another)
  })

  // Equivalence: to test if two entities are equivalent in effect.
  // any known type can implement its own equivalence logic.
  // NaN is not equivalent with itself since it means a invalid state.
  virtual(Null, 'equals', function null$equals (another) {
    return this === (typeof another === 'undefined' ? null : another)
  })
  virtual(Null, 'not-equals', function null$notEquals (another) {
    return this !== (typeof another === 'undefined' ? null : another)
  })

  // support equivalence operators. The behaviour of operators '==' and '!='
  // should always be consistent with 'equals' and 'not-equals'
  virtual(Null, '==', function null$oprEquals (another) {
    return this === (typeof another === 'undefined' ? null : another)
  })
  virtual(Null, '!=', function null$oprNotEquals (another) {
    return this !== (typeof another === 'undefined' ? null : another)
  })

  // Type Hierarchy: all generic type should override these methods.
  // Type Verification: to test if an entity is an instance of a type.
  virtual(Null, 'is-a', function null$isA (type) {
    // null is a null.
    return typeof type === 'undefined' || type === null
  })
  virtual(Null, 'is-not-a', function null$isNotA (type) {
    // and the null is nothing except null.
    return typeof type !== 'undefined' && type !== null
  })
  // Generalization: the super type is determined by the proto field.
  virtual(Null, 'super', function null$super () {
    // from being's point of view, null has no superior.
    return null
  })

  // null is taken as empty
  virtual(Null, 'is-empty', function null$isEmpty () {
    return true
  })
  virtual(Null, 'not-empty', function null$notEmpty () {
    return false
  })

  // persistency
  readonly(Null, 'to-code', function null$toCode (context) {
    return 'null'
  })
  // readable description
  virtual(Null, 'to-string', function null$toString (format) {
    return 'null'
  })

  // the indexer function for null. It's virtual since null is virtual.
  readonly(Null, ':', function Null$indexer (name) {
    return typeof name !== 'string' ? null
      : (typeof Null[name] !== 'undefined' ? Null[name] : null)
  })
  // null's type is null
  readonly(Null, 'type', null)

  // common logical predicates.
  // A boolean logical test operator.
  // - (x ?) returns true or false.
  // - (x ? y) returns y if x is evaluated to false.
  // - (x ? y z) return y if x is evaluated to true, z otherwise.
  virtual(Null, '?', function Null$boolTest (a, b) {
    return typeof a === 'undefined' ? false : typeof b === 'undefined' ? a : b
  })
  // null fallback.
  // (x ?? y) returns y if and only if x is null.
  virtual(Null, '??', function Null$nullFallback (alternative) {
    // for null, always returns the alternative value.
    if (arguments.length < 1) {
      return null
    }
    if (arguments.length === 1) {
      return typeof alternative === 'undefined' ? null : alternative
    }
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'undefined' && arg !== null) {
        return arg
      }
    }
    return null
  })
}
