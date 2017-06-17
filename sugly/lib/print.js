'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var $export = $void.export
  var thisCall = $void.thisCall

  $export($, 'print', function () {
    console.log.apply(console, toStrings.apply(null, arguments))
  })

  $export($, 'warn', function () {
    console.log.apply(console, toStrings.apply(null, arguments))
  })

  function toStrings () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i]
      if (typeof value === 'string') {
        strings.push(value)
      } else {
        strings.push(thisCall(value, 'to-string'))
      }
    }
    return strings
  }
}
