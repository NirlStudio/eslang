'use strict'

// running as an application
if (require.main === module) {
  require('./lib/app')()
} else {
  // export assembled Sugly runtime.
  var stdout = require('./lib/stdout')
  var fileLoader = require('./lib/loader-fs')
  module.exports = require('./sugly')(stdout, fileLoader)
}
