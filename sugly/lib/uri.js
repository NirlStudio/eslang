'use strict'

var $export = require('../export')

module.exports = function ($, JS) {
  var uri = $export($, 'Uri', $.object())
  $export.copy(uri, JS, {
    'encodeURI': 'encode',
    'encodeURIComponent': 'escape',
    'decodeURI': 'decode',
    'decodeURIComponent': 'unescape'
  })
  return uri
}
