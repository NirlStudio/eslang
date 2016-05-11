'use strict'

var $export = require('../export')
var $module = require('../generic/module')

module.exports = function ($, JS) {
  var uri = $module($, 'Uri')
  $export.copy(uri, JS, {
    'encodeURI': 'encode',
    'encodeURIComponent': 'escape',
    'decodeURI': 'decode',
    'decodeURIComponent': 'unescape'
  })
  return uri
}
