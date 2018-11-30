'use strict'

module.exports = function all ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var operator = $void.operator
  var sharedSymbolOf = $void.sharedSymbolOf

  // generic operators cannot be overridden in program. They are interpreted
  // directly in core evaluation function.
  $void.staticOperator = staticOperator

  // pseudo operater ':' is implemented in evaluation function.
  staticOperator(':', function () {
    return null
  })

  // generic operators
  require('./quote')($void)
  require('./app')($void)
  require('./assignment')($void)
  require('./control')($void)

  require('./general')($void)
  require('./logical')($void)
  require('./bitwise')($void)
  require('./arithmetic')($void)

  require('./object')($void)
  require('./function')($void)
  require('./operator')($void)

  require('./load')($void)
  require('./import')($void)
  require('./include')($void)

  function staticOperator (name, impl) {
    // make the symbol a pure symbol.
    $[name] = sharedSymbolOf(name)
    // export the implementation.
    $void.staticOperators[name] = operator(impl, $Tuple.operator)
    return impl
  }
}
