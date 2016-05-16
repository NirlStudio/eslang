'use strict'

module.exports = function operators ($void) {
  // export all operators
  $void.operators = {}
  require('./quote')($void)
  require('./assignment')($void)
  require('./object')($void)
  require('./function')($void)
  require('./type')($void)
  require('./control')($void)
  require('./pattern')($void)
  require('./operator')($void)
  require('./general')($void)
  require('./arithmetic')($void)
  require('./bitwise')($void)
  require('./logical')($void)
}
