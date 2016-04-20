'use strict'

const SymbolContext = Symbol.for('$')

var makeSpace = require('./sugly/space')
var nativelyResolve = require('./sugly/resolver')()

function resolve ($, sym) {
  if (SymbolContext === sym) {
    return $ // $ is always the current space.
  }

  if (typeof $ !== 'object' && typeof $ !== 'function') {
    return null
  }

  var value = $[sym]
  return typeof value !== 'undefined' ? value : nativelyResolve($, sym)
}

function set (subject, sym, value) {
  if (typeof subject !== 'object' && typeof subject !== 'function') {
    return null
  }

  subject[sym] = value
  return value
}

function getter (subject, key) {
  if (typeof subject !== 'object' && typeof subject !== 'function') {
    return null
  }

  if (typeof key === 'string') {
    key = Symbol.for(key)
  }

  var value = subject[key]
  if (typeof value !== 'undefined') {
    return value
  }

  if (typeof key === 'symbol') {
    return nativelyResolve(subject, key)
  }
  return null
}

const SymbolIndexer = Symbol.for(':')

function indexer (key, value) {
  if (key === null) {
    return null
  }
  // getting value
  if (typeof value === 'undefined') {
    return getter(this, key)
  }

  // setting property
  if (typeof key === 'string') {
    return set(this, Symbol.for(key), value)
  }
  if (typeof key === 'symbol') {
    return set(this, key, value)
  }

  // general operation - TODO - type filtering?
  try {
    this[key] = value
  } catch (err) {
    console.error('Indexer/set error', err, key, value)
    return null
  }
}

function SuglySignal (type, value) {
  this.type = type
  this.value = value
}

function seval (clause, $) {
  if (!Array.isArray(clause)) {
    // not a clause.
    if (typeof clause === 'symbol') {
      return resolve($, clause)
    } else {
      return clause // immediate value.
    }
  }

  var length = clause.length
  if (length < 1) {
    return null // empty clause
  }

  var subject = clause[0]
  // intercept subject
  if (typeof subject === 'symbol') {
    if ($.$operators.hasOwnProperty(subject)) {
      return $.$operators[subject]($, clause)
    }
    if (subject === SymbolContext) {
      subject = $ // shortcut
    } else {
      subject = resolve($, subject)
    }
  } else if (Array.isArray(subject)) {
    subject = seval(subject, $)
  }

  if (subject === null) {
    return null // short circuit - ignoring arguments
  }

  // with only subject, take the value of subject as another clause.
  if (length < 2) {
    return seval(subject, $)
  }

  // predicate exists.
  var predicate = clause[1]
  if (Array.isArray(predicate)) {
    predicate = seval(predicate, $)
  }

  var func
  switch (typeof predicate) {
    case 'string': // an immediate string indicating get/set command.
      var sym = Symbol.for(predicate)
      return length > 2 ? set(subject, sym, seval(clause[2], $)) : resolve(subject, sym)

    case 'symbol':
      func = resolve(subject, predicate)
      if (!func && predicate === SymbolIndexer) {
        func = indexer // overridable indexer
      } else if (typeof func !== 'function') {
        return func
      }
      break

    case 'function':
      func = predicate
      break

    default:
      // short circuit - other type of value type will be evaluated to itself.
      return predicate
  }

  // evaluate arguments.
  var max = func.fixedArgs ? func.params.length + 2 : length
  if (max > length) {
    max = length
  }
  var args = []
  for (var i = 2; i < max; i++) {
    var expr = clause[i]
    // accelerate evaluation.
    if (Array.isArray(expr)) {
      args.push(seval(expr, $))
    } else if (typeof expr === 'symbol') {
      args.push(resolve($, expr))
    } else {
      args.push(expr)
    }
  }

  // execute the clause.
  try {
    return func.apply(subject, args)
  } catch (signal) {
    if (signal instanceof SuglySignal) {
      if (signal.type === 'return') {
        return signal.value
      }
      throw signal // ingore unexpected signal
    }
    // TODO - filter & swallow some native errors?
    throw signal
  }
}

var $operators = {}

const SymbolQuote = Symbol.for('`')

$operators[SymbolQuote] = function ($, clause) {
  var length = clause.length
  switch (length) {
    case 1:
      return null
    case 2:
      let c1 = clause[1]
      return Array.isArray(c1) ? [c1] : c1
    default:
      return clause.slice(1)
  }
}

// a more readable version of `
$operators[Symbol.for('quote')] = $operators[SymbolQuote]

