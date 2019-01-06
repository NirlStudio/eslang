'use strict'

module.exports = function ($void, JS, printer) {
  var warn = printer.warn
  var print = printer.print
  var $export = $void.export

  // standard output.
  var lastPrinting = null // save to make it testable.
  $export($void, '$print', function (value) {
    if (typeof value === 'undefined') {
      return lastPrinting
    }
    lastPrinting = Array.prototype.slice.call(arguments)
    return print.apply(printer, arguments)
  })

  // standard error, but only warning exists in sugly space.
  var lastWarning = null // save to make it testable.

  function generateWarningId () {
    var ts = Date.now()
    return !lastWarning || ts !== lastWarning[1][0] ? [ts, 0]
      : [ts, lastWarning[1][1] + 1]
  }

  $export($void, '$warn', function (category) {
    if (typeof category === 'undefined') {
      return lastWarning
    }

    if (typeof category !== 'string' && category !== null) {
      lastWarning = [category = 'warn', generateWarningId(),
        'category should be a string.', category
      ]
    } else if (category) { // clear warning
      lastWarning = [category, generateWarningId()]
        .concat(Array.prototype.slice.call(arguments, 1))
    } else {
      return (lastWarning = ['', generateWarningId()])
    }
    warn.apply(printer, lastWarning)
    return lastWarning
  })
}
