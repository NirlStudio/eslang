'use strict'

var path = require('path')
var colors = require('./colors')

// prepare work environment
var RUNTIME_DIR = path.resolve(__dirname, '..')
var PWD = process.env.PWD || process.cwd()
var ARGS = process.argv

// parse command and arguments
var command = ARGS[2] || null
var args = ARGS.slice(3) || []

// create a runtime instance.
var $void = require('./void')()
var warn = $void.$warn
var completeFile = $void.completeFile

var checkRuntime = require('../test/test')($void)

var shell = require('./shell')($void,
  require('./stdin')($void),
  require('./process')($void)
)

function write (text, color) {
  process.stderr.write((colors.green)(text))
}

function echo (message) {
  write('= ', colors.gray)
  write(message.length <= 120 ? message
    : message.substring(0, 113) + '... ...')
  write('\n')
}

function runSelfTest (args) {
  if (checkRuntime() && (args.length < 1 || args[0] !== 'bootstrap')) {
    return $void.$run('test/test', args, RUNTIME_DIR)
  } else {
    return null
  }
}

function runTest (args) {
  if (PWD === RUNTIME_DIR && args.length < 1) {
    return runSelfTest(args)
  }
  var target = args.length > 0 ? completeFile(args[0]) : 'test.es'
  var space = prepareTestSpace()
  space.$load(path.join(PWD, target))
  var result = space.local.test()
  if (!result) {
    space.$load(path.join(PWD, 'test', target))
    result = space.local.test()
    if (!result) {
      warn('app:runTest', 'no test suite', target, 'found in', [PWD, PWD + '/test'])
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
  case 'selftest':
    runSelfTest(args)
    break
  case 'test':
    runTest(args)
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
    command ? $void.$run(command, args, PWD) : shell(args, echo)
    break
}
