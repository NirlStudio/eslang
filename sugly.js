'use strict'

require('./lib/polyfill')

module.exports = function sugly (loader, output/*, more options */) {
  var start = require('./sugly/start')
  var $void = start(output)

  $void.dir = __dirname
  $void.load = loader($void.$)
  $void.initializeModuleSpace($void, true)
  return $void
}
