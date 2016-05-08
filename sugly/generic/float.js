'use strict'

var $export = require('../export')

function valueOf () {
  return function Int$value_of (input) {
    if (typeof input === 'string') {
      return parseFloat(input)
    }
    if (typeof input === 'undefined' || input === null) {
      return 0
    }
    if (typeof input === 'number') {
      return input
    }
    return NaN
  }
}

module.exports = function ($) {
  var type = Object.create($.Number)
  $export($, 'Float', type)
  $export(type, 'value-of', valueOf())

  var pt = Object.create($.Number.$)
  $export(type, '$', pt)
  return type
}
