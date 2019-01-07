'use strict'

module.exports = function ($void, JS, printer) {
  var log = printer.log
  var warn = printer.warn
  var debug = printer.debug
  var print = printer.print
  var $export = $void.export

  // standard output.
  $export($void, '$print', function (value) {
    return print.apply(printer, arguments)
  })

  $export($void, '$log', function (category) {
    log.apply(printer, arguments)
    return arguments.length > 0 ? arguments[arguments.length - 1] : null
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

  $export($void, '$debug', function () {
    // TODO: mod:ts:...
    debug.apply(printer, arguments)
    return arguments.length > 0 ? arguments[arguments.length - 1] : null
  })
}
