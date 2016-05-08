'use strict'

var $export = require('./export')

module.exports = function ($) {
  // placeholder function of $load.
  var load = $export($, '$load', function $load (file, cb) {
    $.print.warn({
      from: '$/sugly/space',
      message: 'An implementation of $load should be assembled to sugly.'
    })
    return typeof cb === 'function' ? cb('()') : '()'
  })
  $export(load, 'resolve', function $load$resolve (source) {
    return ''
  })
  $export(load, 'dir', function $load$dir (file) {
    return ''
  })
  return load
}
