'use strict'

var $export = require('../export')
var $module = require('../generic/module')

module.exports = function ($, JS) {
  var json = $module($, 'Json')
  $export.copy(json, JS.JSON, {
    'stringify': 'of',
    'parse': 'parse'
  })
  return json
}
