'use strict'

var $export = require('../export')

function isNull () {
  return function Null$is_null (value) {
    return typeof value === 'undefined' || value === null
  }
}

function toCode () {
  return function Null$to_code () {
    return 'null'
  }
}

module.exports = function ($) {
  var type = $export($, 'Null')
  $export(type, 'is', isNull())
  $export(type, 'equals', isNull())
  $export(type, 'to-code', toCode())
  $export(type, 'to-string', toCode())
  return type
}
