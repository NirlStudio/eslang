'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export
  var copyType = $void.copyType

  $export($, 'uri', copyType(new Object$(), JS, {
    'encodeURI': 'encode',
    'decodeURI': 'decode',
    'encodeURIComponent': 'escape',
    'decodeURIComponent': 'unescape'
  }))
}
