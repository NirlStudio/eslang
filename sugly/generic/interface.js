'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var Interface = $.Interface
  Interface.finalized = true

  $export($, 'iterator', Interface.create({
    next: $.Function, // required, it must be a function
    value: $.Null,    // required, it can be any type
    key: null        // optional
  }))

  $export($, 'iterable', Interface.create({
    iterate: $.Function // required, it must be a function
  }))

  $.descending = 1
  $.ascending = -1
  $.equal = 0
  $export($, 'comparable', Interface.create({
    compare: $.Function // required, it must be a function
  }))
}
