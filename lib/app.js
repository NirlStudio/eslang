'use strict'

var fs = require('fs')
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
  if (PWD === RUNTIME_DIR && args.length < 1) {
    return runSelfTest(args)
  }

  var target = resolveTest(args[0])
  if (!target) {
    warn('es', 'cannot find test suite:', args[0])
    process.exit(1)
  }

  var space = prepareTestSpace()
  space.$load(target)
  var result = space.local.test()
  return process.exit(result ? 0 : 1)
}

function resolveTest (target) {
  target = completeFile(target || 'test', true)

  if (fs.existsSync(path.resolve(PWD, target))) {
    return path.join(PWD, target)
  }

  if (!target.startsWith('.')) {
    if (fs.existsSync(path.resolve(PWD, 'test', target))) {
      return path.join(PWD, 'test', target)
    }
    if (fs.existsSync(path.resolve(RUNTIME_DIR, target))) {
      return path.join(RUNTIME_DIR, target)
    }
    if (fs.existsSync(path.resolve(RUNTIME_DIR, 'spec', target))) {
      return path.join(RUNTIME_DIR, 'spec', target)
    }
  }
  return null
}

function prepareTestSpace () {
  var testHome = path.join(PWD, '@')
  var appSpace = $void.createAppSpace(testHome)
  appSpace.bindOperators()
  var test = appSpace.$import('es/test')
  for (var key in test) {
    if (Object.prototype.hasOwnProperty.call(test, key)) {
      appSpace.export(key, test[key])
    }
  }
  return appSpace
}

function resolveCommand (command) {
  command = completeFile(command)
  if ($void.loader.isRemote(command)) {
    warn('es', 'Please download the program or run it interactively in shell.')
    process.exit(1)
  }

  if (path.isAbsolute(command) || command.startsWith('.')) {
    return command
  }

  var baseDirs = [PWD, RUNTIME_DIR]
  for (var i = 0; i < baseDirs.length; i++) {
    var resolved = path.resolve(baseDirs[i], command)
    if (fs.existsSync(resolved)) {
      return resolved
    }
  }
  return command
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
      ? $void.$run(resolveCommand(command), args, PWD)
      : require('./shell')($void)(
        require('./stdin')($void),
        process.exit
      )
    break
}
