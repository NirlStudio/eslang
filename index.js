'use strict'

// running as an application
if (require.main === module) {
  module.exports = require('./lib/app')()
} else {
  // export assembled Sugly runtime.
  module.exports = require('./sugly')(
    require('./lib/stdout'),
    require('./lib/loader')
  )
}
