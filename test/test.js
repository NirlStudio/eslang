'use strict'

var symbols = Object.create(null)
require('../modules/symbols')(symbols)

module.exports = function ($void) {
  var $ = $void.$
  var print = $void.$print
  var printf = $void.$printf

  var printInColor = function (color) {
    return function (text) {
      printf(text + '\n', color)
    }
  }

  var red = printInColor('red')
  var gray = printInColor('gray')
  var green = printInColor('green')

  var signPassed = function () {
    printf('    ' + symbols.passed + '[PASSED] ', 'green')
  }
  var signFailed = function () {
    printf('    ' + symbols.failed + '[FAILED] ', 'red')
  }

  var passing = 0
  var failing = []

  return function () {
    // check native environment
    print('\n  Checking JavaScript environment')
    checkJavascript()
    checkPolyfill()

    // check sugly runtime.
    checkSuglyRuntime()

    // start to report result
    green('\n  passing: ' + passing)
    if (failing.length < 1) {
      green('\n  Sugly is ready to run.\n')
      return true
    }

    // print failures
    red('  failing: ' + failing.length)
    print('\n  There might be some issues to prevent running sugly')
    for (var i = 0; i < failing.length; i++) {
      red('  - ' + failing[i])
    }
    print()
    return false
  }

  function passed (feature) {
    passing += 1
    signPassed(); gray(feature)
  }

  function failed (feature) {
    failing.push(feature)
    signFailed(); red(feature)
  }

  function checkJavascript () {
    passed('JS is using the space of ' + (global ? 'global.' : 'window.'));
    (typeof Promise === 'undefined' ? failed : passed)('Promise');
    (typeof Object.defineProperty !== 'function' ? failed : passed)('Object.defineProperty')
  }

  function checkPolyfill () {
    var polyfill = require('../lib/polyfill')
    if (polyfill.length > 0) {
      passed('Sugly is using some polyfill functions:')
      var padding = '      - '
      gray(padding + polyfill.join('\n' + padding))
    } else {
      green('      Congratulations! Sugly does not need any polyfill.')
    }
  }

  function checkSuglyRuntime () {
    print('\n  Checking Sugly Runtime ...')
    checkObjects($void, '[Void / Null] ', [
      'null'
    ])

    checkFunctions($void, '[Void / constructors] ', [
      // genesis
      'Type', 'Date', 'Range', 'Symbol', 'Tuple',
      'Iterator', 'Promise',
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
      '`', 'quote', 'unquote',
      'export', 'var', 'let', 'const', 'local', 'locon',
      '?', 'if', 'while', 'in', 'for', 'break', 'continue',
      '+', '++', '--', '!', 'not', '~',
      '@', '=?', '=', '->', '=>', 'redo', 'return', 'exit',
      'import', 'load', 'fetch',
      'debug', 'log'
    ])

    checkObjects($, '[Sugly / types] ', [
      'type',
      'bool', 'string', 'number', 'date', 'range',
      'symbol', 'tuple',
      'operator', 'lambda', 'function',
      'iterator', 'promise',
      'array', 'object', 'class'
    ])

    checkFunctions($, '[Sugly / functions] ', [
      // generic
      'commit', 'commit*', 'commit?',
      // runtime
      'eval',
      // bootstrap
      'tokenizer', 'tokenize', 'compiler', 'compile'
    ])

    checkFunctions($void, '[Sugly / functions] ', [
      // runtime
      '$env', '$run', '$interpreter'
    ])

    checkFunctions($, '[Sugly / lib / functions] ', [
      'max', 'min', 'suglify'
    ])

    checkFunctions($void, '[Sugly / lib / IO functions] ', [
      '$print', '$printf', '$warn'
    ])

    checkObjects($, '[Sugly / lib / objects] ', [
      'uri', 'math', 'json'
    ])

    checkObjects($, '[Sugly / lib / classes] ', [
      'emitter'
    ])

    checkObjects($void, '[Sugly / lib / classes] ', [
      '$timer'
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
    print('\n  -', group)
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
    print('\n  -', group)
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
    print('\n  -', group)
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
    print('\n  - Static type-of')
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
    check('lambda', typeOf($.lambda.noop) === $.lambda)
    check('stambda', typeOf($.lambda.static) === $.lambda)
    check('function', typeOf($.function.empty()) === $.function)
    check('function (generic)', typeOf(function () {}) === $.function)

    check('iterator', typeOf($.iterator.empty) === $.iterator)
    check('promise', typeOf($.promise.empty) === $.promise)

    check('array', typeOf($.array.empty()) === $.array)
    check('array (generic)', typeOf([]) === $.array)

    check('object', typeOf($.object.empty()) === $.object)
    check('object (generic)', typeOf({}) === $.object)

    check('class', typeOf($.class.empty()) === $.class)
  }

  function checkIndexerOf () {
    print('\n  - Static indexer-of')
    var indexerOf = $void.indexerOf

    check('undefined', indexerOf() === $void.null[':'])
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

    check('array', indexerOf($.iterator.empty) === $.iterator.proto[':'])
    check('array', indexerOf($.promise.empty) === $.promise.proto[':'])

    check('array', indexerOf($.array) === $.array[':'])
    check('array: empty', indexerOf($.array.empty()) === $.array.proto[':'])
    check('array: generic', indexerOf([]) === $.array.proto[':'])

    check('object', indexerOf($.object) === $.object[':'])
    check('object: empty', indexerOf($.object.empty()) === $.object.proto[':'])
    check('object: generic', indexerOf({}) === $.object.proto[':'])
  }

  function eval_ (expected, expr, desc) {
    var result = $.eval(expr)
    var success = typeof expected === 'function' ? expected(result) : Object.is(result, expected)
    check(expr || desc, success, success || 'evaluated to a value of ' +
      (typeof result) + ': ' + (result ? result.toString() : result))
  }

  function checkTypes () {
    print('\n  - Primary Types')
    eval_(null, '', '<empty>')
    eval_(null, '()')
    eval_(null, 'null')

    eval_($.type, 'type')

    eval_($.bool, 'bool')
    eval_(true, 'true')
    eval_(false, 'false')

    eval_($.string, 'string')
    eval_($.string.empty, '""')
    eval_('ABC', '"ABC"')
    eval_('ABC', '("ABC")')
    eval_(3, '("ABC" length)')
    eval_('ABCDEF', '("ABC" + "DEF")')

    eval_($.number, 'number')
    eval_(3, '(1 + 2)')
    eval_(-1, '(1 - 2)')
    eval_(2, '(1 * 2)')
    eval_(0.5, '(1 / 2)')

    eval_($.date, 'date')
    eval_(function (d) {
      return d instanceof Date
    }, '(date now)')

    eval_($.range, 'range')
    eval_(function (r) {
      return r.begin === 0 && r.end === 3 && r.step === 1
    }, '(0 3)')
    eval_(function (r) {
      return r.begin === 10 && r.end === 20 && r.step === 2
    }, '(10 20 2)')

    eval_($.symbol, 'symbol')
    eval_(function (s) {
      return s.key === 'x'
    }, '(` x)')

    eval_($.tuple, 'tuple')
    eval_(function (t) {
      var l = t.$
      return t instanceof $void.Tuple && l[0].key === 'x' && l[1] === 1 && l[2] === 'y' && l[3] === true
    }, '(` (x 1 "y" true))')

    eval_($.operator, 'operator')
    eval_(function (s) {
      return s.type === $.operator
    }, '(=? () )')
    eval_(function (s) {
      return s.type === $.operator
    }, '(=? (X Y) (+ (X) (Y).')

    eval_($.lambda, 'lambda')
    eval_(function (s) {
      return s.type === $.lambda
    }, '(= () )')
    eval_(function (s) {
      return s.type === $.lambda
    }, '(= (x y) (+ x y).')

    eval_($.function, 'function')
    eval_(function (s) {
      return s.type === $.function
    }, '(=> () )')
    eval_(function (s) {
      return s.type === $.function
    }, '(=> (x y) (+ x y).')

    eval_($.array, 'array')
    eval_(function (a) {
      return a.length === 2 && a[0] === 1 && a[1] === 2
    }, '(array of 1 2)')
    eval_(2, '((@ 10 20) length)')
    eval_(20, '((@ 10 20) 1)')

    eval_($.object, 'object')
    eval_(function (obj) {
      return obj.x === 1 && obj.y === 2
    }, '(@ x: 1 y: 2)')
    eval_(10, '((@ x: 10 y: 20) x)')
    eval_(20, '((@ x: 10 y: 20) y)')
    eval_(200, '((@ x: 10 y: 20) "y" 200)')

    eval_($.class, 'class')
    eval_(function (c) {
      return c.type === $.class
    }, '(@:class x: 1 y: 0)')
    eval_(function (c) {
      return c.type === $.class
    }, '(class of (@: x: 1 y: 0).')
  }

  function checkAssignment () {
    print('\n  - Assignment')
    eval_(1, '(let x 1)')
    eval_(2, '(let x 1) (let y 2)')
    eval_(2, '(let (x y) (@ 1 2). y')
    eval_(2, '(let (x y) (@ x: 1 y: 2). y')
    eval_(2, '(let * (@ x: 1 y: 2). y')

    eval_(1, '(var x 1)')
    eval_(2, '(var x 1) (var y 2)')
    eval_(2, '(var (x y) (@ 1 2). y')
    eval_(2, '(var (x y) (@ x: 1 y: 2). y')
    eval_(2, '(var * (@ x: 1 y: 2). y')

    eval_(1, '(export x 1)')
    eval_(2, '(export x 1) (export y 2)')
    eval_(2, '(export (x y) (@ x: 1 y: 2). y')
    eval_(2, '(export * (@ x: 1 y: 2). y')
  }

  function checkOperators () {
    print('\n  - Operators')
    eval_(1, '(? true 1 0)')
    eval_(0, '(? false 1 0)')

    eval_(110, '(+ 10 100)')
    eval_(-110, '(+ -10 -100)')

    eval_('10100', '(+ "10" "100")')
    eval_('-10-100', '(+ "-10" "-100")')

    eval_(1, '(++)')
    eval_(-1, '(--)')

    eval_(1, '(++ null)')
    eval_(-1, '(-- null)')

    eval_(1, '(++ 0)')
    eval_(-1, '(-- 0)')

    eval_(1, '(let x 0)(++ x)x')
    eval_(-1, '(let x 0)(-- x)x')

    eval_(true, '(1 ?)')
    eval_(false, '(0 ?)')
    eval_(false, '(null ?)')

    eval_(true, '(true ? 1)')
    eval_(1, '(false ? 1)')

    eval_(1, '(true ? 1 0)')
    eval_(0, '(false ? 1 0)')

    eval_(0, '(null ?? 0)')
    eval_(false, '(false ?? 0)')
    eval_(0, '(0 ?? 1)')
    eval_('', '("" ?? 1)')
  }

  function checkControl () {
    print('\n  - Control')
    eval_(0, '(if true 1 0)')
    eval_(null, '(if false 1 0)')
    eval_(1, '(if true 1 else 0)')
    eval_(0, '(if false 1 else 0)')

    eval_(10, '(for x in (100 110) (++ i).')
    eval_(99, '(while ((++ i) < 100) i)')
    eval_(100, '(let i 0)(while ((i ++) < 100) i)')
    eval_(100, '(while ((++ i) < 100). i')
    eval_(101, '(let i 0)(while ((i ++) < 100). i')
    eval_('done', '(while ((++ i) < 100) (if (i == 10) (break "done").')
  }

  function checkOperations () {
    print('\n  - Operations')
    eval_(21, '(let x 1) (let y 20) (let add (=? (a b) ((a) + (b). (add x y)')

    eval_(21, '(let z 100) (let add (= (x y) (x + y z). (add 1 20)')
    eval_(21, '(let z 100) (= (1 20): (x y) (x + y z).')

    eval_(121, '(let z 100) (let add (=> (x y) (x + y z). (add 1 20)')
    eval_(121, '(let z 100) (=> (1 20): (x y) (x + y z).')

    eval_(11, '(let summer (@:class add: (= () ((this x) + (this y). (let s (summer of (@ x: 1 y: 10). (s add)')
    eval_(11, '(let summer (@:class type: (@ add: (= (x y ) (+ x y). (summer add 1 10)')
  }
}