// (let var value) or (let (var value) ...)
$operators[Symbol.for('let')] = function $let ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var c1 = clause[1]
  // (let symbol value)
  if (typeof c1 === 'symbol') {
    if (length < 3) {
      return set($, c1, null)
    }

    // accelerate evaluation.
    let c2 = clause[2]
    if (Array.isArray(c2)) {
      return set($, c1, seval(c2, $))
    } else if (typeof c2 === 'symbol') {
      return set($, c1, resolve($, c2))
    } else {
      return set($, c1, c2)
    }
  } else if (!Array.isArray(c1)) {
    return null
  }

  // (let (symbol value) ...)
  var last = null
  for (var i = 1; i < length; i++) {
    var pair = clause[i]
    if (Array.isArray(pair) && pair.length > 1) {
      let p0 = pair[0]
      if (typeof p0 === 'symbol') {
        let p1 = pair[1]
        // accelerate evaluation.
        if (Array.isArray(p1)) {
          last = set($, p0, seval(p1, $))
        } else if (typeof clause === 'symbol') {
          last = set($, p0, resolve($, p1))
        } else {
          last = set($, p0, p1)
        }
        continue
      }
    }
    last = null
  }
  return last
}

// (@ prop: value ...)
function objectCreate ($, clause) {
  var obj = $.object()
  var i = 2
  var length = clause.length
  while (i < length && clause[i] === SymbolIndexer) {
    var key = clause[i - 1]
    if (typeof key === 'string') {
      key = Symbol.for(key)
    } else if (typeof key !== 'symbol') {
      break
    }

    i += 1
    let value = null
    if (i < length) {
      let expr = clause[i]
      if (Array.isArray(expr)) {
        value = seval(expr, $)
      } else if (typeof expr === 'symbol') {
        value = resolve($, expr)
      } else {
        value = expr
      }
    }
    obj[key] = value
    i += 2 // next :
  }
  return obj
}

// (@ obj < prop: value ...)
function objectAssign ($, clause) {
  var obj = clause[1]
  if (typeof obj === 'symbol') {
    obj = resolve($, obj)
  } else if (Array.isArray(obj)) {
    obj = seval(obj, $)
  }
  if (!obj && typeof obj !== 'object' && typeof obj !== 'function') {
    return null
  }

  var i = 4
  var length = clause.length
  while (i < length && clause[i] === SymbolIndexer) {
    var key = clause[i - 1]
    if (typeof key === 'string') {
      key = Symbol.for(key)
    } else if (typeof key !== 'symbol') {
      break
    }

    i += 1
    let value = null
    if (i < length) {
      let expr = clause[i]
      if (Array.isArray(expr)) {
        value = seval(expr, $)
      } else if (typeof expr === 'symbol') {
        value = resolve($, expr)
      } else {
        value = expr
      }
    }
    obj[key] = value
    i += 2 // next :
  }
  return obj
}

// (@ optional-prototype > prop: value ...).
function objectDerive ($, clause) {
  var prototype, i
  if (clause[1] === SymbolDerive) {
    prototype = null
    i = 3
  } else {
    prototype = clause[1]
    i = 4
    if (typeof prototype === 'symbol') {
      prototype = resolve($, prototype)
    } else if (Array.isArray(prototype)) {
      prototype = seval(prototype, $)
    }
    if (typeof prototype !== 'object') {
      return null // non-object cannot derive an object.
    }
  }

  var obj = $.object(prototype)
  var length = clause.length
  while (i < length && clause[i] === SymbolIndexer) {
    var key = clause[i - 1]
    if (typeof key === 'string') {
      key = Symbol.for(key)
    } else if (typeof key !== 'symbol') {
      break
    }

    i += 1
    let value = null
    if (i < length) {
      let expr = clause[i]
      if (Array.isArray(expr)) {
        value = seval(expr, $)
      } else if (typeof expr === 'symbol') {
        value = resolve($, expr)
      } else {
        value = expr
      }
    }
    obj[key] = value
    i += 2 // next :
  }
  return obj
}

// (@ value ...)
function arrayCreate ($, clause) {
  var result = []
  var i = 1
  while (i < clause.length) {
    let expr = clause[i]
    if (typeof expr === 'symbol') {
      result.push(resolve($, expr))
    } else if (Array.isArray(expr)) {
      result.push(seval(expr, $))
    } else {
      result.push(expr)
    }
    i += 1
  }
  return result
}

const SymbolAssign = Symbol.for('<')
const SymbolDerive = Symbol.for('>')
const SymbolObject = Symbol.for('@')

$operators[SymbolObject] = function ($, clause) {
  var length = clause.length
  if (length > 2) {
    let sym = clause[2]
    if (sym === SymbolIndexer) {
      return objectCreate($, clause)
    }
    if (sym === SymbolAssign) {
      return objectAssign($, clause)
    }
    if (sym === SymbolDerive) {
      return objectDerive($, clause)
    }
  } else if (length === 2 && clause[1] === SymbolDerive) {
    // (@> prop: value ...) is allowed.
    // (@>) to be used to represent an empty object.
    return objectDerive($, clause)
  }
  return arrayCreate($, clause)
}

// as operators, object and array are the readable version of @
$operators[Symbol.for('object')] = function ($, clause) {
  if (clause.length < 2) {
    return $.object()
  }
  return $operators[SymbolObject]($, clause)
}
// force to create an array
$operators[Symbol.for('array')] = function ($, clause) {
  return arrayCreate($, clause)
}

