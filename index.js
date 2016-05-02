'use strict'

// running as an application
if (require.main === module) {
  require('./lib/app')()
} else {
  // export assembled Sugly runtime.
  var loader = require('./lib/loader-fs')
  module.exports = require('./sugly')(loader)
}
