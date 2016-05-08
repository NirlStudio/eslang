'use strict'

module.exports = function operators ($) {
  // export all operators
  require('./operators/quote')($)
  require('./operators/let')($)
  require('./operators/object')($)
  require('./operators/function')($)
  require('./operators/type')($)
  require('./operators/control')($)
  require('./operators/pattern')($)
  require('./operators/operator')($)
  require('./operators/general')($)
  require('./operators/arithmetic')($)
  require('./operators/bitwise')($)
  require('./operators/equivalence')($)
  require('./operators/ordering')($)
  require('./operators/logical')($)
}
