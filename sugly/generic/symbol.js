'use strict'

var $export = require('../export')

var SpecialSymbol = /^[\$\`\@\:]{1}$/
var InvalidSymbol = /[\(\)\$\`\'\@\:\"\#\\\s]/

function isSame (Symbol$) {
  return function symbol$is_same (another) {
    return this === another ||
      (this.key === another.key && this instanceof Symbol$ && another instanceof Symbol$)
  }
}

function notSame (Symbol$) {
  return function symbol$not_same (another) {
    return this !== another &&
      (this.key !== another.key || !(this instanceof Symbol$) || !(another instanceof Symbol$))
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Symbol$ = $void.Symbol

  // regex to test invalid symbol
  $void.InvalidSymbol = InvalidSymbol
  // common symbol repository
  var sharedSymbols = $void.SharedSymbols = Object.create(null)

  // Symbol is a value type derived from Null.
  var type = $.Symbol
  // const nothing object.
  var nothing = type.Nothing = sharedSymbols[''] = new Symbol$('')

  // check whether a string is a valid symbol key.
  var is_valid = $export(type, 'is-valid', function Symbol$is_valid (key) {
    return typeof key === 'string' && (SpecialSymbol.test(key) || !InvalidSymbol.test(key))
  })

  // a symbol can only be created from a valid symbol name (string).
  $export(type, 'value-of', function Symbol$value_of (key) {
    return !is_valid(key) ? nothing
      : typeof sharedSymbols[key] !== 'undefined'
        ? sharedSymbols[key] : (sharedSymbols[key] = new Symbol$(key))
  })

  // try to retrieve the key of a symbol.
  $export(type, 'key-of', function Symbol$key_of (sym) {
    return sym instanceof Symbol$ ? sym.key : ''
  })

  var proto = type.proto

  $export(proto, 'key', function symbol$key () {
    return this.key
  })

  // a symbol behaves as a value entity.
  $export(proto, 'is', isSame(Symbol$))
  $export(proto, 'is-not', notSame(Symbol$))
  $export(proto, 'equals', isSame(Symbol$))
  $export(proto, 'not-equals', notSame(Symbol$))

  // persistency & description
  $export(proto, 'to-code', function symbol$to_code () {
    return this instanceof Symbol$ ? this.key : ''
  })
  $export(proto, 'to-string', function symbol$to_string () {
    return this instanceof Symbol$ ? '(` ' + this.key + ')' : ''
  })

  // emptiness: nothing symbol is taken as the empty value.
  $export(proto, 'is-empty', function () {
    return this.key.length < 1
  })
  $export(proto, 'not-empty', function () {
    return this.key.length > 0
  })

  // indexer: general & primary predicate, readonly.
  $export(proto, ':', function (name) {
    return typeof name !== 'string' ? null
      : typeof proto[name] !== 'undefined' ? proto[name] : null
  })

  // overide general equivalence operators, being consistent with equals
  $export(proto, '==', isSame(Symbol$))
  $export(proto, '!=', notSame(Symbol$))
}
