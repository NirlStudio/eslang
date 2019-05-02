'use strict'

module.exports = require.main === module
  ? require('./lib/app') // run as an app
  : require('./lib/void')// re-export runtime creator.
