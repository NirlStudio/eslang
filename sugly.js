'use strict'

require('./lib/polyfill')

module.exports = function sugly (loader/*, more options */) {
  var start = require('./sugly/start')
  var $void = start()

  $void.dir = __dirname
  $void.load = loader($void.$)
  $void.initializeModuleSpace($void, true)
  return $void
}
