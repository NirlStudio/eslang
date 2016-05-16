'use strict'

var $export = require('../export')

var SpecialSymbol = /^[\$\`\@\:]{1}$/
var InvalidSymbol = /[\(\)\$\`\'\@\:\"\#\\\s]/

function isValid () {
  return function Symbol$is_valid (key) {
    return typeof key === 'string' && (SpecialSymbol.test(key) || !InvalidSymbol.test(key))
  }
}

function isTypeOf ($) {
  var constructor = $.$SymbolConstructor
  return function Symbol$is_type_of (value) {
    return value instanceof constructor
  }
}

function valueOf ($) {
  var sharedSymbols = $.$SharedSymbols
  var Symbol$ = $.$SymbolConstructor
  var nothing = $.Symbol.Nothing
  var is_valid = $.Symbol['is-valid']
  return function Symbol$value_of (key) {
    if (is_valid(key)) {
      var sym = sharedSymbols[key]
      return sym ? sym : (sharedSymbols[key] = new Symbol$(key))
    }
    return nothing
  }
}

function keyOf ($) {
  var Symbol$ = $.$SymbolConstructor
  return function Symbol$key_of (sym) {
    return sym instanceof Symbol$ ? sym.key : ''
  }
}

function toCode ($) {
  var Symbol$ = $.$SymbolConstructor
  return function symbol$to_code () {
    return this instanceof Symbol$ ? this.key : ''
  }
}

function toString ($) {
  var Symbol$ = $.$SymbolConstructor
  return function symbol$to_string () {
    return this instanceof Symbol$ ? '(` ' + this.key + ')' : ''
  }
}

function isSame ($) {
  var Symbol$ = $.$SymbolConstructor
  return function symbol$is (another) {
    return this === another ||
      (this instanceof Symbol$ && another instanceof Symbol$ && this.key === another.key)
  }
}

function notSame ($) {
  var Symbol$ = $.$SymbolConstructor
  return function symbol$is_not (another) {
    return this !== another &&
      (!(this instanceof Symbol$) || !(another instanceof Symbol$) || this.key !== another.key)
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
  var proto = Symbol$.prototype = type.proto

  // const nothing object.
  type.Nothing = sharedSymbols[''] = new Symbol$('')

  // check whether a string is a valid symbol key.
  $export(type, 'is-valid', isValid())

  // check if an entity is a symbol.
  $export(type, 'is-type-of', isTypeOf($))

  // a symbol can only be created from a valid symbol name (string).
  $export(type, 'value-of', valueOf($))

  // try to retrieve the key of a symbol.
  $export(type, 'key-of', keyOf($))

  // a symbol behaves as a value entity.
  $export(proto, 'is', isSame($))
  // the general equivalence - placeholder
  $export(proto, 'equals', isSame($))

  // persistency & description
  $export(proto, 'to-code', toCode($))
  $export(proto, 'to-string', toString($))

  // emptiness: nothing symbol is taken as the empty value.
  $export(proto, 'is-empty', function () {
    return this.key.length < 1
  })
  $export(proto, 'not-empty', function () {
    return this.key.length > 0
  })

  // indexer: general & primary predicate, readonly.
  $export(proto, ':', function (name) {
    if (typeof name === 'string') {
      var value = proto[name]
      return typeof value !== 'undefined' ? value : null
    }
    return null
  })

  // overide general equivalence operators, being consistent with equals
  $export(proto, '==', isSame($))
  $export(proto, '!=', notSame($))
}
