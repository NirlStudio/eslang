'use strict'

// load Sugly runtime with local filesystem loader
var loader = require('./loader-fs')
var $ = require('../sugly')(loader)

function runSelfTest (args) {
  var checkPrerequisites = require('../test/test')
  if (!checkPrerequisites($)) {
    return
  }

  var test = $.require('test/test')
  var loadSpec = $.run('test/spec')
  loadSpec.apply(null, args)
  /* var report =*/ test()
}

function runTest (args) {
  // TODO
}

function runTools (tool, command) {
  // TODO
}

function run () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
  } else {
    var command = proc.argv[2]
    if (command === 'self-test') {
      return runSelfTest(proc.argv.slice(3))
    }

    if (command === 'test') {
      return runTest(proc.argv.slice(3))
    }

    if (runTools(command, proc.argv.slice(3))) {
      return
    }

    for (var index = 2; index < proc.argv.length; index++) {
      var result = $.run(proc.argv[index])
      if (result !== null) {
        $.print(result)
      }
    }
  }
}

module.exports = function () {
  try {
    run()
  } catch (signal) {
    if (signal instanceof $.$SuglySignal) {
      $.print(signal.value)
      process.exit(0) // only halt signal will arrive here.
    }
    throw signal
  }
}
