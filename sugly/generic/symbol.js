'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.symbol
  var link = $void.link
  var Symbol$ = $void.Symbol
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var managedIndexer = $void.managedIndexer

  // common symbol repository
  var sharedSymbols = $void.sharedSymbols
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty symbol.
  link(Type, 'empty', sharedSymbolOf(''))

  // a sepcial empty symbol to indicate "etc." or "more" for parser and operator
  link($, '...', null)
  link(Type, 'etc', sharedSymbolOf('...'))

  // symbols for common operators
  link(Type, 'quote', sharedSymbolOf('`'))

  link(Type, 'lambda', sharedSymbolOf('='))
  link(Type, 'function', sharedSymbolOf('=>'))
  link(Type, 'operator', sharedSymbolOf('=?'))

  link(Type, 'let', sharedSymbolOf('let'))
  link(Type, 'var', sharedSymbolOf('var'))
  link(Type, 'export', sharedSymbolOf('export'))

  // symbols for common punctuations
  link(Type, 'object', sharedSymbolOf('@'))
  link(Type, 'pairing', sharedSymbolOf(':'))
  link(Type, 'comment', sharedSymbolOf('#'))

  // create a symbol from a key.
  link(Type, 'of', function (key) {
    return sharedSymbols[key] || new Symbol$(key)
  })

  // Indexer for the type.
  typeIndexer(Type)

  var proto = Type.proto

  // Identity and Equivalence is determined by the key
  link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || (
      this instanceof Symbol$ && another instanceof Symbol$ &&
      this.key.localeCompare(another.key))
  }, ['is-not', 'not-equals', '!='])

  // Ordering: to determine by the string value of key.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : this instanceof Symbol$ && another instanceof Symbol$
        ? this.key.localeCompare(another.key)
        : null
  })

  // Type Verification
  typeVerifier(Type)

  // Emptiness: The empty symbol's key is an empty string.
  link(proto, 'is-empty', function () {
    return this.key === ''
  }, 'not-empty', function () {
    return this.key !== ''
  })

  // Representation
  link(proto, 'to-string', function () {
    return this instanceof Symbol$ ? this.key : null
  })

  // add default implementation for missing methods.
  managedIndexer(Type, Symbol$, {
    key: 1 // public fields.
  })
}