// (= symbols > params body ...)
// symbols can be symbol or (symbol ...) or (@ prop: value ...)
function lambdaCreate ($, symbols, params, body) {
  if (typeof symbols === 'symbol') {
    return $.lambda(resolve($, symbols), params, body)
  }

  if (!Array.isArray(symbols)) {
    return null // invalid expression
  }

  if (symbols.length < 1) {
    return $.lambda({}, params, body)
  }

  // enclosing context values.
  var enclosing
  if (symbols[0] === SymbolObject) {
    // it should be an object expression: (@ prop: value ...)
    let obj = seval(symbols, $)
    if (typeof obj === 'object' && obj !== null) {
      enclosing = obj
    } else {
      enclosing = {}
    }
  } else {
    // it should be an symbol list: (sym ...)
    enclosing = {}
    for (let i = 0; i < symbols.length; i++) {
      let s = symbols[i]
      if (typeof s === 'symbol') {
        enclosing[s] = resolve($, s)
      }
    }
  }

  return $.lambda(enclosing, params, body)
}

const SymbolLambdaShort = SymbolDerive

$operators[Symbol.for('=')] = function ($, clause) {
  if (clause.length < 3) {
    return null
  }

  if (clause[1] === SymbolDerive) {
    // (= > params body)
    if (clause.length < 4) {
      return null
    }
    return lambdaCreate($, [], clause[2], clause.slice(3))
  }

  if (clause[2] === SymbolLambdaShort) {
    // (= enclosing > params body)
    if (clause.length < 5) {
      return null
    }
    return lambdaCreate($, clause[1], clause[3], clause.slice(4))
  }

  // (= param body ...)
  return $.function(clause[1], clause.slice(2))
}

// operator function and closure are more readable aliases of '='
$operators[Symbol.for('function')] = $operators[Symbol.for('=')]
$operators[Symbol.for('closure')] = $operators[Symbol.for('=')]

const SymbolLambda = Symbol.for('=>')
// (=> params body)
$operators[SymbolLambda] = function ($, clause) {
  if (clause.length < 3) {
    return null
  }
  return lambdaCreate($, [], clause[1], clause.slice(2))
}

function createSignalOf (type) {
  return function createSignal ($, clause) {
    var length = clause.length
    var result = null
    if (length > 1) {
      var c1 = clause[1]
      if (length === 2) {
        // return the only argument directly
        if (Array.isArray(c1)) {
          result = seval(c1, $)
        } else if (typeof c1 === 'symbol') {
          result = resolve($, c1)
        } else {
          result = c1
        }
      } else {
        // return multiple arguments in an array.
        result = []
        for (var i = 1; i < length; i++) {
          let ci = clause[i]
          if (Array.isArray(ci)) {
            result.push(seval(ci, $))
          } else if (typeof ci === 'symbol') {
            result.push(resolve($, ci))
          } else {
            result.push(ci)
          }
        }
      }
    }
    throw new SuglySignal(type, result)
  }
}

// operator lambda is a more readable version of '=>'
$operators[Symbol.for('lambda')] = $operators[Symbol.for('=>')]

// leave function or module.
$operators[Symbol.for('return')] = createSignalOf('return')
// leave a module or an event callback
$operators[Symbol.for('exit')] = createSignalOf('exit')
// request to quit the whole application.
$operators[Symbol.for('halt')] = createSignalOf('halt')

$operators[Symbol.for('is')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return true
  }

  var left = clause[1]
  if (typeof left === 'symbol') {
    left = resolve($, left)
  } else if (Array.isArray(left)) {
    left = seval(left, $)
  }
  if (length < 3) {
    return left === null
  }

  var right = clause[2]
  if (typeof right === 'symbol') {
    right = resolve($, right)
  } else if (Array.isArray(right)) {
    right = seval(right, $)
  }
  return Object.is(left, right)
}

// typeof: query base type name, test a value, check object's prototype chain
$operators[Symbol.for('typeof')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return 'null'
  }

  var value = clause[1]
  if (typeof value === 'symbol') {
    value = resolve($, value)
  } else if (Array.isArray(value)) {
    value = seval(value, $)
  }

  if (length < 3) {
    if (value === null) {
      return 'null'
    }
    if (Array.isArray(value)) {
      return 'array'
    }
    if (value instanceof Date) {
      return 'date'
    }
    return typeof value
  }

  var expected = clause[2]
  if (typeof expected === 'symbol') {
    expected = resolve($, expected)
  } else if (Array.isArray(expected)) {
    expected = seval(expected, $)
  }

  if (typeof expected === 'string') {
    switch (expected) {
      case 'null':
        return value === null
      case 'bool':
        return typeof value === 'boolean'
      case 'number':
        return typeof value === 'number'
      case 'string':
        return typeof value === 'string'
      case 'symbol':
        return typeof value === 'number'
      case 'function':
        return typeof value === 'function'
      case 'object':
        return typeof value === 'object'
      /* array and date are also objects */
      case 'array':
        return Array.isArray(value)
      case 'date':
        return value instanceof Date // Would frame-boundary be a problem?
      default:
        return false // unknow type name
    }
  } else if (typeof expected === 'object' && typeof value === 'object') {
    var last = null
    while (last !== value && value) {
      last = value
      value = Object.getPrototypeOf(value)
      if (value === expected) {
        return true
      }
    }
  }
  return false
}

