'use strict'

var path = require('path')
var colors = require('colors/safe')

// prepare work environment
var proc = global.process
var DIR = path.resolve(__dirname, '..')
var PWD = proc.env.PWD || proc.cwd()
var ARGS = proc.argv

// parse command and arguments
var profile = ARGS.length > 2 && ARGS[2].startsWith(':')
  ? ARGS[2].substring(1) : null
var command = ARGS[profile ? 3 : 2] || null
var args = ARGS.slice(profile ? 4 : 3) || []

// create a runtime instance.
var $void = require('./void')()
var warn = $void.$warn
var loader = $void.loader
var completeFile = $void.completeFile

// customize native runtime by a profile.
var nativeModule = require('./module-native')
if (profile === ':unsafe') {
  nativeModule.exposeAll() // expose all available native modules.
} else if (profile) {
  require(path.isAbsolute(profile) ? profile
    : path.resolve(PWD, profile)
  )($void)
}

var shell = require('./shell')($void,
  require('./stdin')($void),
  require('./process')($void)
)
var checkRuntime = require('../test/test')($void)
$void.$shell['test-bootstrap'] = checkRuntime

function write (text, color) {
  proc.stderr.write((color || colors.green)(text))
}

function echo (message) {
  write('= ', colors.gray)
  write(message.length <= 120 ? message
    : message.substring(0, 113) + '... ...')
  write('\n')
}

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
  var target = completeFile(args.length > 0 ? args[0] : 'test.es')
  var file = loader.resolve(target, [PWD, PWD + '/test'])
  if (typeof file !== 'string') { // load test suites
    warn('app:runTest', 'missing test suite:', target, 'in', [PWD, PWD + '/test'])
    return null
  }
  var space = prepareTestSpace(file)
  space.bindOperators()
  space.$load(file)
  return space.local.test()
}

function prepareTestSpace (file) {
  var testHome = path.join(path.dirname(file), '@')
  var appSpace = $void.createBootstrapSpace(testHome)
  var test = appSpace.$import('test')
  for (var key in test) {
    appSpace.export(key, test[key])
  }
  // run tests in a module space.
  return $void.createModuleSpace(testHome, appSpace)
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
    $void.$run('tools/help', args, DIR)
    break
  case 'version':
  case '-v':
  case '--version':
    $void.$run('tools/version', args, DIR)
    break
  default:
    command ? $void.$run(command, args, PWD) : shell(args, echo)
    break
}
