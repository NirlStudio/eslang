'use strict'

var $export = require('./export')

module.exports = function set ($void) {
  var $ = $void.$
  $export($, 'Sugly', $.object({
    'runtime': 'js',
    'version': '0.2.0',
    'debugging': true
  }))
}