// generic type operators being identical with the function version.
$operators[Symbol.for('null')] = function ($, clause) {
  return null
}

const SymbolBool = Symbol.for('bool')
$operators[SymbolBool] = function ($, clause) {
  return $[SymbolBool](clause.length < 2 ? undefined : seval(clause[1], $))
}

const SymbolNumber = Symbol.for('number')
$operators[SymbolNumber] = function ($, clause) {
  return clause.length < 2 ? 0 : $[SymbolNumber](seval(clause[1], $))
}

const SymbolString = Symbol.for('string')
$operators[SymbolString] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return ''
  }

  var values = []
  for (var i = 1; i < length; i++) {
    values.push(seval(clause[i], $))
  }
  return $[SymbolString].apply($, values)
}

const SymbolSymbol = Symbol.for('symbol')
$operators[SymbolSymbol] = function ($, clause) {
  return clause.length < 2 ? null : $[SymbolSymbol](seval(clause[1], $))
}

const SymbolDate = Symbol.for('date')
$operators[SymbolDate] = function ($, clause) {
  return $[SymbolDate](clause.length < 2 ? 0 : seval(clause[1], $))
}

const SymbolElse = Symbol.for('else')

$operators[Symbol.for('if')] = function ($, clause) {
  var length = clause.length
  if (length < 3) {
    return null // short circuit - the result will be null anyway.
  }

  // look for else
  var cond, tb, fb
  var offset = clause.indexOf(SymbolElse, 1)
  if (offset > 0) {
    if (offset === 1) {
      return null // short circuit - the cond is required.
    }
    cond = clause[1]
    tb = clause.slice(2, offset)
    fb = clause.slice(offset + 1)
  } else {
    cond = clause[1]
    tb = length > 2 ? [clause[2]] : []
    fb = length > 3 ? clause.slice(3) : []
  }

  if (typeof cond === 'symbol') {
    cond = resolve($, cond)
  } else if (Array.isArray(cond)) {
    cond = seval(cond, $)
  }

  var option = cond !== false && cond !== null && cond !== 0 ? tb : fb
  if (option.length < 1) {
    return null
  }
  if (option.length === 1) {
    option = option[0]
    if (typeof option === 'symbol') {
      return resolve($, option)
    } else if (Array.isArray(option)) {
      return seval(option, $)
    }
    return option
  }

  return beval($, option)
}

function createLoopSignal (type) {
  var signal = createSignalOf(type)
  return function loopSignal ($, clause) {
    if ($.$loops.length > 0) {
      signal($, clause)
    }
    return null // not in loop.
  }
}

$operators[Symbol.for('break')] = createLoopSignal('break')
$operators[Symbol.for('continue')] = createLoopSignal('continue')

function loopTest ($, cond) {
  // loop test function returns a BREAK flag
  if (typeof cond === 'symbol') {
    return function loopTestOfSymbol () {
      var value = resolve($, cond)
      return value === false || value === null || value === 0
    }
  }

  if (Array.isArray(cond)) {
    return function loopTestOfClause () {
      var value = seval(cond, $)
      return value === false || value === null || value === 0
    }
  }

  return cond === false || cond === null || cond === 0
}

$operators[Symbol.for('while')] = function ($, clause) {
  var length = clause.length
  if (length < 3) {
    return null // short circuit - no loop body
  }

  var test = loopTest($, clause[1])
  var dynamicTest = typeof test === 'function'

  var body = clause.slice(2)
  var result = null
  $.$loops.push(test)
  while (true) {
    try { // break/continue can be used in condition expression.
      if (dynamicTest ? test() : test) {
        break
      }
      result = beval($, body)
    } catch (signal) {
      if (signal instanceof SuglySignal) {
        if (signal.type === 'continue') {
          result = signal.value
          continue
        }
        if (signal.type === 'break') {
          result = signal.value
          break
        }
      }
      $.$loops.pop()
      throw signal
    }
  }
  $.$loops.pop()
  return result
}

$operators[Symbol.for('for')] = function ($, clause) {
  var length = clause.length
  if (length < 4) {
    return null // short circuit - no loop body
  }

  var test = loopTest($, clause[1])
  var dynamicTest = typeof test === 'function'

  var step = clause[2]
  var runStep = Array.isArray(step)

  var body = clause.slice(3)
  var result = null
  $.$loops.push(test)
  while (true) {
    try { // break/continue can be used in condition expression.
      if (dynamicTest ? test() : test) {
        break
      }
      result = beval($, body)
      if (runStep) {
        seval(step, $)
      }
    } catch (signal) {
      if (signal instanceof SuglySignal) {
        if (signal.type === 'continue') {
          result = signal.value
          if (runStep) {
            seval(step, $)
          }
          continue
        }
        if (signal.type === 'break') {
          result = signal.value
          break
        }
      }
      $.$loops.pop()
      throw signal
    }
  }
  $.$loops.pop()
  return result
}

