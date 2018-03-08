'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var $export = $void.export
  var thisCall = $void.thisCall

  // standard output.
  $export($, 'print', function () {
    var text = toStrings.apply(null, arguments)
    console.log(text)
    return text
  })

  // standard error, but no error in sugly.
  $export($, 'warn', function () {
    var text = toStrings.apply(null, arguments)
    console.warn(text)
    return text
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
    return strings.join(' ')
  }
}
