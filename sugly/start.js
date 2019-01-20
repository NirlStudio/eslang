'use strict'

function initializeSpace ($void) {
  require('./generic/void')($void)
  require('./generic/encoding')($void)

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

  require('./generic/iterator')($void)
  require('./generic/promise')($void)

  require('./generic/array')($void)
  require('./generic/object')($void)
  require('./generic/class')($void)

  require('./generic/global')($void)
}

function initializeLib ($void, stdout) {
  require('./lib/stdout')($void, stdout)
  require('./lib/format')($void)
  require('./lib/math')($void)
  require('./lib/uri')($void)
  require('./lib/json')($void)
  require('./lib/emitter')($void)
  require('./lib/timer')($void)
}

function initializeRuntime ($void) {
  require('./runtime/env')($void)
  require('./runtime/signal')($void)
  require('./runtime/space')($void)
  require('./runtime/evaluate')($void)
  require('./runtime/signal-of')($void)
  require('./runtime/function')($void)
  require('./runtime/operator')($void)

  require('./runtime/execute')($void)
  require('./runtime/eval')($void)

  require('./runtime/run')($void)
  require('./runtime/interpreter')($void)
}

function initializeOperators ($void) {
  require('./operators/pattern')($void)
  require('./operators/quote')($void)

  require('./operators/assignment')($void)
  require('./operators/control')($void)

  require('./operators/general')($void)
  require('./operators/logical')($void)
  require('./operators/bitwise')($void)
  require('./operators/arithmetic')($void)

  require('./operators/literal')($void)
  require('./operators/function')($void)
  require('./operators/operator')($void)

  require('./operators/load')($void)
  require('./operators/import')($void)
}

module.exports = function start (stdout) {
  // Hello, world.
  var $void = require('./generic/genesis')()

  // create generic type system
  initializeSpace($void)

  // prepare primary lib
  initializeLib($void, stdout($void))

  // prepare tokenizer & compiler
  require('./tokenizer')($void)
  require('./compiler')($void)

  // assemble runtime functions
  initializeRuntime($void)

  // assemble & publish operators
  initializeOperators($void)

  return $void
}
