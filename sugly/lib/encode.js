'use strict'

module.exports = function encode ($void, JS) {
  var $ = $void.$
  var $export = $void.export
  var thisCall = $void.thisCall

  // TODO - refactoring of to-code mechanisim.
  $export($, 'encode', function (value) {
    var code = thisCall(value, 'to-code')
    return thisCall(code, 'to-string')
  })
}
