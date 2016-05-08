'use strict'

var $export = require('./export')

module.exports = function ($) {
  var type = $export($, null, $export.copy('Math', Math))
  return type
}
