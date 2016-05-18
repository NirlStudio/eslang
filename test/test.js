'use strict'

var C = require('../lib/colors')
var JS, failing, passing

function failed (feature) {
  failing.push(feature)
  console.log('    ' + C.failed + C.red('[FAILED] ' + feature))
}

function passed (feature) {
  passing += 1
  console.log('    ' + C.passed + C.gray('[PASSED] ' + feature))
}

function assert (feature, expected) {
  if (typeof expected !== 'string') {
    expected = 'function'
  }

  var parts = feature.split('.')
  var last = JS
  for (var i = 0; i < parts.length; i++) {
    last = last[parts[i]]
    if (typeof last === 'undefined') {
      break
    }
  }
  if (typeof last === expected) {
    passed(feature)
  } else {
    failed(feature)
  }
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
    passed('Sugly is using polyfill functions:')
    var padding = '      - '
    console.log(C.gray(padding + polyfill.join('\n' + padding)))
  } else {
    passed('Sugly is not using any polyfill functions.')
  }
}

function checkSystem () {
  console.log('\n  Checking Javascript environment')
  checkJavascript()
  checkPolyfill()
}

function checkObject () {
  console.log('\n  - Object')
  assert('Object.assign')
  assert('Object.create')
  assert('Object.is')
  assert('Object.defineProperty')
  assert('Object.getOwnPropertyNames')
}

function checkString () {
  console.log('\n  - String')
  assert('String.prototype.endsWith')
  assert('String.prototype.startsWith')
}

function checkArray () {
  console.log('\n  - Array')
  assert('Array.isArray')
}

function checkNumber () {
  console.log('\n  - Array')
  assert('Number.isInteger')
}

function checkEnvronment ($) {
  failing = []
  passing = 0

  checkSystem()
  checkObject()
  checkString()
  checkArray()
  checkNumber()

  if (failing.length < 1) {
    checkSugly($)
  }

  console.log(C.green('\n  passing: ' + passing))
  if (failing.length < 1) {
    console.log(C.green('\n  Sugly is ready to run.\n'))
    return true
  }

  console.log(C.red('  failing: ' + failing.length))
  console.log('\n  There might be some issues to prevent running sugly')
  for (var i = 0; i < failing.length; i++) {
    console.log(C.red('  - ' + failing[i]))
  }
  console.log()
  return false
}

function checkOperators ($, group, names) {
  console.log('\n  - operators')
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (typeof $.operators[name] === 'function') {
      passed(name)
    } else {
      failed(group + name)
    }
  }
}

function checkFunctions ($, group, names) {
  console.log('\n  - functions')
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
  console.log('\n  - objects')
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
  assert('Boolean.prototype.type', 'object')
  assert('Boolean.prototype.:')

  assert('Number.prototype.type', 'object')
  assert('Number.prototype.:')

  assert('String.prototype.type', 'object')
  assert('String.prototype.:')

  assert('Object.prototype.type', 'object')
  assert('Object.prototype.:')

  assert('Date.prototype.type', 'object')
  assert('Date.prototype.:')

  assert('Array.prototype.type', 'object')
  assert('Array.prototype.:')
}

function checkSugly ($void) {
  if (typeof $void === 'undefined') {
    $void = require('..')
  }
  console.log('\n  Checking Sugly runtime ...')

  checkOperators($void, '[Void / operator] ', [
    '`', 'quote', 'let', '@', 'object', 'array',
    '=', 'function', 'closure', '=>', 'lambda', 'return', 'exit', 'halt',
    'is', 'typeof', 'bool', 'number', 'string', 'symbol', 'date',
    'if', 'for', 'while', 'break', 'continue',
    '->', 'flow', '|', 'pipe', '?', 'premise', 'operator',
    '+', '+=', '-', '-=', '/=', '*=', '++', '--', '&&', '||', '!'
  ])

  checkFunctions($void, '[Void / function] ', [
    'Signal', 'resolve', 'assign', 'set', 'evaluate', 'signalOf',
    'export', 'load', 'createSpace', 'createModuleSpace', 'execute'
  ])

  checkFunctions($void.$, '[Sugly / function] ', [
    'bool', 'string', 'symbol', 'object', 'date', 'array', 'range', 'iterate',
    'compile', 'encoder', 'encode', 'print',
    'export', 'function', 'lambda', 'eval',
    'load', 'exec', 'run', 'import', 'require', 'retire'
  ])

  checkObjects($void.$, '[Sugly / object] ', [
    'Bool', 'Number', 'Int', 'Float', 'String', 'Symbol', 'Class', 'Function',
    'Date', 'Array', 'Uri', 'Math', 'Json', 'Sugly'
  ])

  checkInjections()
}

function check ($) {
  if (typeof console.log === 'function') {
    return checkEnvronment($)
  } else {
    window.alert('The global console object is required.')
    return false
  }
}

if (require.main === module) {
  check()
} else if (typeof describe === 'function' && typeof it === 'function') {
  check()
  /* global describe, it */
  describe('P.S. Mocha is no longer required.', function () {
    it('npm test: run all sugly test cases.', function () {})
    it('npm run check: only check the environment prerequisites.', function () {})
  })
} else {
  module.exports = check
}
