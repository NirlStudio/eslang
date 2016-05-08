'use strict'

var $export = require('./export')

module.exports = function ($) {
  var type = $export($, null, $export.copy('Json', JSON, {
    'stringify': 'of',
    'parse': 'parse'
  }))
  return type
}
