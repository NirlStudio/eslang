'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.symbol
  var link = $void.link
  var Symbol$ = $void.Symbol

  // common symbol repository
  var sharedSymbols = $void.sharedSymbols
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty symbol.
  link(Type, 'empty', sharedSymbolOf(''))

  // a sepcial empty symbol to indicate "etc." or "more" for parser and operator
  link(Type, 'etc', sharedSymbolOf('...'))

  // a sepcial empty symbol to indicate "all" or "any" for parser and operator
  link(Type, 'all', sharedSymbolOf('*'))

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

  // create a shared symbol from a key.
  link(Type, 'of-shared', sharedSymbolOf)

  var proto = Type.proto

  // Identity and Equivalence is determined by the key
  link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || (
      another instanceof Symbol$ && this.key === another.key
    )
  })
  link(proto, ['is-not', 'not-equals', '!='], function (another) {
    return this !== another && (
      !(another instanceof Symbol$) || this.key !== another.key
    )
  })

  // Ordering: to determine by the string value of key.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : another instanceof Symbol$ && this.key === another.key
        ? 0 : null
  })

  // Emptiness: The empty symbol's key is an empty string.
  link(proto, 'is-empty', function () {
    return this.key === ''
  })
  link(proto, 'not-empty', function () {
    return this.key !== ''
  })

  // Representation
  link(proto, 'to-string', function () {
    return this.key
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? this[index]
      : index instanceof Symbol$ ? this[index.key] : null
  })

  // export type indexer.
  link(Type, 'indexer', indexer)
}
