'use strict'

// load Sugly runtime with local filesystem loader
var loader = require('./loader-fs')
var $ = require('./sugly')(loader)

function test (args) {
  var runTest = $.require('test/test')
  var loadTest = $.run('test/load')
  loadTest(args.length > 0 ? args[0] : '')
  /* var report =*/ runTest()
}

function runAsApp () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
  } else {
    var command = proc.argv[2]
    if (command === 'test') {
      return test(proc.argv.slice(3))
    }

    for (var index = 2; index < proc.argv.length; index++) {
      var result = $.run(proc.argv[index])
      if (result !== null) {
        $.print(result)
      }
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