const SymbolFlow = Symbol.for('->')
// (-> clause sub-clause1 sub-clause2 ...).
$operators[SymbolFlow] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }
  var subject = seval(clause[1], $)
  for (var i = 2; subject !== null && i < length; i++) {
    var next = clause[i]
    var stmt = [subject]
    if (Array.isArray(next)) {
      stmt.push.apply(stmt, next)
    } else {
      stmt.push(next)
    }
    subject = seval(stmt, $)
  }
  return subject
}
$operators[Symbol.for('flow')] = $operators[SymbolFlow]

const SymbolPipe = Symbol.for('|')
// (| clause1 clause2 ... )
$operators[SymbolPipe] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }
  var output = seval(clause[1], $)
  for (var i = 2; i < length; i++) {
    var next = clause[i]
    var stmt = Array.isArray(next) ? next.slice(0) : [next]
    if (Array.isArray(output)) {
      // expand array to arguments
      for (var j = 0; j < output.length; j++) {
        var value = output[j]
        var arg
        if (Array.isArray(value)) {
          // value to expression
          arg = [SymbolObject]
          arg.push.apply(arg, value)
        } else if (typeof value === 'symbol') {
          arg = [SymbolQuote, value] // symbol to quote
        } else {
          arg = value
        }
        stmt.push(arg)
      }
    } else {
      stmt.push(output)
    }
    output = seval(stmt, $)
  }
  return output
}
$operators[Symbol.for('pipe')] = $operators[SymbolPipe]

const SymbolPremise = Symbol.for('?')
const SymbolThen = Symbol.for('then')
const SymbolNext = Symbol.for('next')
// (? entry cb1 cb2 ...) - reversed pipe
$operators[SymbolPremise] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }
  var offset = length - 1
  var output = seval(clause[offset], $)
  for (offset -= 1; offset > 0; offset--) {
    var pre = clause[offset]
    var stmt = Array.isArray(pre) ? pre.slice(0) : [pre]
    if (stmt[0] === SymbolThen) {
      // (then params body) to (=> next > params body)
      stmt.splice(0, 1, SymbolLambda, SymbolNext, SymbolLambdaShort)
      stmt = [SymbolContext, stmt]
    }
    if (Array.isArray(output)) {
      // expand array result
      for (var i = 0; i < output.length; i++) {
        var value = output[i]
        var arg
        if (Array.isArray(value)) {
          // value to expression
          arg = [SymbolObject]
          arg.push.apply(arg, value)
        } else if (typeof value === 'symbol') {
          arg = [SymbolQuote, value] // symbol to quote
        } else {
          arg = value
        }
        stmt.push(arg)
      }
    } else {
      stmt.push(output)
    }
    output = seval(stmt, $)
  }
  return output
}
$operators[Symbol.for('premise')] = $operators[SymbolPremise]

function populateOperatorCtx (operands, ctx) {
  var oprdc = operands.length
  ctx[Symbol.for('OPRDC')] = oprdc
  for (var i = 0; i < 10; i++) {
    ctx[Symbol.for('OPRD' + i)] = i < oprdc ? operands[i] : null
  }
}

// app defined operator: (operator name clause ...)
$operators[Symbol.for('operator')] = function ($, impl) {
  if ($.moduleSpaceIdentifier !== $.spaceIdentifier) {
    return null // operator can only be defined in module scope
  }

  // copy operators directory to current module
  if (!$.hasOwnProperty('$operators')) {
    $.$operators = Object.assign({}, $.$operators)
  }

  var length = impl.length
  if (length < 2 || typeof impl[1] !== 'symbol') {
    return null
  }

  var name = impl[1]
  var statements = impl.slice(1)

  $.$operators[name] = function $OPR (ctx, clause) {
    var oprds = clause.slice(1)
    var oprStack = ctx.$OprStack

    oprStack.push(oprds)
    populateOperatorCtx(oprds, ctx)
    var value = null
    try {
      for (var i = 0; i < statements.length; i++) {
        value = seval(statements[i], ctx)
      }
      return value
    } catch (signal) {
      oprStack.pop()
      if (oprStack.length > 1) {
        populateOperatorCtx(ctx, oprStack[oprStack.length - 1])
      }
      throw signal
    }
  }
  return null
}

function plus ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = clause[1]
  if (typeof result === 'symbol') {
    result = resolve($, result)
  } else if (Array.isArray(result)) {
    result = seval(result, $)
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      result += resolve($, value)
    } else if (Array.isArray(value)) {
      result += seval(value, $)
    } else {
      result += value
    }
  }
  return result
}

$operators[Symbol.for('+')] = plus
$operators[Symbol.for('+=')] = function ($, clause) {
  var result = plus($, clause)
  var sym = clause[1]
  if (typeof sym === 'symbol') {
    $[sym] = result
  }
  return result
}

