'use strict'

var $export = require('../export')

module.exports = function ($) {
  var type = $export($, 'Float', $.Number)
  return type
}
