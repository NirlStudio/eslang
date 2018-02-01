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

  // special empty symbols
  $export($, '*', null) // as a common placeholder for null or empty statement.

  // Experimental: Pure Symbols
  $export($, 'in', sharedSymbolOf('in'))
  $export($, 'else', sharedSymbolOf('else'))
}
