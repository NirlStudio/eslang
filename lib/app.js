'use strict'

var path = require('path')

// create a runtime instance.
var $void = require('../sugly')(
  require('./stdout'),
  require('./loader')
)

var warn = $void.$warn
var loader = $void.loader

var shell = require('./shell')($void,
  require('./stdin')($void),
  require('./process')($void)
)
var checkRuntime = require('../test/test')($void)

// prepare work environment
var proc = global.process
var DIR = path.resolve(__dirname, '..')
var PWD = proc.env.PWD

var command = proc.argv[2] || null
var args = proc.argv.slice(3) || []

function runSelfTest (args) {
  if (checkRuntime() && (args.length < 1 || args[0] !== 'bootstrap')) {
    return $void.$run('test/test', args, DIR)
  } else {
    return null
  }
}

function runTest (args) {
  if (PWD === DIR && args.length < 1) {
    return runSelfTest(args)
  }
  var space = prepareTestSpace()
  space.bindOperators()
  var targets = args.length > 0 ? args : ['test.s']
  for (var i = 0; i < targets.length; i++) {
    var target = targets[i]
    if (!target.endsWith('.s')) {
      target += '.s'
    }
    var file = loader.resolve(target, [PWD, PWD + '/test'])
    if (typeof file === 'string') { // load test suites
      space.$load(file)
    } else {
      warn('app:runTest', 'missing test suite:', target)
    }
  }
  return space.local.test()
}

function prepareTestSpace () {
  var appSpace = $void.createBootstrapSpace(PWD + '/.')
  var test = appSpace.$import('test')
  for (var key in test) {
    appSpace.export(key, test[key])
  }
  // run tests in a module space.
  return $void.createModuleSpace(PWD + '/test', appSpace)
}

module.exports = function () {
  $void.env('home', PWD)
  switch (command) {
    case 'selftest':
    case 'self-test':
      return runSelfTest(args)
    case 'test':
      return runTest(args)
    case 'help':
      return $void.$run('tools/help', args, DIR)
    case 'version':
      return $void.$run('tools/version', args, DIR)
    default:
      return command ? $void.$run(command, args, PWD) : shell(args)
  }
}
