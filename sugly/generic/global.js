'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $export = $void.export
  var sharedSymbolOf = $void.sharedSymbolOf

  // an empty symbol to be resolve to null.
  $export($, '', null)

  $export($, 'true', true)
  $export($, 'false', false)

  $export($, 'NaN', NaN)
  $export($, 'Infinity', Infinity)

  // Experimental: Pure Symbols
  $export($, '`', sharedSymbolOf('`'))
  $export($, '@', sharedSymbolOf('@'))
  $export($, ':', sharedSymbolOf(':'))
  $export($, '$', sharedSymbolOf('$'))
  $export($, '#', sharedSymbolOf('#'))

  $export($, 'in', sharedSymbolOf('in'))
  $export($, 'else', sharedSymbolOf('else'))
  $export($, 'super', sharedSymbolOf('super'))
}
