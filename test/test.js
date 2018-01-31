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
  var typeName = typeof last
  typeName === expectedType ? passed(feature) : failed(feature)
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
  assert('String.prototype.trimLeft')
  assert('String.prototype.trimRight')
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
    'Object', 'ClassType',
    // runtime
    'Signal', 'Space'
  ])

  checkFunctions($void, '[Void / functions] ', [
    // genesis
    'operator', 'lambda', 'function', 'createClass',
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
    '+', '++', '--', '!', 'not', '~',
    '@', '=?', '=', '=>', 'redo', 'return', 'exit',
    'load', 'import', 'include'
  ])

  checkObjects($void.$, '[Sugly / types] ', [
    'type',
    'bool', 'string', 'number', 'date', 'range',
    'symbol', 'tuple',
    'operator', 'lambda', 'function',
    'array', 'object', 'class'
  ])

  checkObjects($void.$, '[Sugly / objects] ', [
    '-runtime', 'uri', 'math', 'json' // TODO: 'timer'
  ])

  checkFunctions($void.$, '[Sugly / functions] ', [
    // generic
    'type-of', 'indexer-of', 'iterate', 'traverse', 'collect',
    // lib
    'encode', 'print', 'warn',
    // startup
    'tokenizer', 'tokenize', 'compiler', 'compile',
    // runtime
    'eval', 'run', 'interpreter'
  ])

  checkInjections()

  checkTypeOf($void)

  checkIndexerOf($void)

  checkTypes($void)
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
  assert('Boolean.prototype.type', 'object')
  assert('String.prototype.type', 'object')
  assert('Number.prototype.type', 'object')
  assert('Date.prototype.type', 'object')
  assert('Object.prototype.type', 'object')
  assert('Array.prototype.type', 'object')
  assert('Function.prototype.type', 'object')
}

function check (result, name) {
  result ? passed(name) : failed(name)
}

function checkTypeOf ($void) {
  console.log('\n  - Static type-of')
  var typeOf = $void.typeOf
  check(typeOf() === null, 'undefined')
  check(typeOf(null) === null, 'null')

  var $ = $void.$
  check(typeOf(true) === $.bool, 'bool')
  check(typeOf('') === $.string, 'string')
  check(typeOf(1) === $.number, 'number')
  check(typeOf(new Date()) === $.date, 'date')
  check(typeOf(function () {}) === $.function, 'function')
  check(typeOf([]) === $.array, 'array')
  check(typeOf({}) === $.object, 'object')
}

function checkIndexerOf ($void) {
  console.log('\n  - Static indexer-of')
  var $ = $void.$
  var indexerOf = $void.indexerOf
  check(indexerOf() === $void.null[':'], 'undefined')
  check(indexerOf(null) === $void.null[':'], 'null')

  check(indexerOf($.bool) === $.bool[':'], 'bool')
  check($.bool[':']('type') === $.type, 'bool:type')
  check($.bool[':'](':') === $.bool[':'], 'bool::')
  check($.bool[':']('of') === $.bool.of, 'bool:of')
  check(indexerOf(true) === $.bool.proto[':'], 'bool:true')
  check(indexerOf(false) === $.bool.proto[':'], 'bool:false')
  check($.bool.proto[':']('type') === $.bool, 'bool::type')
  check($.bool.proto[':'](':') === $.bool.proto[':'], 'bool:::')

  check(indexerOf($.string) === $.string[':'], 'string')
  check(indexerOf('') === $.string.proto[':'], 'string:""')

  check(indexerOf($.number) === $.number[':'], 'number')
  check(indexerOf(0) === $.number.proto[':'], 'number:0')

  check(indexerOf($.date) === $.date[':'], 'date')
  check(indexerOf(new Date()) === $.date.proto[':'], '(date of)')

  check(indexerOf($.range) === $.range[':'], 'range')
  check(indexerOf(new $void.Range()) === $.range.proto[':'], '(range of)')

  check(indexerOf($.symbol) === $.symbol[':'], 'symbol')
  check(indexerOf(new $void.Symbol('x')) === $.symbol.proto[':'], '(symbol of)')

  check(indexerOf($.operator) === $.operator[':'], 'operator')
  check(indexerOf($.lambda) === $.lambda[':'], 'lambda')
  check(indexerOf($.function) === $.function[':'], 'function')
  check(indexerOf(function () {}) === $.function.proto[':'], 'number:0')

  check(indexerOf($.array) === $.array[':'], 'array')
  check(indexerOf([]) === $.array.proto[':'], 'array:[]')

  check(indexerOf($.object) === $.object[':'], 'object')
  check(indexerOf({}) === $.object.proto[':'], 'object:{}')
}

function checkTypes ($void) {
  console.log('\n  - Primary Types')
  var $ = $void.$
  var seval = function (expr, value) {
    var result = $void.$.eval(expr)
    var success = typeof value === 'function' ? value(result) : result === value
    if (!success) {
      failed(' - ' + expr + ' is evaluated to a value of' + (typeof result))
    }
    return success
  }
  check(seval(
    '', null
  ), 'null')

  check(seval(
    'type', $.type
  ), 'type')

  check(seval(
    'bool', $.bool
  ), 'bool')
  check(seval(
    'true', true
  ), 'bool:true')
  check(seval(
    'false', false
  ), 'bool:false')
  check(seval(
    '(bool of)', false
  ), '(bool of)')
  check(seval(
    '(bool of 1)', true
  ), '(bool of 1)')

  check(seval(
    'string', $.string
  ), 'string')
  check(seval(
    'number', $.number
  ), 'number')
  check(seval(
    'date', $.date
  ), 'date')
  check(seval(
    'range', $.range
  ), 'range')
  check(seval(
    'symbol', $.symbol
  ), 'symbol')
  check(seval(
    'tuple', $.tuple
  ), 'tuple')
  check(seval(
    'operator', $.operator
  ), 'operator')
  check(seval(
    'lambda', $.lambda
  ), 'lambda')
  check(seval(
    'function', $.function
  ), 'function')
  check(seval(
    '(array of 1 2)', function (a) {
      return a.length === 2 && a[0] === 1 && a[1] === 2
    }
  ), '(array of 1 2)')
  check(seval(
    '', null
  ), 'object')
  check(seval(
    '', null
  ), 'class')
}
