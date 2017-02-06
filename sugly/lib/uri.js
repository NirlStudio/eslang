'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var object = $.object
  var constant = $void.constant
  var copyObject = $void.copyObject

  var uri = constant($, 'uri', object())
  copyObject(uri, JS, {
    'encodeURI': 'encode',
    'encodeURIComponent': 'escape',
    'decodeURI': 'decode',
    'decodeURIComponent': 'unescape'
  })
  return uri
}
