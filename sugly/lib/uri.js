'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var object = $.object
  var $export = $void.export
  var copyObject = $void.copyObject

  var uri = $export($, 'uri', object.of({
    'is-readonly': true
  }))
  copyObject(uri, JS, {
    'encodeURI': 'encode',
    'decodeURI': 'decode',
    'encodeURIComponent': 'escape',
    'decodeURIComponent': 'unescape'
  })
}
