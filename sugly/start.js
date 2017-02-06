'use strict'

var JS = global || window

function exportConstants ($void) {
  var $ = $void.$
  $void.constant($, '', null)
  $void.constant($, 'true', true)
  $void.constant($, 'false', false)
  $void.constant($, 'NaN', NaN)
  $void.constant($, 'Infinity', Infinity)
}

function initializeSpace ($void) {
  // populating
  require('./generic/null')($void)
  require('./generic/type')($void)

  var $ = $void.$
  var constant = $void.constant

  require('./generic/symbol')($void)
  constant($, 'symbol', $.Symbol['value-of'])

  require('./generic/bool')($void)
  constant($, 'bool', $.Bool['value-of'])

  require('./generic/number')($void)
  constant($, 'number', $.Number['value-of'])

  require('./generic/int')($void)
  constant($, 'int', $.Int['value-of'])

  require('./generic/float')($void)
  constant($, 'float', $.Float['value-of'])

  require('./generic/date')($void)
  constant($, 'date', $.Date['value-of'])

  require('./generic/string')($void)
  constant($, 'string', $.String['value-of'])

  require('./generic/function')($void)
  constant($, 'call', $.Function['call'])
  constant($, 'apply', $.Function['apply'])

  require('./generic/object')($void)
  constant($, 'object', $.Object['create'])

  require('./generic/array')($void)
  constant($, 'array', $.Array['create'])

  require('./generic/range')($void)
  constant($, 'range', $.Range['create'])

  require('./generic/enum')($void)
  constant($, 'enum', $.Enum['define'])

  require('./generic/flags')($void)
  constant($, 'flags', $.Flags['define'])

  require('./generic/interface')($void)
  constant($, 'interface', $.Interface['create'])

  require('./generic/class')($void)
  constant($, 'class', $.Class['define'])

  // iterate all field names and values
  require('./generic/object-iterator')($void)
  // iterate all offsets and values
  require('./generic/array-iterator')($void)
  // iterate all values in the range
  require('./generic/range-iterator')($void)
  require('./generic/iterate')($void)

  require('./lib/math')($void, JS)
  require('./lib/uri')($void, JS)
  require('./lib/json')($void, JS)
}

function initializeRuntime ($void) {
  require('./runtime/signal')($void)
  require('./runtime/indexer')($void)
  require('./runtime/assign')($void)
  require('./runtime/resolve')($void)
  require('./runtime/evaluate')($void)
  require('./runtime/function')($void)
  require('./runtime/signal-of')($void)
}

module.exports = function start () {
  // Hello, world.
  var $void = require('./generic/genesis')()
  var $ = $void.$
  var constant = $void.constant

  // export global constant values.
  exportConstants($void)

  // create generic type system
  require('./coding')($void)
  initializeSpace($void)

  // prepare runtime functions
  initializeRuntime($void)

  require('./operators/all')($void)

  // encode a value or an array to a piece of program
  require('./lib/encode')($void, JS)
  // default output function. depending on $.encode
  require('./lib/print')($void, JS)

  // prepare tokenizer & compiler
  require('./tokenizer')($void)
  require('./compiler')($void)

  // compile a piece of code to program/clauses: [[]].
  constant($, 'compile', function (code, src) {
    return $void.compiler()(code, src)
  })

  // program executor generators
  require('./runtime/run')($void)
  // space/module manipulation functions.
  require('./runtime/space')($void)
  // real program executors
  require('./runtime/execute')($void)
  // export function executors as global functions
  constant($, 'execute', $.Function['execute'])

  require('./runtime/meta')($void)
  return $void
}
