'use strict'

module.exports = function operators ($) {
  // export all operators
  $.$operators = {}
  require('./quote')($)
  require('./let')($)
  require('./object')($)
  require('./function')($)
  require('./type')($)
  require('./control')($)
  require('./pattern')($)
  require('./operator')($)
  require('./general')($)
  require('./arithmetic')($)
  require('./bitwise')($)
  require('./equivalence')($)
  require('./ordering')($)
  require('./logical')($)
}
