'use strict'

require('./lib/polyfill')

module.exports = function sugly (loader, output/*, more options */) {
  var start = require('./sugly/start')
  var $ = start(output)
  $.$load = loader($)
  $.$initializeModuleSpace($, true)
  return $
}
