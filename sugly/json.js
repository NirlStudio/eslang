'use strict'

var $export = require('./export')

module.exports = function ($, JS) {
  var json = $export($, null, $export.copy('Json', JS.JSON, {
    'stringify': 'of',
    'parse': 'parse'
  }))
  return json
}
