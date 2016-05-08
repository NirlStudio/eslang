'use strict'

var $export = require('./export')

module.exports = function ($, JS) {
  var uri = $export($, null, $export.copy('Uri', JS, {
    'encodeURI': 'encode',
    'encodeURIComponent': 'escape',
    'decodeURI': 'decode',
    'decodeURIComponent': 'unescape'
  }))
  return uri
}
