'use strict'

// load Sugly runtime with local filesystem loader
var loader = require('./loader-fs')
var $ = require('./sugly')(loader)

function runAsApp () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
  } else {
    for (var index = 2; index < proc.argv.length; index++) {
      var source = proc.argv[index]
      $.print($.run(source))
    }
  }
}

// export assembled Sugly runtime.
module.exports = $

// running as an application
if (require.main === module) {
  try {
    runAsApp()
  } catch (signal) {
    if (signal instanceof $.$SuglySignal) {
      $.print(signal.value)
      process.exit(0) // only halt signal will arrive here.
    }
    throw signal
  }
}
