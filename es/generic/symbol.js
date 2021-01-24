'use strict'

module.exports = function symbolIn ($void) {
  var $ = $void.$
  var Type = $.symbol
  var $Tuple = $.tuple
  var $String = $.string
  var Symbol$ = $void.Symbol
  var link = $void.link
  var isSafeName = $void.isSafeName
  var isSafeSymbol = $void.isSafeSymbol
  var escapeSymbol = $void.escapeSymbol
  var protoValueOf = $void.protoValueOf

  var strComparesTo = $String.proto['compares-to']
  var strToString = $String.proto['to-string']

  // common symbol repository
  var sharedSymbols = $void.sharedSymbols
  var sharedSymbolOf = $void.sharedSymbolOf

  // the empty value.
  var empty = link(Type, 'empty', sharedSymbolOf(''))

  // a special symbol to indicate "etc." or "more" for parser and operator
  link(Type, 'etc', sharedSymbolOf('...'))

  // special symbols to indicate "all" and "any" for parsers and operators
  link(Type, 'all', sharedSymbolOf('*'))
  link(Type, 'any', sharedSymbolOf('?'))

  // symbols for common operators
  link(Type, 'quote', sharedSymbolOf('`'))

  link(Type, 'lambda', sharedSymbolOf('='))
  link(Type, 'stambda', sharedSymbolOf('->'))
  link(Type, 'function', sharedSymbolOf('=>'))
  link(Type, 'operator', sharedSymbolOf('=?'))

  link(Type, 'let', sharedSymbolOf('let'))
  link(Type, 'var', sharedSymbolOf('var'))
  link(Type, 'const', sharedSymbolOf('const'))
  link(Type, 'local', sharedSymbolOf('local'))
  link(Type, 'locon', sharedSymbolOf('locon'))

  // symbols for common punctuation
  link(Type, 'escape', sharedSymbolOf('\\'))
  link(Type, 'begin', sharedSymbolOf('('))
  link(Type, 'end', sharedSymbolOf(')'))
  link(Type, 'comma', sharedSymbolOf(','))
  // period is only special when it's immediately after a ')'.
  link(Type, 'period', sharedSymbolOf('.'))
  link(Type, 'semicolon', sharedSymbolOf(';'))
  link(Type, 'literal', sharedSymbolOf('@'))
  link(Type, 'pairing', sharedSymbolOf(':'))
  link(Type, 'subject', sharedSymbolOf('$'))
  link(Type, 'comment', sharedSymbolOf('#'))

  // create a symbol from a key.
  link(Type, 'of', function (key) {
    return typeof key === 'string'
      ? sharedSymbols[key] || new Symbol$(key)
      : key instanceof Symbol$ ? key : empty
  }, true)

  // create a shared symbol from a key.
  link(Type, 'of-shared', function (key) {
    return typeof key === 'string' ? sharedSymbolOf(key)
      : key instanceof Symbol$ ? sharedSymbolOf(key.key)
        : empty
  }, true)

  // to test if a string is a safe key or a symbol has a safe key.
  link(Type, 'is-safe', function (key, type) {
    return typeof key === 'string'
      ? type === Type ? isSafeSymbol(key) : isSafeName(key)
      : key instanceof Symbol$
        ? type === Type ? isSafeSymbol(key.key) : isSafeName(this.key)
        : false
  }, true)

  var proto = Type.proto
  link(proto, 'key', function () {
    return this.key
  })

  // test if this symbol has a safe key.
  link(proto, 'is-safe', function (type) {
    return type === Type ? isSafeSymbol(this.key) : isSafeName(this.key)
  })
  link(proto, 'is-unsafe', function (type) {
    return type === Type ? !isSafeSymbol(this.key) : !isSafeName(this.key)
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
  link(proto, 'compares-to', function (another) {
    return this === another ? 0
      : another instanceof Symbol$
        ? strComparesTo.call(this.key, another.key)
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
    switch (format) {
      case $String:
        // result can be either a literal symbol or string, like field name.
        return isSafeSymbol(this.key) ? this.key : strToString.call(this.key)
      case $Tuple:
        // make sure the result can be recover to a symbol.
        return !this.key ? '(`)'
          : isSafeSymbol(this.key) ? '(`' + this.key + ')'
            : '(symbol of ' + strToString.call(this.key) + ')'
      case Type:
        // result can be either a literal symbol or other literal value.
        return isSafeSymbol(this.key) ? this.key : escapeSymbol(this.key)
      default:
        return this.key
    }
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
