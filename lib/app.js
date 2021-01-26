'use strict'

var path = require('path')

// prepare work environment
var PWD = process.env.PWD || process.cwd()
var RUNTIME_DIR = path.resolve(__dirname, '..')

// parse command and arguments
var command = process.argv[2] || null
var args = process.argv.slice(3) || []

// create a runtime instance.
var $void = require('./void')()
var warn = $void.$warn
var completeFile = $void.completeFile

function runSelfTest (args) {
  var checkRuntime = require('../test/test')($void)
  if (!checkRuntime()) {
    return false
  }
  if (args.length > 0 && args[0] === 'bootstrap') {
    return true
  }
  return $void.$run('test/test.es', args, RUNTIME_DIR)
}

function runTest (args) {
  if (PWD === RUNTIME_DIR) {
    return runSelfTest(args)
  }

  var space = prepareTestSpace()
  var target = completeFile(args[0], true)
  space.$load(path.join(PWD, target))
  var result = space.local.test()
  if (!result) {
    space.$load(path.join(PWD, 'test', target))
    result = space.local.test()
    if (!result) {
      warn('app:runTest', 'no test suite', target,
        'found in', PWD, 'and', PWD + '/test'
      )
      return null
    }
  }
  return result
}

function prepareTestSpace () {
  var testHome = path.join(PWD, '@')
  var appSpace = $void.createAppSpace(testHome)
  appSpace.bindOperators()
  var test = appSpace.$import('es/test')
  for (var key in test) {
    appSpace.export(key, test[key])
  }
  return appSpace
}

switch (command) {
  case 'test':
    runTest(args)
    break

  case 'selftest':
    runSelfTest(args)
    break

  case 'help':
  case '-h':
  case '--help':
    $void.$run('tools/help', args, RUNTIME_DIR)
    break

  case 'version':
  case '-v':
  case '--version':
    $void.$run('tools/version', args, RUNTIME_DIR)
    break

  default:
    command
      ? $void.$run(command, args, PWD)
      : require('./shell')($void)(
        require('./stdin')($void),
        process.exit
      )
    break
}
