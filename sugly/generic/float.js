'use strict'

var $export = require('../export')

function valueOf () {
  return function Float$value_of (input) {
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

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Float

  // override to only accept string, null and number itself.
  $export(type, 'value-of', valueOf())

  // super type is fixed to Number
  $export(type, 'super', function Float$super () {
    return $.Number
  })

  var proto = type.proto

  // define a float value's type attributes
  $export(proto, 'get-type', function float$get_type () {
    return type
  })
  $export(proto, 'is-instance-of', function float$is_instance_of (float) {
    return type === float || float === $.Number
  })

  // override indexer to expose functions
  $export(proto, ':', function float$indexer (name) {
    if (typeof name === 'string') {
      var value = proto[name]
      return typeof value !== 'undefined' ? value : null
    }
    return null
  })
}
