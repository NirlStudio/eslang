'use strict'

require('./lib/polyfill')

module.exports = function sugly (output, loader/*, more options */) {
  // create the void.
  var start = require('./sugly/start')
  var $void = start(output)
  // create the source loader
  $void.loader = loader($void.$)
  // set the location of the runtime
  $void.runtime('home', __dirname)
  // now we got a complete runtime.
  return $void
}
