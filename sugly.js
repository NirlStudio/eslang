'use strict'

require('./lib/polyfill')

module.exports = function sugly (stdout, loader) {
  // create the void.
  var start = require('./sugly/start')
  var $void = start(stdout)
  // create the source loader
  $void.loader = loader($void)
  // set the location of the runtime
  $void.runtime('home', __dirname)
  // now we got a complete runtime.
  return $void
}
