'use strict'

// file system module loader
var load = require('./loader-fs')()

// load Sugly runtime
var $ = require('./sugly')(load)

function runAsApp () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
  } else {
    for (var index = 2; index < proc.argv.length; index++) {
      var source = proc.argv[index]
      $.console.log($.run(source))
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
      $.console.log(signal.value)
      process.exit(0) // only halt signal will arrive here.
    }
    throw signal
  }
}
