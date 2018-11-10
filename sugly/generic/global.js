'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $export = $void.export
  var sharedSymbolOf = $void.sharedSymbolOf

  // an empty symbol to be resolve to null.
  $export($, '', null)

  // an invalid symbol to be resolve to null.
  $export($, '\t', null)

  // special empty symbols
  $export($, '*', null)
  $export($, '...', null)

  // constant values
  $export($, 'null', null)
  $export($, 'true', true)
  $export($, 'false', false)

  // punctuations pure Symbols
  $export($, '(', sharedSymbolOf('('))
  $export($, ')', sharedSymbolOf(')'))
  $export($, ',', sharedSymbolOf(','))
  $export($, ';', sharedSymbolOf(';'))
  $export($, '.', sharedSymbolOf('.'))
  $export($, '@', sharedSymbolOf('@'))
  $export($, ':', sharedSymbolOf(':'))
  $export($, '#', sharedSymbolOf('#'))

  // other pure symbols
  $export($, 'in', sharedSymbolOf('in'))
  $export($, 'else', sharedSymbolOf('else'))

  // global common variables.
  $export($, sharedSymbolOf('descending').key, 1)
  $export($, sharedSymbolOf('equivalent').key, 0)
  $export($, sharedSymbolOf('ascending').key, -1)
}
