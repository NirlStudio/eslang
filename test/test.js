'use strict'

var colors = Object.create(null)
require('../modules/colors')(colors)

var red = colors.red
var gray = colors.gray
var green = colors.green

var signPassed = '    ' + colors.passed + gray('[PASSED]')
var signFailed = '    ' + colors.passed + red('[FAILED]')

module.exports = function ($void) {
  var $ = $void.$
  var passing = 0
  var failing = []

  return function () {
    // check native environment
    console.log('\n  Checking JavaScript environment')
    checkJavascript()
    checkPolyfill()

    // check sugly runtime.
    checkSuglyRuntime()

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

  function passed (feature) {
    passing += 1
    console.log(signPassed, gray(feature))
  }

  function failed (feature) {
    failing.push(feature)
    console.log(signFailed, red(feature))
  }

  function checkJavascript () {
    passed('JS is using the space of ' + (global ? 'global.' : 'window.'))
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

  function checkSuglyRuntime () {
    console.log('\n  Checking Sugly Runtime ...')
    checkObjects($void, '[Void / Null] ', [
      'null'
    ])

    checkFunctions($void, '[Void / constructors] ', [
      // genesis
      'Type', 'Date', 'Range', 'Symbol', 'Tuple',
      'Object', 'ClassType',
      // runtime
      'Signal', 'Space', 'OperatorSpace'
    ])

    checkFunctions($void, '[Void / functions] ', [
      // genesis
      'operator', 'lambda', 'function',
      // runtime
      'createAppSpace', 'createModuleSpace',
      'createLambdaSpace', 'createFunctionSpace', 'createOperatorSpace',
      'signalOf',
      'lambdaOf', 'functionOf', 'operatorOf',
      'evaluate', 'execute'
    ])

    checkStaticOperators('[void / operators] ', [
      '`', 'export', 'let', 'var',
      '?', 'if', 'while', 'for', 'break', 'continue',
      '+', '++', '--', '!', 'not', '~',
      '@', '=?', '=', '=>', 'redo', 'return', 'exit',
      'load', 'import', 'include'
    ])

    checkObjects($, '[Sugly / types] ', [
      'type',
      'bool', 'string', 'number', 'date', 'range',
      'symbol', 'tuple',
      'operator', 'lambda', 'function',
      'array', 'iterator', 'object', 'class'
    ])

    checkFunctions($, '[Sugly / functions] ', [
      // runtime
      'env', 'eval', 'run', 'interpreter',
      // startup
      'tokenizer', 'tokenize', 'compiler', 'compile'
    ])

    checkFunctions($, '[Sugly / lib / functions] ', [
      // lib
      'encode', 'print', 'warn'
    ])

    checkObjects($, '[Sugly / lib / objects] ', [
      'uri', 'math', 'json'
    ])

    checkObjects($, '[Sugly / lib / classes] ', [
      'emitter', 'timer'
    ])

    // bootstrap tests
    checkTypeOf()
    checkIndexerOf()

    checkTypes()
    checkAssignment()
    checkOperators()
    checkControl()
    checkOperations()
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

  function checkStaticOperators (group, names) {
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

  function check (feature, result, error) {
    result ? passed(feature) : failed(error ? feature + ' - ' + error : feature)
  }

  function checkTypeOf () {
    console.log('\n  - Static type-of')
    var typeOf = $.type.of

    check('[undefined]', typeOf() === null)
    check('null', typeOf(null) === null)

    check('bool', typeOf(true) === $.bool)
    check('string', typeOf('') === $.string)
    check('number', typeOf(1) === $.number)
    check('date', typeOf($.date.empty) === $.date)
    check('range', typeOf($.range.empty) === $.range)
    check('symbol', typeOf($.symbol.empty) === $.symbol)
    check('tuple', typeOf($.tuple.empty) === $.tuple)

    check('operator', typeOf($.operator.empty()) === $.operator)
    check('lambda', typeOf($.lambda.empty()) === $.lambda)
    check('function', typeOf($.function.empty()) === $.function)
    check('function (generic)', typeOf(function () {}) === $.function)

    check('array', typeOf($.array.empty()) === $.array)
    check('array (generic)', typeOf([]) === $.array)

    check('object', typeOf($.object.empty()) === $.object)
    check('object (generic)', typeOf({}) === $.object)

    check('class', typeOf($.class.empty()) === $.class)
  }

  function checkIndexerOf () {
    console.log('\n  - Static indexer-of')
    var indexerOf = $void.indexerOf

    check('[undefined]', indexerOf() === $void.null[':'])
    check('null', indexerOf(null) === $void.null[':'])
    check('type', indexerOf($.type) === $.type[':'])

    check('bool', indexerOf($.bool) === $.bool[':'])
    check('bool: true', indexerOf(true) === $.bool.proto[':'])
    check('bool: false', indexerOf(false) === $.bool.proto[':'])

    check('string', indexerOf($.string) === $.string[':'])
    check('string: empty', indexerOf('') === $.string.proto[':'])

    check('number', indexerOf($.number) === $.number[':'])
    check('number: 0', indexerOf(0) === $.number.proto[':'])

    check('date', indexerOf($.date) === $.date[':'])
    check('date: empty', indexerOf($.date.empty) === $.date.proto[':'])

    check('range', indexerOf($.range) === $.range[':'])
    check('range: empty', indexerOf($.range.empty) === $.range.proto[':'])

    check('symbol', indexerOf($.symbol) === $.symbol[':'])
    check('symbol: empty', indexerOf($.symbol.empty) === $.symbol.proto[':'])

    check('operator', indexerOf($.operator) === $.operator[':'])
    check('operator.empty', indexerOf($.operator.empty()) === $.operator.proto[':'])

    check('lambda', indexerOf($.lambda) === $.lambda[':'])
    check('lambda: empty', indexerOf($.lambda.empty()) === $.lambda.proto[':'])

    check('function', indexerOf($.function) === $.function[':'])
    check('function: empty', indexerOf($.function.empty()) === $.function.proto[':'])
    check('function: generic', indexerOf(function () {}) === $.function.proto[':'])

    check('array', indexerOf($.array) === $.array[':'])
    check('array: empty', indexerOf($.array.empty()) === $.array.proto[':'])
    check('array: generic', indexerOf([]) === $.array.proto[':'])

    check('object', indexerOf($.object) === $.object[':'])
    check('object: empty', indexerOf($.object.empty()) === $.object.proto[':'])
    check('object: generic', indexerOf({}) === $.object.proto[':'])
  }

  function seval (expected, expr, desc) {
    var result = $.eval(expr)
    var success = typeof expected === 'function' ? expected(result) : Object.is(result, expected)
    check(expr || desc, success, success || 'evaluated to a value of ' +
      (typeof result) + ': ' + (result ? result.toString() : result))
  }

  function checkTypes () {
    console.log('\n  - Primary Types')
    seval(null, '', '<empty>')
    seval(null, '()')
    seval(null, 'null')

    seval($.type, 'type')

    seval($.bool, 'bool')
    seval(true, 'true')
    seval(false, 'false')

    seval($.string, 'string')
    seval($.string.empty, '""')
    seval('ABC', '"ABC"')
    seval('ABC', '("ABC")')
    seval(3, '("ABC" length)')
    seval('ABCDEF', '("ABC" + "DEF")')

    seval($.number, 'number')
    seval(3, '(1 + 2)')
    seval(-1, '(1 - 2)')
    seval(2, '(1 * 2)')
    seval(0.5, '(1 / 2)')

    seval($.date, 'date')
    seval(function (d) {
      return d instanceof Date
    }, '(date now)')

    seval($.range, 'range')
    seval(function (r) {
      return r.begin === 0 && r.end === 3 && r.step === 1
    }, '(0 3)')
    seval(function (r) {
      return r.begin === 10 && r.end === 20 && r.step === 2
    }, '(10 20 2)')

    seval($.symbol, 'symbol')
    seval(function (s) {
      return s.key === 'x'
    }, '(` x)')

    seval($.tuple, 'tuple')
    seval(function (t) {
      var l = t.$
      return t instanceof $void.Tuple && l[0].key === 'x' && l[1] === 1 && l[2] === 'y' && l[3] === true
    }, '(` (x 1 "y" true))')

    seval($.operator, 'operator')
    seval(function (s) {
      return s.type === $.operator
    }, '(=? () )')
    seval(function (s) {
      return s.type === $.operator
    }, '(=? (X Y) (+ (X) (Y).')

    seval($.lambda, 'lambda')
    seval(function (s) {
      return s.type === $.lambda
    }, '(= () )')
    seval(function (s) {
      return s.type === $.lambda
    }, '(= (x y) (+ x y).')

    seval($.function, 'function')
    seval(function (s) {
      return s.type === $.function
    }, '(=> () )')
    seval(function (s) {
      return s.type === $.function
    }, '(=> (x y) (+ x y).')

    seval($.array, 'array')
    seval(function (a) {
      return a.length === 2 && a[0] === 1 && a[1] === 2
    }, '(array of 1 2)')
    seval(2, '((@ 10 20) length)')
    seval(20, '((@ 10 20) 1)')

    seval($.object, 'object')
    seval(function (obj) {
      return obj.x === 1 && obj.y === 2
    }, '(@ x: 1 y: 2)')
    seval(10, '((@ x: 10 y: 20) x)')
    seval(20, '((@ x: 10 y: 20) y)')
    seval(200, '((@ x: 10 y: 20) "y" 200)')

    seval($.class, 'class')
    seval(function (c) {
      return c.type === $.class
    }, '(@:class x: 1 y: 0)')
    seval(function (c) {
      return c.type === $.class
    }, '(class of (@: x: 1 y: 0).')
  }

  function checkAssignment () {
    console.log('\n  - Assignment')
    seval(1, '(let x 1)')
    seval(2, '(let x 1) (let y 2)')
    seval(2, '(let (x y) (@ 1 2). y')
    seval(2, '(let (x y) (@ x: 1 y: 2). y')
    seval(2, '(let * (@ x: 1 y: 2). y')

    seval(1, '(var x 1)')
    seval(2, '(var x 1) (var y 2)')
    seval(2, '(var (x y) (@ 1 2). y')
    seval(2, '(var (x y) (@ x: 1 y: 2). y')
    seval(2, '(var * (@ x: 1 y: 2). y')

    seval(1, '(export x 1)')
    seval(2, '(export x 1) (export y 2)')
    seval(2, '(export (x y) (@ x: 1 y: 2). y')
    seval(2, '(export * (@ x: 1 y: 2). y')
  }

  function checkOperators () {
    console.log('\n  - Operators')
    seval(1, '(? true 1 0)')
    seval(0, '(? false 1 0)')

    seval(110, '(+ 10 100)')
    seval(-110, '(+ -10 -100)')

    seval('10100', '(+ "10" "100")')
    seval('-10-100', '(+ "-10" "-100")')

    seval(1, '(++)')
    seval(-1, '(--)')

    seval(1, '(++ null)')
    seval(-1, '(-- null)')

    seval(1, '(++ 0)')
    seval(-1, '(-- 0)')

    seval(1, '(let x 0)(++ x)x')
    seval(-1, '(let x 0)(-- x)x')

    seval(true, '(1 ?)')
    seval(false, '(0 ?)')
    seval(false, '(null ?)')

    seval(true, '(true ? 1)')
    seval(1, '(false ? 1)')

    seval(1, '(true ? 1 0)')
    seval(0, '(false ? 1 0)')

    seval(0, '(null ?? 0)')
    seval(false, '(false ?? 0)')
    seval(0, '(0 ?? 1)')
    seval('', '("" ?? 1)')
  }

  function checkControl () {
    console.log('\n  - Control')
    seval(0, '(if true 1 0)')
    seval(null, '(if false 1 0)')
    seval(1, '(if true 1 else 0)')
    seval(0, '(if false 1 else 0)')

    seval(10, '(for x in (100 110) (++ i).')
    seval(99, '(while ((++ i) < 100) i)')
    seval(100, '(let i 0)(while ((i ++) < 100) i)')
    seval(100, '(while ((++ i) < 100). i')
    seval(101, '(let i 0)(while ((i ++) < 100). i')
    seval('done', '(while ((++ i) < 100) (if (i == 10) (break "done").')
  }

  function checkOperations () {
    console.log('\n  - Operations')
    seval(21, '(let x 1) (let y 20) (let add (=? (a b) ((a) + (b), (add x y)')

    seval(21, '(let z 100) (let add (= (x y) (x + y z), (add 1 20)')
    seval(21, '(let z 100) (= (1 20): (x y) (x + y z).')

    seval(121, '(let z 100) (let add (=> (x y) (x + y z), (add 1 20)')
    seval(121, '(let z 100) (=> (1 20): (x y) (x + y z).')

    seval(11, '(let summer (@:class add: (= () ((this x) + (this y), (let s (summer of (@ x: 1 y: 10), (s add)')
    seval(11, '(let summer (@:class type: (@ add: (= (x y ) (+ x y), (summer add 1 10)')
  }
}
