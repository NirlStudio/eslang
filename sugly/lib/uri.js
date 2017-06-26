'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export
  var copyType = $void.copyType

  var uri = $export($, 'uri', new Object$({
    'is-readonly': true
  }))
  copyType(uri, JS, {
    'encodeURI': 'encode',
    'decodeURI': 'decode',
    'encodeURIComponent': 'escape',
    'decodeURIComponent': 'unescape'
  })
}
