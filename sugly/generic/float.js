'use strict'

var $export = require('../export')

function valueOf () {
  return function Int$value_of (input) {
    if (typeof input === 'string') {
      var value = parseFloat(input)
      return isNaN(value) ? 0.0 : value
    }
    if (typeof input === 'undefined' || input === null) {
      return 0.0
    }
    return typeof input === 'number' ? input : 0.0
  }
}

module.exports = function ($) {
  var type = $.Float
  // override to only accept string, null and number itself.
  $export(type, 'value-of', valueOf())

  var class_ = type.class
  // indexer: general & primary predicate, readonly.
  $export(class_, ':', function (name) {
    if (typeof name === 'string') {
      var value = class_[name]
      return typeof value !== 'undefined' ? value : null
    }
    return null
  })

  // support common math operations
  $export(class_, 'ceil', function () {
    return Math.ceil(this)
  })
  $export(class_, 'floor', function () {
    return Math.floor(this)
  })
  $export(class_, 'round', function () {
    return Math.round(this)
  })
}
