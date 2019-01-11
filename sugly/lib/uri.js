'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var $Object = $.object
  var $export = $void.export
  var copyType = $void.copyType

  $export($, 'uri', copyType($Object.empty(), JS, {
    'encodeURI': 'encode',
    'decodeURI': 'decode',
    'encodeURIComponent': 'escape',
    'decodeURIComponent': 'unescape'
  }))
}
