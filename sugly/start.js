'use strict'

var JS = global || window
var $export = require('./export')

function exportConstants ($) {
  $[''] = null
  $.true = true
  $.false = false
  $.NaN = NaN
  $.Infinity = Infinity
}

function initializeSpace ($void) {
  // populating
  require('./generic/null')($void)
  require('./generic/type')($void)

  var $ = $void.$
  require('./generic/symbol')($void)
  $export($, 'symbol', $.Symbol['value-of'])

  require('./generic/bool')($void)
  $export($, 'bool', $.Bool['value-of'])

  require('./generic/number')($void)
  $export($, 'number', $.Number['value-of'])

  require('./generic/int')($void)
  $export($, 'int', $.Int['value-of'])

  require('./generic/float')($void)
  $export($, 'float', $.Float['value-of'])

  require('./generic/string')($void)
  $export($, 'string', $.String['value-of'])

  require('./generic/function')($void)
  $export($, 'call', $.Function['call'])
  $export($, 'apply', $.Function['apply'])

  require('./generic/class')($void)
  $export($, 'object', $.Class['create'])
  $export($, 'class', $.Class['new'])

  require('./generic/interface')($void)
  $export($, 'interface', $.Interface['create'])

  require('./generic/date')($void)
  $export($, 'date', $.Date['create'])

  require('./generic/array')($void)
  $export($, 'array', $.Array['create'])

  require('./generic/range')($void)
  $export($, 'range', $.Range['create'])

  require('./generic/iterate')($void)

  require('./lib/math')($, JS)
  require('./lib/uri')($, JS)
  require('./lib/json')($, JS)
}

function initializeRuntime ($void) {
  require('./runtime/signal')($void)
  require('./runtime/assign')($void)
  require('./runtime/resolve')($void)
  require('./runtime/evaluate')($void)
  require('./runtime/function')($void)
  require('./runtime/signal-of')($void)
}

module.exports = function start (output) {
  // Hello, world.
  var $void = require('./generic/genesis')()
  var $ = $void.$

  // export global constant values.
  exportConstants($)

  // create generic type system
  initializeSpace($void)

  // prepare runtime functions
  initializeRuntime($void)

  require('./operators/all')($void)

  // encode function factory
  var encoder = require('./lib/encoder')($void, JS)
  // default encode function
  $export($, 'encode', encoder(true))

  // default output function. depending on $.encode
  require('./lib/print')($, JS, output)

  // prepare tokenizer & compiler
  require('./tokenizer')($void)
  require('./compiler')($void)

  // compile a piece of code to program/clauses: [[]].
  $export($, 'compile', function (code, src) {
    return $void.compiler()(code, src)
  })

  // this is only used by runtime itself or its assembler
  $void.export = function (name, obj) {
    $export(this, name, obj)
  }

  // program executor generators
  require('./runtime/run')($void)
  // space/module manipulation functions.
  require('./runtime/space')($void)
  // real program executors
  require('./runtime/execute')($void)
  // export function executors as global functions
  $export($, 'execute', $.Function['execute'])

  require('./runtime/meta')($void)
  return $void
}
