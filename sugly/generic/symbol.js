'use strict'

var SpecialSymbol = /^[$`@:]{1}$/
var InvalidSymbol = /[$`@:()'"#,;\\\s]/

function isSame (Symbol$) {
  return function symbol$isSame (another) {
    return this === another ||
      (this.key === another.key && this instanceof Symbol$ && another instanceof Symbol$)
  }
}

function notSame (Symbol$) {
  return function symbol$notSame (another) {
    return this !== another &&
      (this.key !== another.key || !(this instanceof Symbol$) || !(another instanceof Symbol$))
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Symbol$ = $void.Symbol
  var readonly = $void.readonly

  // regex to test invalid symbol
  $void.InvalidSymbol = InvalidSymbol
  // common symbol repository
  var sharedSymbols = $void.SharedSymbols = Object.create(null)

  // Symbol is a value type derived from Null.
  var type = $.Symbol
  // const nothing object.
  var nothing = type.Nothing = sharedSymbols[''] = new Symbol$('')

  // check whether a string is a valid symbol key.
  var isValid = readonly(type, 'is-valid', function Symbol$isValid (key) {
    return typeof key === 'string' && (SpecialSymbol.test(key) || !InvalidSymbol.test(key))
  })

  // a symbol can only be created from a valid symbol name (string).
  readonly(type, 'value-of', function Symbol$valueOf (key) {
    return !isValid(key) ? nothing
      : typeof sharedSymbols[key] !== 'undefined'
        ? sharedSymbols[key] : (sharedSymbols[key] = new Symbol$(key))
  })

  var proto = type.proto

  readonly(proto, 'key', function symbol$key () {
    return this.key
  })

  // a symbol behaves as a value entity.
  readonly(proto, 'is', isSame(Symbol$))
  readonly(proto, 'is-not', notSame(Symbol$))

  readonly(proto, 'equals', isSame(Symbol$))
  readonly(proto, 'not-equals', notSame(Symbol$))
  readonly(proto, '==', isSame(Symbol$))
  readonly(proto, '!=', notSame(Symbol$))

  // persistency & description
  readonly(proto, 'to-code', function symbol$toCode () {
    return this instanceof Symbol$ ? this.key : ''
  })
  readonly(proto, 'to-string', function symbol$toString () {
    return this instanceof Symbol$ ? '(` ' + this.key + ')' : ''
  })

  // emptiness: nothing symbol is taken as the empty value.
  readonly(proto, 'is-empty', function () {
    return this.key.length < 1
  })
  readonly(proto, 'not-empty', function () {
    return this.key.length > 0
  })

  // indexer: general & primary predicate, readonly.
  readonly(proto, ':', function (name) {
    return typeof name !== 'string' ? null
      : typeof proto[name] !== 'undefined' ? proto[name] : null
  })

  // override to boost - an object is always true
  readonly(proto, '?', function object$boolTest (a, b) {
    return typeof a === 'undefined' ? true : a
  })
}
