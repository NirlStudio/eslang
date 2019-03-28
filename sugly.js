'use strict'

require('./lib/polyfill')

module.exports = function sugly (stdout, loader) {
  // create the void.
  var start = require('./sugly/start')
  var $void = start(stdout)
  // mount native module loader
  $void.require = require('./modules')
  // create the source loader
  $void.loader = loader($void)
  // set the location of the runtime
  $void.runtime('home',
    typeof window === 'undefined' ? __dirname
      : window.SUGLY_HOME || window.location.origin
  )
  // now we got a complete runtime.
  return $void
}
