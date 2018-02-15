'use strict'

module.exports = function encode ($void, JS) {
  var $ = $void.$
  var $export = $void.export
  var thisCall = $void.thisCall

  $export($, 'encode', function (value) {
    return thisCall(thisCall(value, 'to-code'), 'to-string')
  })
}
