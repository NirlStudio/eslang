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
    proc.argv.forEach(function (source, index, array) {
      if (index > 1) {
        $.console.log($.run(source))
      }
    })
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
