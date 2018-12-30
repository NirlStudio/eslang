'use strict'

// load Sugly runtime with local filesystem loader
var fileLoader = require('./loader-fs')
var $void = require('../sugly')(fileLoader)

var $ = $void.$
var print = $void.print
var loader = $void.loader

var shell = require('./shell')($void)
var checkRuntime = require('../test/test')($void)

// prepare work environment
var proc = global.process
var DIR = loader.join(__dirname, '..')
var PWD = proc.env.PWD

var command = proc.argv[2] || null
var args = proc.argv.slice(3) || []

module.exports = function () {
  $void.env('home', PWD)
  if (!command) {
    return runAsShell(args)
  }
  switch (command) {
    case 'test':
      return runTest(args)
    case 'selftest':
    case 'self-test':
      return runSelfTest(args)
    case 'shell':
      return runAsShell(args)
    case 'help':
      return $.run('tools/help', args, DIR)
    case 'version':
      return $.run('tools/version', args, DIR)
    case 'changelog':
      return $.run('tools/changelog', args, DIR)
    default:
      var result = $.run(command, args, PWD)
      if (result != null) {
        print($void.thisCall(result, 'to-string'))
      }
  }
}

function runAsShell (args) {
  // to enable testing interactively
  $['enable-test'] = function () {
    enableTesting()
    print('Testing has been enabled.')
    if (arguments.length > 0) {
      // forward arguments.
      $.test.apply($, arguments)
    }
    return arguments.length
  }
  // pass control to shell with the current process.
  shell(proc, args)
}

function runTest (args) {
  if (PWD === DIR && args.length < 1) {
    return runSelfTest(args)
  }
  enableTesting()
  var targets = args.length > 0 ? args : ['test.s']
  for (var i = 0; i < targets.length; i++) {
    var target = targets[i]
    if (!target.endsWith('.s')) {
      target += '.s'
    }
    var file = loader.resolve(target, [PWD, PWD + '/test'])
    if (typeof file === 'string') { // load test suites
      $void.loadData(null, PWD, file)
    } else {
      $void.warn('missing test suite:', target)
    }
  }
  return $.test()
}

function runSelfTest (args) {
  if (checkRuntime() && (args.length < 1 || args[0] !== 'bootstrap')) {
    $.run('test/test', args, DIR)
  }
}

// import test framework into global
function enableTesting () {
  var test = $void.importModule(null, DIR, 'test')
  Object.assign($, test)
}
