'use strict'

// load Sugly runtime with local filesystem loader
var loader = require('./loader-fs')
var $void = require('../sugly')(loader)
var $ = $void.$

function runSelfTest (args) {
  if (args.length < 1) {
    // check environment if it's not running some particular features.
    var checkPrerequisites = require('../test/test')
    if (!checkPrerequisites($)) {
      return
    }
  }

  var test = $.require('test/test')
  var loadSpec = $.run('test/spec')
  loadSpec.apply(null, args)
  /* var report =*/ test()
}

function runTest (args) {
  var test = $.require('test/test')
  if (args.length < 1) {
    args = ['test']
  }
  test.apply(null, args)
}

function runTool (command, args) {
  var tools = {
    note: 'tools/note'
  }
  var tool = tools[command]
  if (tool) {
    $.require(tool)(args)
    return true
  }
  return false
}

function run () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
    $.print.code('sugly app usage:')
    $.print.code('  - sugly seft-test [[spec-case] ...], run all or several spec cases.')
    $.print.code('  - sugly test [[sugly-test] ...], run one or more test suites.')
    $.print.code('  - sugly note, run note app in tools.')
    $.print.code('  - sugly [[sugly-file] ...], execute one or more sugly files.')
  } else {
    var command = proc.argv[2]
    if (command === 'self-test' || command === 'selftest') {
      return runSelfTest(proc.argv.slice(3))
    }

    if (command === 'test') {
      return runTest(proc.argv.slice(3))
    }

    if (runTool(command, proc.argv.slice(3))) {
      return
    }

    for (var index = 2; index < proc.argv.length; index++) {
      var result = $.run(proc.argv[index])
      if (result !== null) {
        $.print.value(result)
      }
    }
  }
}

module.exports = function () {
  try {
    run()
  } catch (signal) {
    if (signal instanceof $void.Signal) {
      if (signal.value !== null) {
        $.print.value(signal.value)
      }
      process.exit(0) // only halt signal will arrive here.
    }
    throw signal
  }
}