function minus ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = clause[1]
  if (typeof result === 'symbol') {
    result = resolve($, result)
  } else if (Array.isArray(result)) {
    result = seval(result, $)
  }
  if (typeof result !== 'number') {
    return 0
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (typeof value === 'number') {
      result -= value
    }
  }
  return result
}

$operators[Symbol.for('-')] = minus
$operators[Symbol.for('-=')] = function ($, clause) {
  var result = minus($, clause)
  var sym = clause[1]
  if (typeof sym === 'symbol') {
    $[sym] = result
  }
  return result
}

function times ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = clause[1]
  if (typeof result === 'symbol') {
    result = resolve($, result)
  } else if (Array.isArray(result)) {
    result = seval(result, $)
  }
  if (typeof result !== 'number') {
    return 0
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (typeof value === 'number') {
      result *= value
    }
  }
  return result
}

$operators[Symbol.for('*')] = times
$operators[Symbol.for('*=')] = function ($, clause) {
  var result = times($, clause)
  var sym = clause[1]
  if (typeof sym === 'symbol') {
    $[sym] = result
  }
  return result
}

function divide ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = clause[1]
  if (typeof result === 'symbol') {
    result = resolve($, result)
  } else if (Array.isArray(result)) {
    result = seval(result, $)
  }
  if (typeof result !== 'number') {
    return 0
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (typeof value === 'number') {
      result /= value
    }
  }
  return result
}

$operators[Symbol.for('/')] = divide
$operators[Symbol.for('/=')] = function ($, clause) {
  var result = divide($, clause)
  var sym = clause[1]
  if (typeof sym === 'symbol') {
    $[sym] = result
  }
  return result
}

$operators[Symbol.for('++')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return 1
  }

  var sym = clause[1]
  if (typeof sym === 'symbol') {
    let value = resolve($, sym)
    if (typeof value === 'number') {
      value += 1
    } else {
      value = 1
    }
    $[sym] = value
    return value
  }

  if (Array.isArray(sym)) {
    sym = seval($, sym)
  }
  return typeof sym === 'number' ? sym + 1 : 1
}

$operators[Symbol.for('--')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return -1
  }

  var sym = clause[1]
  if (typeof sym === 'symbol') {
    let value = resolve($, sym)
    if (typeof value === 'number') {
      value -= 1
    } else {
      value = -1
    }
    $[sym] = value
    return value
  }

  if (Array.isArray(sym)) {
    sym = seval($, sym)
  }
  return typeof sym === 'number' ? sym - 1 : -1
}

$operators[Symbol.for('==')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return true // null === null
  }

  var base = clause[1]
  if (typeof base === 'symbol') {
    base = resolve($, base)
  } else if (Array.isArray(base)) {
    base = seval(base, $)
  }
  if (length < 3) {
    return base === null
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (base !== value) {
      return false
    }
  }
  return true
}

$operators[Symbol.for('!=')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null !== null
  }

  var base = clause[1]
  if (typeof base === 'symbol') {
    base = resolve($, base)
  } else if (Array.isArray(base)) {
    base = seval(base, $)
  }
  if (length < 3) {
    return base !== null
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (base !== value) {
      return true
    }
  }
  return false
}

$operators[Symbol.for('>')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null === null
  }

  var left = clause[1]
  if (typeof left === 'symbol') {
    left = resolve($, left)
  } else if (Array.isArray(left)) {
    left = seval(left, $)
  }
  if (length < 3) {
    return true
  }

  var right = clause[2]
  if (typeof right === 'symbol') {
    right = resolve($, right)
  } else if (Array.isArray(right)) {
    right = seval(right, $)
  }

  return left > right
}

$operators[Symbol.for('>=')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null === null
  }

  var left = clause[1]
  if (typeof left === 'symbol') {
    left = resolve($, left)
  } else if (Array.isArray(left)) {
    left = seval(left, $)
  }
  if (length < 3) {
    return true
  }

  var right = clause[2]
  if (typeof right === 'symbol') {
    right = resolve($, right)
  } else if (Array.isArray(right)) {
    right = seval(right, $)
  }

  return left >= right
}

$operators[Symbol.for('<')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null === null
  }

  var left = clause[1]
  if (typeof left === 'symbol') {
    left = resolve($, left)
  } else if (Array.isArray(left)) {
    left = seval(left, $)
  }
  if (length < 3) {
    return false
  }

  var right = clause[2]
  if (typeof right === 'symbol') {
    right = resolve($, right)
  } else if (Array.isArray(right)) {
    right = seval(right, $)
  }

  return left < right
}

$operators[Symbol.for('<=')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null === null
  }

  var left = clause[1]
  if (typeof left === 'symbol') {
    left = resolve($, left)
  } else if (Array.isArray(left)) {
    left = seval(left, $)
  }
  if (length < 3) {
    return false
  }

  var right = clause[2]
  if (typeof right === 'symbol') {
    right = resolve($, right)
  } else if (Array.isArray(right)) {
    right = seval(right, $)
  }

  return left <= right
}

