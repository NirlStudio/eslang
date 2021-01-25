'use strict'

module.exports = function globalIn ($void) {
  var $ = $void.$
  var $export = $void.export
  var sharedSymbolOf = $void.sharedSymbolOf

  // an empty symbol to be resolve to null.
  $export($, '', null)

  // special empty symbols
  $export($, '...', null)
  // a readable alias of '...'
  $export($, 'etc', null)

  // constant values
  $export($, 'null', null)
  $export($, 'true', true)
  $export($, 'false', false)

  // punctuation pure Symbols
  $export($, '\\', sharedSymbolOf('\\'))
  $export($, '(', sharedSymbolOf('('))
  $export($, ')', sharedSymbolOf(')'))
  $export($, ',', sharedSymbolOf(','))
  $export($, ';', sharedSymbolOf(';'))
  $export($, '.', sharedSymbolOf('.'))
  $export($, '@', sharedSymbolOf('@'))
  $export($, ':', sharedSymbolOf(':'))
  $export($, '$', sharedSymbolOf('$'))
  $export($, '#', sharedSymbolOf('#'))
  $export($, '[', sharedSymbolOf('['))
  $export($, ']', sharedSymbolOf(']'))
  $export($, '{', sharedSymbolOf('{'))
  $export($, '}', sharedSymbolOf('}'))

  // other pure symbols
  $export($, 'else', sharedSymbolOf('else'))

  // global enum value.
  $export($, sharedSymbolOf('descending').key, 1)
  $export($, sharedSymbolOf('equivalent').key, 0)
  $export($, sharedSymbolOf('ascending').key, -1)
}
