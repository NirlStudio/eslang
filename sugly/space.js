'use strict'

require('./polyfill')
var $export = require('./export')

var JS = global || window

function exportUriFunctions () {
  var Uri = {}
  Uri.identityName = '($"Uri")'

  $export.wrap(Uri, 'encode', JS, JS.encodeURI)
  $export.wrap(Uri, 'encodeComponent', JS, JS.encodeURIComponent)
  $export.wrap(Uri, 'decode', JS, JS.decodeURI)
  $export.wrap(Uri, 'decodeComponent', JS, JS.decodeURIComponent)

  return Uri
}

function $is_empty (obj) { // TODO - to be refined.
  if (typeof obj === 'undefined' || obj === null) {
    return true
  }
  if (typeof obj.length === 'number') {
    return obj.length < 1
  }
  if (typeof obj.size === 'number') {
    return obj.size < 1
  }
  if (typeof obj === 'object') {
    return Object.getOwnPropertyNames(obj).length < 1
  }
  return obj === 0 || obj === false
}

function initializeSpace ($) {
  $[''] = null
  $.null = null
  $.true = true
  $.false = false
  $.NaN = NaN
  $.Infinity = Infinity

  require('./generic/symbol')($)
  $export($, 'symbol', $.Symbol['value-of'])

  require('./generic/bool')($)
  $export($, 'bool', $.Bool['value-of'])

  require('./generic/number')($)
  $export($, 'number', $.Number['value-of'])

  require('./generic/int')($)
  $export($, 'int', $.Int['value-of'])

  require('./generic/float')($)
  $export($, 'float', $.Float['value-of'])

  require('./generic/string')($)
  $export($, 'string', $.String['value-of'])

  require('./generic/object')($)
  $export($, 'object', $.Object['create'])

  require('./generic/function')($)
  $export($, 'function', $.Function['create'])

  require('./generic/date')($)
  $export($, 'date', $.Date['create'])

  require('./generic/array')($)
  $export($, 'array', $.Array['create'])

  require('./resolve')($)

  $export($, 'range', require('./generic/range'))
  $export($, 'iterate', require('./generic/iterate'))
  $export($, 'is-empty', $is_empty)
  $export($, 'not-empty', function (obj) {
    return !$is_empty(obj)
  })

  $export($, 'Uri', exportUriFunctions())
  require('./math')($)
  require('./json')($)
}

module.exports = function (output) {
  var $ = $export.copy('$')
  $.$isSpace = Object.prototype.isPrototypeOf

  // meta information
  var sugly = $export($, 'Sugly', {})
  $export(sugly, 'runtime', 'js')
  $export(sugly, 'version', '0.0.1')
  $export(sugly, 'isDebugging', true)

  // import objects from JS environment
  initializeSpace($)

  // compile a piece of code to program/clauses: [[]].
  $export($, 'compile', function (code, src) {
    return require('./compiler')($)(code, src)
  })

  // encode function factory
  var encoder = $export($, 'encoder', require('./encoder'))

  // default encode function
  $export($, 'encode', encoder($, true))

  // default output function. depending on $.encode
  $export($, 'print', require('./print')($, output))

  // this is only used by runtime itself or its assembler
  $.$export = function (name, obj) {
    $export(this, name, obj)
  }

  // placeholder function of $load.
  // Since $load is expected to return a piece of code, it should always
  // return a piece of code.
  var load = $export($, 'load', function $load (file, cb) {
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

  return $
}
