'use strict'

var $export = require('../export')

module.exports = function ($, JS) {
  var json = $export($, 'json', $.object())
  $export.copy(json, JS.JSON, {
    'stringify': 'of',
    'parse': 'parse'
  })
  return json
}
