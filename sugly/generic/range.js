'use strict'

var $export = require('../export')

module.exports = function ($) {
  var type = $.Range
  type.derive = null // prevent further inheritence

  var create = type.create
  $export(type, 'create', function (begin, end, step) {
    if (typeof begin !== 'number') {
      begin = 0
    }
    if (typeof end !== 'number') {
      end = begin
      begin = 0
    }
    if (typeof step !== 'number' || step === 0) {
      step = end >= begin ? 1 : -1
    }
    return create.call(type, {
      begin: begin,
      end: end,
      step: step
    })
  })

  var class_ = type.class
  class_.begin = 0
  class_.end = 0
  class_.step = 1

  require('./range-iterator')($)
  return type
}
