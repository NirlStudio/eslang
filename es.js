'use strict'

module.exports = function espresso (stdout, loader) {
  // create the void.
  var start = require('./es/start')
  var $void = start(stdout)
  // mount native module loader
  $void.require = require('./lib/modules')($void)
  // create the source loader
  $void.loader = loader($void)
  // set the location of the runtime
  $void.runtime('home', __dirname)
  // now we got a complete runtime.
  return $void
}
