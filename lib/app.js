'use strict'

// load Sugly runtime with local filesystem loader
var loader = require('./loader-fs')
var $ = require('../sugly')(loader)

function runTest (args) {
  var checkPrerequisites = require('../test/test')
  if (!checkPrerequisites($)) {
    return
  }

  var test = $.require(__dirname + '/../test/test')
  var load = $.run(__dirname + '/../test/load')
  load(args.length > 0 ? args[0] : '')
  /* var report =*/ test()
}

function run () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
  } else {
    var command = proc.argv[2]
    if (command === 'test') {
      return runTest(proc.argv.slice(3))
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
