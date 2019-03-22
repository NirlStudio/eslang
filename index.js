'use strict'

if (require.main === module) {
  // running as an application
  module.exports = require('./lib/app')()
} else {
  // export assembled Sugly runtime.
  module.exports = require('./sugly')(
    require('./lib/stdout'),
    require('./lib/loader')
  )
}
