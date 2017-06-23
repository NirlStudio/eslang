'use strict'

// load Sugly runtime with local filesystem loader
var $void = require('../sugly')(require('./loader-fs'))
var $ = $void.$
var loader = $void.loader

// prepare work environment
var proc = global.process
var DIR = loader.join(__dirname, '..')
var PWD = proc.env.PWD

var command = proc.argv[2] || null
var options = proc.argv.slice(3) || []

module.exports = function () {
  if (!command) {
    return runAsShell(options)
  }
  switch (command) {
    case 'test':
      return runTest(options)
    case 'selftest':
    case 'self-test':
      return runSelfTest(options)
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

var readline = require('readline')
var reader = null
function runAsShell (options) {
  // create console reader
  reader = readline.createInterface({
    input: proc.stdin,
    output: proc.stdout
  })
  // add function to quit.
  $.quit = $.bye = function () {
    if (reader) {
      console.log('See you again.')
      reader.close()
      proc.exit(0)
    }
  }
  // create interpreter
  var interpret = $.interpreter(function (value, status) {
    if (status) {
      console.warn.apply(console, Array.prototype.slice.call(arguments, 1))
    } else {
      console.log($void.thisCall(value, 'to-string'))
    }
  }, options, PWD)
  // waiting for input
  reader.on('line', function (input) {
    interpret(input)
  })
}

function runTest (options) {
  if (PWD === DIR) {
    return runSelfTest(options)
  }
  enableTesting()
  var targets = options.length > 0 ? options : ['test.s']
  for (var taret in targets) {
    var file = loader.resolve(taret, [PWD, PWD + '/test'])
    if (typeof main === 'string') { // load test suites
      $.load(file)
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
  var test = $void.importModule(null, 'test')
  $.define = test.define
  $.should = test.should
  $.assert = test.assert
  $.test = test.test
}
