'use strict'

// load Sugly runtime with local filesystem loader
var $void = require('../sugly')(require('./loader-fs'))
var $ = $void.$
var loader = $void.loader

// prepare work environment
var proc = global.process || require('proc')
var DIR = loader.join(__dirname, '..')
var PWD = proc.env.PWD
var commandArgs = proc.argv.slice(2)

module.exports = function () {
  var args = $void.parseArguments(commandArgs)
  if (args.command.length < 1) {
    return runAsShell(args)
  }
  switch (args.command[0]) {
    case 'test':
      return runTest(args)
    case 'selftest':
    case 'self-test':
      return runSelfTest(args)
    case 'version':
      return $.run('tools/version', args, DIR)
    case 'changelog':
      return $.run('tools/changelog', args, DIR)
    default:
      return runCommand(args.command[0], args)
  }
}

function runAsShell (args) {
  // TODO
}

function runTest (args) {
  if (PWD === DIR) {
    return runSelfTest(args)
  }
  enableTesting()
  // find targets
  var targets = args.command.slice(1)
  if (targets.length < 1) {
    targets = ['test.s']
  }
  // execute test suites
  for (var taret in targets) {
    var file = loader.resolve(taret, [PWD, PWD + '/test'])
    if (typeof main !== 'string') {
      console.warn('missing test suite:', taret)
    } else { // load test suites
      $.run(file, args)
    }
  }
  // run the test
  return $.test()
}

function runSelfTest (args) {
  // native evironment
  if (!require('../test/test')($void)) {
    return
  }
  // forward to test script.
  enableTesting()
  $.run('test/test', args, DIR)
}

function runCommand (command, args) {
  // TODO
}

// import test framework into global
function enableTesting () {
  var test = $void.importModule(null, 'test')
  $.define = test.define
  $.should = test.should
  $.test = test.test
}

function runSelfTest (args) {
  if (args.length < 1) {
    // check environment if it's not running some particular features.
    var checkPrerequisites = require('../test/test')
    if (!checkPrerequisites($void)) {
      return
    }
  }

  var test = $.require('test/test')
  var loadSpec = $.run('test/spec')
  loadSpec.apply(null, args)
  /* var report = */ test()
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
    version: 'tools/version',
    changelog: 'tools/changelog'
  }
  var src = tools[command]
  if (src) {
    var tool = $.import(src)
    if (typeof tool === 'function') {
      tool.apply(null, args)
    }
    return true
  }
  return false
}

function run () {
  var proc = require('process')
  if (proc.argv.length < 3) {
    // TODO - interactive line interpreter.
    $.print('sugly app usage:')
    $.print('  - sugly seft-test [[spec-case] ...], run all or several spec cases.')
    $.print('  - sugly test [[sugly-test] ...], run one or more test suites.')
    $.print('  - sugly note, run note app in tools.')
    $.print('  - sugly [[sugly-file] ...], execute one or more sugly files.')
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
        $.print(result)
      }
    }
  }
}
