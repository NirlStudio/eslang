'use strict'

var colors = Object.create(null)
require('../modules/colors')(colors)

var red = colors.red
var gray = colors.gray
var green = colors.green

var JS, failing, passing

module.exports = function ($void) {
  if (!console || typeof console.log !== 'function') {
    window.alert('The global console object is required.')
    return false
  }

  // reset report
  passing = 0
  failing = []
  // check native environment
  checkSystem()
  // check types & gloal objects
  checkNumber()
  checkString()
  checkObject()
  checkArray()
  checkMath()
  checkConsole()
  // try to check sugly runtime only if the native environment is ok.
  if (failing.length < 1) {
    checkSuglyRuntime($void)
  }
  // start to report result
  console.log(green('\n  passing: ', passing))
  if (failing.length < 1) {
    console.log(green('\n  Sugly is ready to run.\n'))
    return true
  }
  // print failures
  console.log(red('  failing: ', failing.length))
  console.log('\n  There might be some issues to prevent running sugly')
  for (var i = 0; i < failing.length; i++) {
    console.log(red('  - ' + failing[i]))
  }
  console.log()
  return false
}

var signPassed = '    ' + colors.passed + gray('[PASSED]')
function passed (feature) {
  passing += 1
  console.log(signPassed, gray(feature))
}

var signFailed = '    ' + colors.passed + red('[FAILED]')
function failed (feature) {
  failing.push(feature)
  console.log(signFailed, red(feature))
}

function assert (feature, expectedType) {
  if (typeof expectedType !== 'string') {
    expectedType = 'function'
  }
  var parts = feature.split('.')
  var last = JS
  for (var i = 0; i < parts.length; i++) {
    last = last[parts[i]]
    if (typeof last === 'undefined') {
      break
    }
  }
  typeof last === expectedType ? passed(feature) : failed(feature)
}

function checkSystem () {
  console.log('\n  Checking Javascript environment')
  checkJavascript()
  checkPolyfill()
}

function checkJavascript () {
  JS = global || window
  if (global) {
    passed('JS is using the space of global.')
  } else {
    passed('JS is using the space of window.')
  }
}

function checkPolyfill () {
  var polyfill = require('../lib/polyfill')
  if (polyfill.length > 0) {
    passed('Sugly is using some polyfill functions:')
    var padding = '      - '
    console.log(gray(padding, polyfill.join('\n' + padding)))
  } else {
    passed('Congratulations! Sugly does not need any polyfill.')
  }
}

function checkNumber () {
  console.log('\n  - Number')
  assert('Number.isInteger')
  assert('Number.isSafeInteger')
  assert('Number.MAX_SAFE_INTEGER', 'number')
  assert('Number.MIN_SAFE_INTEGER', 'number')
}

function checkString () {
  console.log('\n  - String')
  assert('String.prototype.trim')
  assert('String.prototype.endsWith')
  assert('String.prototype.startsWith')
}

function checkObject () {
  console.log('\n  - Object')
  assert('Object.is')
  assert('Object.assign')
  assert('Object.create')
  assert('Object.defineProperty')
  assert('Object.getOwnPropertyNames')
}

function checkArray () {
  console.log('\n  - Array')
  assert('Array.isArray')
}

function checkMath () {
  console.log('\n  - Math')
  assert('Math.trunc')
}

function checkConsole () {
  console.log('\n  - console')
  assert('console.warn')
}

function checkSuglyRuntime ($void) {
  console.log('\n  Checking Sugly Runtime ...')
  checkObjects($void, '[Void / Null] ', [
    'null'
  ])

  checkFunctions($void, '[Void / constructors] ', [
    // genesis
    'Type', 'Range', 'Symbol', 'Tuple',
    'Object', 'Module', 'ClassType', 'DeviceType',
    // runtime
    'Signal', 'Space'
  ])

  checkFunctions($void, '[Void / functions] ', [
    // genesis
    'operator', 'lambda', 'function', 'createType',
    // runtime
    'createLambdaSpace', 'createFunctionSpace',
    'createOperatorSpace', 'createModuleSpace',
    'evaluate', 'signalOf',
    'lambdaOf', 'functionOf', 'operatorOf',
    'execute'
  ])

  checkStaticOperators($void, '[void / operators] ', [
    '`', 'export', 'let', 'var',
    '?', 'if', 'while', 'for', 'break', 'continue',
    '+', '++', '--', '!', '~',
    '@', '=?', '=', '=>', 'redo', 'return', 'exit',
    'load', 'import', 'include'
  ])

  checkObjects($void.$, '[Sugly / types] ', [
    'bool', 'string', 'number', 'date', 'range', 'symbol', 'tuple',
    'operator', 'lambda', 'function',
    'object', 'module', 'class', 'device', 'array', 'set', 'map'
  ])

  checkObjects($void.$, '[Sugly / objects] ', [
    '-runtime', 'uri', 'math', 'json' // TODO: 'timer'
  ])

  checkFunctions($void.$, '[Sugly / functions] ', [
    // generic
    'iterate', 'traverse', 'collect', 'call', 'apply',
    // lib
    'encode', 'print', 'warn',
    // startup
    'tokenizer', 'tokenize', 'compiler', 'compile',
    // runtime
    'eval', 'run', 'interpreter'
  ])

  checkInjections()
}

function checkStaticOperators ($void, group, names) {
  console.log('\n  -', group)
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (typeof $void.staticOperators[name] === 'function') {
      passed(name)
    } else {
      failed(group + name)
    }
  }
}

function checkFunctions ($, group, names) {
  console.log('\n  -', group)
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (typeof $[name] === 'function') {
      passed(name)
    } else {
      failed(group + name)
    }
  }
}

function checkObjects ($, group, names) {
  console.log('\n  -', group)
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (typeof $[name] === 'object') {
      passed(name)
    } else {
      failed(group + name)
    }
  }
}

function checkInjections () {
  console.log('\n  - Type Injections')
  assert('Boolean.prototype.:')
  assert('String.prototype.:')
  assert('Number.prototype.:')
  assert('Date.prototype.:')
  assert('Object.prototype.:')
  assert('Array.prototype.:')
  assert('Function.prototype.:')
}
