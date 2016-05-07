'use strict'

var $export = require('../export')

module.exports = function ($) {
  var type = $export($, 'Int', $.Number)
  return type
}
