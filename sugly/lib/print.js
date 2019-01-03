'use strict'

module.exports = function ($void, JS, printer) {
  var $ = $void.$
  var warn = printer.warn
  var print = printer.print
  var $export = $void.export

  // standard output.
  var lastPrinting = null // save to make it testable.
  $export($, 'print', function (value) {
    if (typeof value === 'undefined') {
      return lastPrinting
    }
    lastPrinting = Array.prototype.slice.call(arguments)
    return print.apply(printer, arguments)
  })

  // standard error, but only warning exists in sugly space.
  var lastWarning = null // save to make it testable.
  $export($, 'warn', function (category) {
    if (typeof category === 'undefined') {
      return lastWarning
    }
    lastWarning = Array.prototype.slice.call(arguments)
    return typeof category !== 'string' || !category
      ? '' // taken as clearing last warning.
      : warn.apply(printer, arguments)
  })
}
