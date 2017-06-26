'use strict'

// load Sugly runtime with local filesystem loader
var fileLoader = require('./loader-fs')
var $void = require('../sugly')(fileLoader)
var $ = $void.$

var loader = $void.loader
var shell = require('./shell')($void)

// prepare work environment
var proc = global.process
var DIR = loader.join(__dirname, '..')
var PWD = proc.env.PWD

var command = proc.argv[2] || null
var options = proc.argv.slice(3) || []

module.exports = function () {
  $void.env('uri', PWD)
  if (!command) {
    return runAsShell(options)
  }
  switch (command) {
    case 'test':
      return runTest(options)
    case 'selftest':
    case 'self-test':
      return runSelfTest(options)
    case 'shell':
      return runAsShell(options)
    case 'help':
      return $.run('tools/help', options, DIR)
    case 'version':
      return $.run('tools/version', options, DIR)
    case 'changelog':
      return $.run('tools/changelog', options, DIR)
    default:
      return $.run(command, options, PWD)
  }
}

function runAsShell (options) {
  // to enable testing interactively
  $.test = function () {
    enableTesting()
    console.log('Testing has been enabled.')
    if (arguments.length > 0) {
      // forward arguments.
      $.test.apply($, arguments)
    }
  }
  // pass control to shell with the current process.
  shell(proc, options)
}

function runTest (options) {
  if (PWD === DIR) {
    return runSelfTest(options)
  }
  enableTesting()
  var targets = options.length > 0 ? options : ['test.s']
  for (var i = 0; i < targets.length; i++) {
    var taret = targets[i]
    var file = loader.resolve(taret, [PWD, PWD + '/test'])
    if (typeof file === 'string') { // load test suites
      $void.loadData(PWD, file)
    } else {
      console.warn('missing test suite:', taret)
    }
  }
  return $.test()
}

function runSelfTest (options) {
  // native evironment
  if (!require('../test/test')($void)) {
    return
  }
  // run spec suites.
  enableTesting()
  // test/test.s is an app.
  $.run('test/test', options, DIR)
}

// import test framework into global
function enableTesting () {
  var test = $void.importModule(DIR, 'test')
  $.define = test.define
  $.should = test.should
  $.assert = test.assert
  $.test = test.test
}
