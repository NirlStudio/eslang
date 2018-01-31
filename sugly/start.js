'use strict'

var JS = global || window

function initializeSpace ($void) {
  require('./generic/void')($void)

  require('./generic/null')($void)
  require('./generic/type')($void)

  require('./generic/bool')($void)
  require('./generic/string')($void)
  require('./generic/number')($void)
  require('./generic/date')($void)
  require('./generic/range')($void)

  require('./generic/symbol')($void)
  require('./generic/tuple')($void)

  require('./generic/operator')($void)
  require('./generic/lambda')($void)
  require('./generic/function')($void)

  require('./generic/array')($void)
  require('./generic/object')($void)
  require('./generic/class')($void)

  require('./generic/global')($void)

  require('./generic/iterate')($void)

  require('./lib/encode')($void, JS)
  require('./lib/math')($void, JS)
  require('./lib/uri')($void, JS)
  require('./lib/json')($void, JS)
  require('./lib/timer')($void, JS)
  require('./lib/print')($void, JS)
}

function initializeRuntime ($void) {
  require('./runtime/runtime')($void)
  require('./runtime/signal')($void)
  require('./runtime/space')($void)
  require('./runtime/evaluate')($void)
  require('./runtime/signal-of')($void)
  require('./runtime/function')($void)
  require('./runtime/operator')($void)

  require('./runtime/execute')($void)

  require('./runtime/run')($void)
  require('./runtime/eval')($void)
  require('./runtime/interpreter')($void)
}

module.exports = function start () {
  // Hello, world.
  var $void = require('./generic/genesis')()

  // create generic type system
  initializeSpace($void)

  // prepare tokenizer & compiler
  require('./tokenizer')($void)
  require('./compiler')($void)

  // prepare runtime functions
  initializeRuntime($void)

  require('./operators/all')($void)
  return $void
}