$operators[Symbol.for('&&')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var base = clause[1]
  if (typeof base === 'symbol') {
    base = resolve($, base)
  } else if (Array.isArray(base)) {
    base = seval(base, $)
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (value === false || value === null || value === 0) {
      return value
    } else {
      base = value
    }
  }
  return base
}

$operators[Symbol.for('||')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var base = clause[1]
  if (typeof base === 'symbol') {
    base = resolve($, base)
  } else if (Array.isArray(base)) {
    base = seval(base, $)
  }
  if (base !== false && base !== null && base !== 0) {
    return base
  }

  for (var i = 2; i < length; i++) {
    let value = clause[i]
    if (typeof value === 'symbol') {
      value = resolve($, value)
    } else if (Array.isArray(value)) {
      value = seval(value, $)
    }
    if (value !== false && value !== null && value !== 0) {
      return value
    } else {
      base = value
    }
  }
  return base
}

$operators[Symbol.for('!')] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return true // !null
  }

  var base = clause[1]
  if (typeof base === 'symbol') {
    base = resolve($, base)
  } else if (Array.isArray(base)) {
    base = seval(base, $)
  }
  return base === false || base === null || base === 0
}

function beval ($, clauses) {
  var result = null
  for (var i = 0; i < clauses.length; i++) {
    result = seval(clauses[i], $)
  }
  return result
}

const SymbolRepeat = Symbol.for('*')

// param or (param ...) or ((param value) ...)
function formatParameters (params) {
  var formatted = [true] // eliminate unwanted arguments.
  if (typeof params === 'undefined' || params === null) {
    return formatted
  }

  if (typeof params === 'symbol') {
    params = [params] // single parameter
  } else if (!Array.isArray(params)) {
    return formatted
  }

  for (var i = 0; i < params.length; i++) {
    let p = params[i]
    if (typeof p === 'symbol') {
      if (p === SymbolRepeat) {
        formatted[0] = false // variant arguments
        break // the repeat indicator is always the last one
      }
      formatted.push([p, null])
    } else if (Array.isArray(p)) {
      if (p.length < 1) {
        continue
      }
      let sym = p[0]
      if (typeof sym === 'symbol') {
        formatted.push([sym, p.length > 1 ? p[1] : null]) // no evaluation.
      }
    }
  }
  return formatted
}

const SymbolThis = Symbol.for(':') // TODO - [experimental] any potential conflict with indexer?
const SymbolArgc = Symbol.for('argc')
const SymbolArgv = Symbol.for('argv')

function $functionIn ($) {
  var createSpace = $.createSpace

  // body must be a list of clauses
  return function $function (params, body) {
    if (!Array.isArray(body) || body.length < 1) {
      return null // no function body
    }

    params = formatParameters(params)
    var fixedArgs = params.shift()

    var f = function $F () {
      var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments))
      // new namespace
      var ns = createSpace($)
      ns[SymbolThis] = this
      if (!fixedArgs) {
        ns[SymbolArgc] = args.length
        ns[SymbolArgv] = args
      }

      // binding arguments with default values
      for (var i = 0; i < params.length; i++) {
        var p = params[i]
        ns[p[0]] = args.length > i ? args[i] : p[1]
      }
      return beval(ns, body)
    }

    f.fixedArgs = fixedArgs
    f.params = params
    f.body = body
    return f
  }
}

function createClosure ($, enclosing, params, fixedArgs, body) {
  var createSpace = $.createSpace

  function $C () {
    var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
    // new namespace
    var ns = createSpace($)
    ns[SymbolThis] = this
    Object.assign(ns, enclosing)

    // variant arguments
    if (!fixedArgs) {
      ns[SymbolArgc] = args.length
      ns[SymbolArgv] = args
    }

    // aguments or parameter default values can overrride enclosed values.
    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      ns[p[0]] = args.length > i ? args[i] : p[1]
    }
    return beval(ns, body)
  }

  $C.enclosing = enclosing
  $C.fixedArgs = fixedArgs
  $C.params = params
  $C.body = body
  return $C
}

function createLambda ($, enclosing, params, body) {
  function $L () {
    var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)

    enclosing = Object.assign({}, enclosing)
    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      enclosing[p[0]] = args.length > i ? args[i] : p[1]
    }

    return $.lambda(enclosing, body[1], body.slice(2))
  }

  $L.enclosing = enclosing
  $L.fixedArgs = true
  $L.params = params
  $L.body = body
  return $L
}

function $lambdaIn ($) {
  return function $lambda (enclosing, params, body) {
    if (!Array.isArray(body) || body.length < 1) {
      return null // no function body
    }

    if (typeof enclosing !== 'object' || enclosing === null) {
      enclosing = {}
    }

    params = formatParameters(params)
    var fixedArgs = params.shift()

    if (body[0] === SymbolLambdaShort) {
      return createLambda($, enclosing, params, body)
    } else {
      return createClosure($, enclosing, params, fixedArgs, body)
    }
  }
}

