'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.symbol
  var $String = $.string
  var Symbol$ = $void.Symbol
  var link = $void.link
  var isSafeSymbol = $void.isSafeSymbol
  var protoValueOf = $void.protoValueOf
  var strCompare = $.string.proto.compare
  var strToString = $.string.proto['to-string']

  // common symbol repository
  var sharedSymbols = $void.sharedSymbols
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty value.
  var empty = link(Type, 'empty', sharedSymbolOf(''))

  // the invalid value.
  var invalid = link(Type, 'invalid', sharedSymbolOf('\t'))

  // a sepcial symbol to indicate "etc." or "more" for parser and operator
  link(Type, 'etc', sharedSymbolOf('...'))

  // a sepcial symbol to indicate "all" or "any" for parser and operator
  link(Type, ['all', 'any'], sharedSymbolOf('*'))

  // symbols for common operators
  link(Type, 'quote', sharedSymbolOf('`'))

  link(Type, 'lambda', sharedSymbolOf('='))
  link(Type, 'function', sharedSymbolOf('=>'))
  link(Type, 'operator', sharedSymbolOf('=?'))

  link(Type, 'let', sharedSymbolOf('let'))
  link(Type, 'var', sharedSymbolOf('var'))
  link(Type, 'local', sharedSymbolOf('local'))

  // symbols for common punctuations
  link(Type, 'begin', sharedSymbolOf('('))
  link(Type, 'end', sharedSymbolOf(')'))
  link(Type, 'comma', sharedSymbolOf(','))
  link(Type, 'semicolon', sharedSymbolOf(';'))
  link(Type, 'period', sharedSymbolOf('.'))
  link(Type, 'literal', sharedSymbolOf('@'))
  link(Type, 'pairing', sharedSymbolOf(':'))
  link(Type, 'subject', sharedSymbolOf('$'))
  link(Type, 'comment', sharedSymbolOf('#'))

  // create a symbol from a key.
  link(Type, 'of', function (key) {
    return typeof key !== 'string'
      ? key instanceof Symbol$ ? key
        : typeof key === 'undefined' || key === null ? empty : invalid
      : /\s/g.test(key) ? /\S/g.test(key) ? invalid : empty
        : sharedSymbols[key] || new Symbol$(key)
  }, true)

  // create a shared symbol from a key.
  link(Type, 'of-shared', function (key) {
    return typeof key !== 'string' ? invalid
      : /\s/g.test(key) || !key ? invalid
        : sharedSymbols[key] || (sharedSymbols[key] = new Symbol$(key))
  }, true)

  // to test if a string is a valid symbol key.
  link(Type, 'is-valid', function (key) {
    return typeof key === 'string' && key !== '\t'
  }, true)

  var proto = Type.proto
  link(proto, 'key', function () {
    return this.key
  })

  // test if this is a valid symbol.
  link(proto, 'is-valid', function () {
    return this.key !== '\t'
  })
  link(proto, 'is-invalid', function () {
    return this.key === '\t'
  })

  // Identity and Equivalence is determined by the key
  link(proto, ['is', '===', 'equals', '=='], function (another) {
    return this === another || (
      another instanceof Symbol$ && this.key === another.key
    )
  })
  link(proto, ['is-not', '!==', 'not-equals', '!='], function (another) {
    return this !== another && (
      !(another instanceof Symbol$) || this.key !== another.key
    )
  })

  // Ordering: to determine by the string value of key.
  link(proto, 'compare', function (another) {
    return this === another ? 0
      : another instanceof Symbol$
        ? strCompare.call(this.key, another.key)
        : null
  })

  // Emptiness: The empty symbol's key is an empty string.
  link(proto, 'is-empty', function () {
    return this.key === '' || this.key === '\t'
  })
  link(proto, 'not-empty', function () {
    return this.key !== '' && this.key !== '\t'
  })

  // Representation
  link(proto, 'to-string', function (format) {
    return format !== Type
      ? format !== $String ? this.key
        : isSafeSymbol(this.key) ? this.key
          : strToString.call(this.key)
      : this.key === '\t' ? '(symbol invalid)'
        : !this.key ? '(`)'
          : isSafeSymbol(this.key) ? '(`' + this.key + ')'
            : '(symbol of ' + strToString.call(this.key) + ')'
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
