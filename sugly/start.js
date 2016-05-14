'use strict'

var JS = global || window
var $export = require('./export')

function createSpace () {
  // Hello, world.
  var $ = require('./generic/genesis')($)

  // meta information
  var sugly = $export($, 'Sugly', {})
  $export(sugly, 'runtime', 'js')
  $export(sugly, 'version', '0.2.0')
  $export(sugly, 'debugging', true)
  return $
}

function exportConstants ($) {
  $[''] = null
  $.null = null
  $.true = true
  $.false = false
  $.NaN = NaN
  $.Infinity = Infinity
}

function initializeSpace ($) {
  // populating
  require('./generic/null')($)

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

  require('./generic/range')($)
  $export($, 'range', $.Range['create'])

  require('./generic/iterate')($)

  require('./runtime/signal')($)
  require('./runtime/resolve')($)
  require('./runtime/assign')($)
  require('./runtime/set')($)
  require('./runtime/indexer')($)
  require('./runtime/eval')($)
  require('./runtime/function')($)

  require('./runtime/signal-of')($)
  require('./operators/all')($)

  require('./lib/math')($, JS)
  require('./lib/uri')($, JS)
  require('./lib/json')($, JS)
}

module.exports = function start (output) {
  var $ = createSpace()

  // export global constant values.
  exportConstants($)

  // create generic type system
  initializeSpace($)

  // compile a piece of code to program/clauses: [[]].
  $export($, 'compile', function (code, src) {
    return require('./compiler')($)(code, src)
  })

  // encode function factory
  var encoder = require('./lib/encoder')($, JS)
  // default encode function
  $export($, 'encode', encoder($, true))

  // default output function. depending on $.encode
  require('./lib/print')($, JS, output)

  // this is only used by runtime itself or its assembler
  $.$export = function (name, obj) {
    $export(this, name, obj)
  }

  require('./runtime/run')($)
  require('./runtime/space')($)
  require('./runtime/exec')($)

  return $
}