// generate an export function for $.
function $exportTo ($) {
  return function $export (key, value) {
    if (typeof key === 'string') {
      key = Symbol.for(key)
    } else if (typeof key !== 'symbol') {
      return null
    }
    return set($, key, typeof value === 'undefined' ? null : value)
  }
}

global.spaceCounter = 0

function $createSpaceIn ($) {
  return function $createSpace (parent, sealing) {
    var space = Object.create(parent || $)
    $.$spaceCounter += 1
    space.spaceIdentifier = 'space-' + $.$spaceCounter
    if (sealing) {
      // overridding parent.export
      space.$export('export', $exportTo(space))
    }
    space.$loops = [] // new loop stack
    return space
  }
}

function $createModuleSpaceIn ($) {
  var createSpace = $.createSpace

  return function $createModuleSpace (parent, sealing) {
    if (parent) {
      parent = verifySpace(parent)
    }
    var space = createSpace(parent || $, sealing)
    space.moduleSpaceIdentifier = space.spaceIdentifier

    // isolate global/root space
    space.$export('createSpace', function (parent, sealing) {
      parent = verifySpace(parent)
      return $.createSpace(parent || space, sealing)
    })

    // isolate function & lambda to the most recent module
    space.$export('function', $functionIn(space))
    space.$export('lambda', $lambdaIn(space))

    space.$OprStack = []
    return space
  }
}

function verifySpace (space) {
  if (!space || typeof space !== 'object') {
    return null
  }
  if (!space.$operators || !space.$loops || !space.$OprStack) {
    return null
  }
  return space
}

function $execIn ($) {
  var compile = $.compile
  var createModuleSpace = $.createModuleSpace

  return function $exec (code, source, space) {
    var program = compile(code, source || '?')
    var result
    try {
      result = beval(space || createModuleSpace(), program)
    } catch (signal) {
      if (signal instanceof SuglySignal &&
         (signal.type === 'return' || signal.type === 'exit')) {
        result = signal.value
      } else {
        throw signal
      }
    }
    return result
  }
}

function $runIn ($) {
  var load = $.load
  var exec = $.$exec

  return function $run (source, space) {
    space = verifySpace(space)
    return exec(load(source), load.normalize(source), space)
  }
}

function importJSModule ($, name) {
  try {
    return require(name)
  } catch (err) {
    $.console.error('failed to load JS moudle: ' + name)
    return null
  }
}

function $requireIn ($) {
  var load = $.load
  var modules = $.$modules
  var run = $.run
  var createModuleSpace = $.createModuleSpace

  return function $require (source, type) {
    if (type === 'js') {
      return importJSModule($, source)
    }

    var uri = load.normalize(source)
    if (modules.hasOwnProperty(uri)) {
      return modules[uri]
    }

    var result = run(source, createModuleSpace())
    if (typeof result !== 'object' && typeof result !== 'function') {
      result = {
        value: result
      }
    }
    if (!result.timestamp) {
      result.timestamp = Date.now()
    }

    modules[uri] = result
    return result
  }
}

function populate ($) {
  $.$operators = Object.assign({}, $operators)

  // global function & lambda generator.
  $.$export('function', $functionIn($))
  $.$export('lambda', $lambdaIn($))

  // evaluate a symbol or a clause, or return the value itself.
  $.$export('eval', function (expr, space) {
    space = verifySpace(space)
    return seval(expr, space || this)
  })

  // evaluate a series of clauses.
  $.$export('beval', function (clauses, space) {
    space = verifySpace(space)
    return Array.isArray(clauses) ? beval(space || this, clauses) : null
  })

  // allow to export to root space.
  $.$export('export', $exportTo($))

  // create a child space from an optional parent one. - the inner version
  $.$export('createSpace', $createSpaceIn($))

  // create a module space, new function/lambda namespace, from an optional parent one.
  $.$export('createModuleSpace', $createModuleSpaceIn($))

  // inner execute function to support $.exec() and $.run()
  // depending on $.beval.
  $.$exec = $execIn($)

  // execute a block of code in a child space.
  // mark source as untrusted.
  $.$export('exec', function (code, source, space) {
    if (typeof code !== 'string') {
      return null
    }

    if (typeof source !== 'string') {
      source = ''
    }
    space = verifySpace(space)
    return $.$exec(code, '?' + (source || ''), space)
  })

  // load and execute a block of code in a child space.
  // depending on $.load() and $.$exec().
  $.$export('run', $runIn($))

  // loaded module mappings.
  $.$modules = {}

  // load, execute a module and save its output.
  // depending on $run().
  $.$export('require', $requireIn($))

  // export singal type to application controller
  $.$SuglySignal = SuglySignal

  return $
}

module.exports = function (load) {
  var space = makeSpace()
  if (load) {
    space.$export('load', load)
  }

  space.$spaceCounter = 0
  space.spaceIdentifier = 'space-0'
  space.moduleSpaceIdentifier = space.spaceIdentifier
  return populate(space)
}
