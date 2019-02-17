'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $export = $void.export
  var sharedSymbolOf = $void.sharedSymbolOf

  // an empty symbol to be resolve to null.
  $export($, '', null)

  // special empty symbols
  $export($, '*', null)
  $export($, '...', null)

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
  $export($, 'in', sharedSymbolOf('in'))
  $export($, 'else', sharedSymbolOf('else'))

  // global enum value.
  $export($, sharedSymbolOf('descending').key, 1)
  $export($, sharedSymbolOf('equivalent').key, 0)
  $export($, sharedSymbolOf('ascending').key, -1)

  // ensure type name symbols are shared.
  var typeNames = [
    'type',
    'bool', 'string', 'number', 'date', 'range',
    'symbol', 'tuple',
    'operator', 'lambda', 'function',
    'array', 'iterator', 'object', 'class'
  ]
  for (var i = 0; i < typeNames.length; i++) {
    sharedSymbolOf(typeNames[i])
  }
}
