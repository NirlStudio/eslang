'use strict'

var makeSpace = require('./sugly/space')

var warn
var symbolFor, symbolKeyFor, isSymbol
var SymbolContext, SymbolQuote, SymbolIndexer, SymbolAssign, SymbolDerive,
  SymbolLambdaShort, SymbolObject, SymbolLambda, SymbolLike, SymbolElse,
  SymbolIn, SymbolThen, SymbolNext, SymbolRepeat

function initializeSharedContext ($) {
  if (warn) {
    return
  }
  warn = $.print.warn
  symbolFor = $.Symbol.for
  symbolKeyFor = $.Symbol.keyFor
  isSymbol = $.Symbol.is

  SymbolContext = symbolFor('$')
  SymbolQuote = symbolFor('`')
  SymbolIndexer = symbolFor(':')

  SymbolAssign = symbolFor('<')
  SymbolDerive = symbolFor('>')
  SymbolLambdaShort = SymbolDerive
  SymbolObject = symbolFor('@')

  SymbolLambda = symbolFor('=>')

  SymbolLike = symbolFor('like')
  SymbolElse = symbolFor('else')
  SymbolIn = symbolFor('in')

  SymbolThen = symbolFor('then')
  SymbolNext = symbolFor('next')

  SymbolRepeat = symbolFor('*')
}

function resolve ($, sym) {
  var key = symbolKeyFor(sym)
  switch (key) {
    case '$':
      return $ // $ is always the current space.
    case '':
    case 'null':
      return null
    case 'true':
      return true
    case 'false':
      return false
  }

  var value = $[key]
  switch (typeof $) {
    case 'boolean':
      return typeof value !== 'undefined' ? value : Boolean.prototype[key]

    case 'number':
      return typeof value !== 'undefined' ? value : Number.prototype[key]

    case 'string':
      return typeof value !== 'undefined' ? value : String.prototype[key]

    default:
      return typeof value !== 'undefined' ? value : null
  }
}

function set (subject, sym, value) {
  if (typeof subject !== 'object' && typeof subject !== 'function') {
    return null
  }

  var key = symbolKeyFor(sym)
  if (!key.startsWith('$') && !key.startsWith('__')) {
    subject[key] = value
  }
  return value
}

function getter (subject, key) {
  if (typeof subject !== 'object' && typeof subject !== 'function') {
    return null
  }

  if (isSymbol(key)) {
    key = symbolKeyFor(key)
  }

  var value = subject[key]
  if (typeof value !== 'undefined') {
    return value
  }
  return null
}

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
    return set(this, symbolFor(key), value)
  }
  if (isSymbol(key)) {
    return set(this, key, value)
  }

  // general operation - TODO - type filtering?
  try {
    this[key] = value
  } catch (err) {
    warn({
      from: '$/sugly',
      message: 'Indexer/set error for ' + key,
      value: value,
      inner: err
    })
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
    return isSymbol(clause) ? resolve($, clause) : clause
  }

  var length = clause.length
  if (length < 1) {
    return null // empty clause
  }

  var subject = clause[0]
  // intercept subject
  if (isSymbol(subject)) {
    var key = symbolKeyFor(subject)
    if ($.$operators.hasOwnProperty(key)) {
      return $.$operators[key]($, clause)
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
      var sym = symbolFor(predicate)
      return length > 2 ? set(subject, sym, seval(clause[2], $)) : resolve(subject, sym)

    case 'symbol': // native symbol
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

    case 'object':
      if (isSymbol(predicate)) { // polyfill symbol
        func = resolve(subject, predicate)
        if (!func && predicate === SymbolIndexer) {
          func = indexer // overridable indexer
        } else if (typeof func !== 'function') {
          return func
        }
        break
      }
      return predicate // ordinary object

    default:
      // short circuit - other type of value type will be evaluated to itself.
      return predicate
  }

  // evaluate arguments.
  var max = func.$fixedArgs ? func.$params.length + 2 : length
  if (max > length) {
    max = length
  }
  var args = []
  for (var i = 2; i < max; i++) {
    args.push(seval(clause[i], $))
  }

  // execute the clause.
  try {
    var result = func.apply(subject, args)
    return typeof result === 'undefined' ? null : result
  } catch (signal) {
    // TODO - filter native errors
    throw signal
  }
}

var $operators = {}

// (` symbol) or (` (...))
$operators['`'] = function ($, clause) {
  if (clause.length > 1) {
    return clause[1]
  } else {
    return null
  }
}

// a more readable version of `
$operators['quote'] = $operators['`']

function assign ($, sym, value) {
  var key = symbolKeyFor(sym)
  if (Object.prototype.hasOwnProperty.call($, key)) {
    $[key] = value
    return value
  }

  var module = $
  while (module && module.spaceIdentifier && module.spaceIdentifier !== $.moduleSpaceIdentifier) {
    module = Object.getPrototypeOf(module)
  }

  if (Object.prototype.hasOwnProperty.call(module, key)) {
    module[key] = value
  } else {
    $[key] = value
  }
  return value
}

// (let var value) or (let (var value) ...)
$operators['let'] = function $let ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var c1 = clause[1]
  // (let symbol value)
  if (isSymbol(c1)) {
    return assign($, c1, length < 3 ? null : seval(clause[2], $))
  } else if (!Array.isArray(c1)) {
    return null
  }

  // (let (symbol value) ...)
  var last = null
  for (var i = 1; i < length; i++) {
    var pair = clause[i]
    if (Array.isArray(pair) && pair.length > 1) {
      var p0 = pair[0]
      if (isSymbol(p0)) {
        last = assign($, p0, seval(pair[1], $))
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
      key = symbolFor(key)
    } else if (!isSymbol(key)) {
      break
    }

    i += 1
    set(obj, key, i < length ? seval(clause[i], $) : null)
    i += 2 // next :
  }
  return obj
}

// (@ obj < prop: value ...)
function objectAssign ($, clause) {
  var obj = seval(clause[1], $)
  if (!obj && typeof obj !== 'object' && typeof obj !== 'function') {
    return null
  }

  var i = 4
  var length = clause.length
  while (i < length && clause[i] === SymbolIndexer) {
    var key = clause[i - 1]
    if (typeof key === 'string') {
      key = symbolFor(key)
    } else if (!isSymbol(key)) {
      break
    }

    i += 1
    set(obj, key, i < length ? seval(clause[i], $) : null)
    i += 2 // next :
  }
  return obj
}

// (@ optional-prototype > prop: value ...).
function objectDerive ($, clause) {
  var i, prototype
  if (clause[1] === SymbolDerive) {
    i = 3
    prototype = null
  } else {
    i = 4
    prototype = seval(clause[1], $)
    if (typeof prototype !== 'object') {
      return null // non-object cannot derive an object.
    }
  }

  var obj = $.object(prototype)
  var length = clause.length
  while (i < length && clause[i] === SymbolIndexer) {
    var key = clause[i - 1]
    if (typeof key === 'string') {
      key = symbolFor(key)
    } else if (!isSymbol(key)) {
      break
    }

    i += 1
    set(obj, key, i < length ? seval(clause[i], $) : null)
    i += 2 // next :
  }
  return obj
}

// (@ value ...)
function arrayCreate ($, clause) {
  var result = []
  var i = 1
  while (i < clause.length) {
    result.push(seval(clause[i], $))
    i += 1
  }
  return result
}

$operators['@'] = function ($, clause) {
  var length = clause.length
  if (length > 1) {
    switch (clause[1]) {
      case SymbolIndexer:
        return null
      case SymbolAssign:
        return null
      case SymbolDerive:
        return objectDerive($, clause)
    }
  }
  if (length > 2) {
    switch (clause[2]) {
      case SymbolIndexer:
        return objectCreate($, clause)

      case SymbolAssign:
        return objectAssign($, clause)

      case SymbolDerive:
        return objectDerive($, clause)
    }
  }
  return arrayCreate($, clause)
}

// as operators, object and array are the readable version of @
$operators['object'] = function ($, clause) {
  if (clause.length < 2) {
    return $.object()
  }
  return $operators['@']($, clause)
}
// force to create an array
$operators['array'] = function ($, clause) {
  return arrayCreate($, clause)
}

// (= symbols > params body ...)
// symbols can be symbol or (symbol ...) or (@ prop: value ...)
function lambdaCreate ($, symbols, params, body) {
  var enclosing = {}
  if (isSymbol(symbols)) {
    set(enclosing, symbols, resolve($, symbols))
    return $.lambda(enclosing, params, body)
  }

  if (!Array.isArray(symbols)) {
    return null // invalid expression
  }

  if (symbols.length < 1) {
    return $.lambda(enclosing, params, body)
  }

  // enclosing context values.
  if (symbols[0] === SymbolObject) {
    // it should be an object expression: (@ prop: value ...)
    var obj = seval(symbols, $)
    if (typeof obj === 'object' && obj !== null) {
      enclosing = obj
    }
  } else {
    // it should be an symbol list: (sym ...)
    for (var i = 0; i < symbols.length; i++) {
      var s = symbols[i]
      if (isSymbol(s)) {
        set(enclosing, s, resolve($, s))
      }
    }
  }

  return $.lambda(enclosing, params, body)
}

$operators['='] = function ($, clause) {
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
$operators['function'] = $operators['=']
$operators['closure'] = $operators['=']

// (=> params body)
$operators['=>'] = function ($, clause) {
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
        result = seval(c1, $)
      } else {
        // return multiple arguments in an array.
        result = []
        for (var i = 1; i < length; i++) {
          result.push(seval(clause[i], $))
        }
      }
    }
    throw new SuglySignal(type, result)
  }
}

// operator lambda is a more readable version of '=>'
$operators['lambda'] = $operators['=>']

// leave function or module.
$operators['return'] = createSignalOf('return')
// leave a module or an event callback
$operators['exit'] = createSignalOf('exit')
// request to quit the whole application.
$operators['halt'] = createSignalOf('halt')

$operators['is'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return true
  }

  var left = clause[1]
  if (left === SymbolLike) {
    return false // (is like ...) is invalid
  }
  left = seval(left, $)
  if (length < 3) {
    return left === null
  }

  if (left && typeof left.hasOwnProperty !== 'function') {
    return false
  }

  var right = clause[2]
  if (right !== SymbolLike) {
    return Object.is(left, seval(right, $))
  }

  for (var i = 3; i < length; i++) {
    var value = seval(clause[i], $)
    if (value === null || Object.is(left, value)) {
      continue
    } else if (typeof left !== typeof value) {
      return false
    } else if (value.isPrototypeOf && value.isPrototypeOf(left)) {
      continue
    }
    for (var key in value) {
      if (!left || !left.hasOwnProperty(key)) {
        return false
      }
    }
  }
  return true // all objects are alike with null.
}

// typeof: query base type name, test a value, check object's prototype chain
$operators['typeof'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return 'null'
  }

  var value = seval(clause[1], $)
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
    // app defined type identifier
    if (typeof value === 'object') {
      if (value.typeIdentifier) {
        return value.typeIdentifier
      } else if (isSymbol(value)) {
        return 'symbol' // polyfill symbol
      }
    }
    var type = typeof value
    return type === 'boolean' ? 'bool' : type
  }

  var expected = seval(clause[2], $)
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
        return isSymbol(value)
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
        return typeof value === 'object' && value !== null && value.typeIdentifier === expected
    }
  }
  if (expected && expected.isPrototypeOf && expected.isPrototypeOf(value)) {
    return true
  }
  return false
}

// operator form of const values
$operators[''] = function ($, clause) {
  return null
}
$operators['null'] = function ($, clause) {
  return null
}
$operators['true'] = function ($, clause) {
  return true
}
$operators['false'] = function ($, clause) {
  return false
}

// generic type operators being identical with the function version.
$operators['bool'] = function ($, clause) {
  return $.bool(clause.length < 2 ? undefined : seval(clause[1], $))
}

$operators['number'] = function ($, clause) {
  return clause.length < 2 ? 0 : $.number(seval(clause[1], $))
}

$operators['string'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return ''
  }

  var values = []
  for (var i = 1; i < length; i++) {
    values.push(seval(clause[i], $))
  }
  return $.string.apply($, values)
}

$operators['symbol'] = function ($, clause) {
  return clause.length < 2 ? null : $.symbol(seval(clause[1], $))
}

$operators['date'] = function ($, clause) {
  var length = clause.length
  var args = []
  for (var i = 1; i < length; i++) {
    args.push(seval(clause[i], $))
  }
  return $.date.apply(null, args)
}

$operators['if'] = function ($, clause) {
  var length = clause.length
  if (length < 3) {
    return null // short circuit - the result will be null anyway.
  }

  // look for else
  var offset = clause.indexOf(SymbolElse, 1)
  if (offset === 1) {
    return null // short circuit - the cond is required.
  }

  var cond = seval(clause[1], $)
  var tb, fb
  if (offset > 0) {
    tb = clause.slice(2, offset)
    fb = clause.slice(offset + 1)
  } else {
    tb = length > 2 ? [clause[2]] : []
    fb = length > 3 ? clause.slice(3) : []
  }

  var option = cond !== false && cond !== null && cond !== 0 ? tb : fb
  if (option.length < 1) {
    return null
  }
  return option.length === 1 ? seval(option[0], $) : beval($, option)
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

$operators['break'] = createLoopSignal('break')
$operators['continue'] = createLoopSignal('continue')

function loopTest ($, cond) {
  // loop test function returns a BREAK flag
  if (isSymbol(cond)) {
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

$operators['while'] = function ($, clause) {
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

// (for value in iterable body) OR
// (for (value) in iterable body) OR
// (for (key value) in iterable body)
function forEach ($, clause) {
  var length = clause.length
  if (length < 5) {
    return null // short circuit - no loop body
  }

  var keySymbol, valueSymbol
  var fields = clause[1]
  if (isSymbol(fields)) {
    keySymbol = null
    valueSymbol = fields
  } else if (Array.isArray(fields)) {
    if (fields.length > 1) {
      keySymbol = fields[0]
      valueSymbol = fields[1]
      if (!isSymbol(keySymbol) || !isSymbol(valueSymbol)) {
        return null // invalid fields expresion
      }
    } else if (fields.length > 0) {
      keySymbol = null
      valueSymbol = fields[0]
      if (!isSymbol(valueSymbol)) {
        return null // invalid fields expresion
      }
    } else {
      return null // missing fields expression
    }
  } else {
    return null // invalid field(s) expression
  }

  var iterable = seval(clause[3], $)
  var iterator = $.iterate(iterable)
  if (iterator === null || typeof iterator.next !== 'function') {
    return null // not an iterable object.
  }

  var body = clause.slice(4)
  var result = null
  $.$loops.push(iterator)
  while (iterator.next()) {
    set($, valueSymbol, typeof iterator.value !== 'undefined' ? iterator.value : null)
    if (keySymbol) {
      set($, keySymbol, typeof iterator.key !== 'undefined' ? iterator.key : null)
    }
    try {
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

// (for condition incremental body)
$operators['for'] = function ($, clause) {
  var length = clause.length
  if (length < 4) {
    return null // short circuit - no loop body
  }

  var step = clause[2]
  if (step === SymbolIn) {
    return forEach($, clause)
  }
  var runStep = Array.isArray(step)

  var test = loopTest($, clause[1])
  var dynamicTest = typeof test === 'function'

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

// (-> clause sub-clause1 sub-clause2 ...).
$operators['->'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }
  var subject = seval(clause[1], $)
  for (var i = 2; subject !== null && i < length; i++) {
    var next = clause[i]
    if (Array.isArray(subject) || isSymbol(subject)) {
      subject = [SymbolQuote, subject]
    }
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
$operators['flow'] = $operators['->']

// (| clause1 clause2 ... )
$operators['|'] = function ($, clause) {
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
        if (Array.isArray(value) || isSymbol(value)) {
          value = [SymbolQuote, value] // symbol to quote
        }
        stmt.push(value)
      }
    } else {
      stmt.push(output)
    }
    output = seval(stmt, $)
  }
  return output
}
$operators['pipe'] = $operators['|']

// (? entry cb1 cb2 ...) - reversed pipe
$operators['?'] = function ($, clause) {
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
        if (Array.isArray(value) || isSymbol(value)) {
          value = [SymbolQuote, value] // symbol to quote
        }
        stmt.push(value)
      }
    } else {
      stmt.push(output)
    }
    output = seval(stmt, $)
  }
  return output
}
$operators['premise'] = $operators['?']

function populateOperatorCtx (ctx, operands) {
  var oprdc = operands.length
  ctx['%C'] = oprdc
  ctx['%V'] = operands
  for (var i = 0; i < 10; i++) {
    ctx['%' + i] = i < oprdc ? operands[i] : null
  }
}

// app defined operator: (operator name clause ...)
// in the same space, an operator can only be defined once.
$operators['operator'] = function ($, impl) {
  if ($.moduleSpaceIdentifier !== $.spaceIdentifier) {
    return null // operator can only be defined in module scope
  }

  var length = impl.length
  if (length < 2) {
    return null // a name is required
  }

  var name = impl[1]
  if (!isSymbol(name)) {
    return null // the name must be a symbol.
  }

  var key = symbolKeyFor(name)
  var existed = $.$operators.hasOwnProperty(key)
  if (length < 3) {
    // without operator body, querying for if an operator is existed.
    return existed
  }

  // trying to define a new operator.
  if (existed) {
    // trying to override an existed operator
    if (Object.prototype.hasOwnProperty.call($, '$operators')) {
      return true // cannot re-create an operator in the same space.
    }
    // create a local operator table.
    $.$operators = Object.assign({}, $.$operators)
  }

  var statements = impl.slice(2)
  $.$operators[key] = function $OPR (ctx, clause) {
    var oprds = []
    for (var i = 1; i < clause.length; i++) {
      oprds.push(seval(clause[i], ctx))
    }

    var oprStack = ctx.$OprStack
    oprStack.push(oprds)
    populateOperatorCtx(ctx, oprds)
    var value = null
    try {
      for (var j = 0; j < statements.length; j++) {
        value = seval(statements[j], ctx)
      }
      oprStack.pop()
      populateOperatorCtx(ctx, oprStack.length > 0 ? oprStack[oprStack.length - 1] : [])
      return value
    } catch (signal) {
      oprStack.pop()
      populateOperatorCtx(ctx, oprStack.length > 0 ? oprStack[oprStack.length - 1] : [])
      throw signal
    }
  }
  return true
}

function concat ($, str, clause) {
  var length = clause.length
  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (typeof value === 'string') {
      str += value
    } else {
      str += $.encode.value(value)
    }
  }
  return str
}

$operators['concat'] = function ($, clause) {
  var length = clause.length
  if (length < 2) { return '' }

  var str = seval(clause[1], $)
  if (typeof str !== 'string') {
    str = $.encode.value(str)
  }
  return length > 2 ? concat($, str, clause) : str
}

function mixin ($, base, clause, target) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  if (typeof target !== 'object' || target === null) {
    target = base
    if (typeof target !== 'object' || target === null) {
      return null
    }
  } else {
    Object.assign(target, base)
  }

  for (var i = 2; i < length; i++) {
    Object.assign(target, seval(clause[i], $))
  }
  return target
}

$operators['combine'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var base = seval(clause[1], $)
  return mixin($, base, clause, $.object())
}

$operators['mixin'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var base = seval(clause[1], $)
  return length > 2 ? mixin($, base, clause, null) : base
}

function sum ($, num, clause) {
  var length = clause.length
  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (typeof value === 'number') {
      num += value
    }
  }
  return num
}

$operators['+'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return 0
  }

  var base = seval(clause[1], $)
  if (length === 2) {
    return typeof base === 'object' ? mixin($, base, clause, $.object()) : base
  }

  if (typeof base === 'number') {
    return sum($, base, clause)
  }
  if (typeof base === 'string') {
    return concat($, base, clause)
  }
  if (typeof base === 'object') {
    return mixin($, base, clause, $.object()) // combination
  }
  return base // return the first argument for other types
}

$operators['+='] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return 0
  }

  var sym = clause[1]
  var base = seval(sym, $)
  if (length === 2) {
    return base
  }

  if (typeof base === 'number') {
    base = sum($, base, clause)
  } else if (typeof base === 'string') {
    base = concat($, base, clause)
  } else if (typeof base === 'object') {
    return mixin($, base, clause, null) // mixin
  } else {
    return base // for other types
  }
  // try to assign value back for primal types
  return isSymbol(sym) ? assign($, sym, base) : base
}

function subtract ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = seval(clause[1], $)
  if (typeof result !== 'number') {
    result = 0
  }

  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (typeof value === 'number') {
      result -= value
    }
  }
  return result
}

$operators['-'] = subtract
$operators['-='] = function ($, clause) {
  var result = subtract($, clause)
  var sym = clause[1]
  if (isSymbol(sym)) {
    assign($, sym, result)
  }
  return result
}

function multiply ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = seval(clause[1], $)
  if (typeof result !== 'number') {
    return 0
  }

  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (typeof value === 'number') {
      result *= value
    } else {
      return 0
    }
  }
  return result
}

$operators['*'] = multiply
$operators['*='] = function ($, clause) {
  var result = multiply($, clause)
  var sym = clause[1]
  if (isSymbol(sym)) {
    assign($, sym, result)
  }
  return result
}

function divide ($, clause) {
  var length = clause.length
  if (length < 2) { return 0 }

  var result = seval(clause[1], $)
  if (typeof result !== 'number') {
    return 0
  }

  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (typeof value === 'number') {
      result /= value
    } else {
      return NaN
    }
  }
  return result
}

$operators['/'] = divide
$operators['/='] = function ($, clause) {
  var result = divide($, clause)
  var sym = clause[1]
  if (isSymbol(sym)) {
    assign($, sym, result)
  }
  return result
}

$operators['++'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return 1
  }

  var sym = clause[1]
  if (isSymbol(sym)) {
    var value = resolve($, sym)
    if (typeof value === 'number') {
      value += 1
    } else {
      value = 1
    }
    assign($, sym, value)
    return value
  }

  if (Array.isArray(sym)) {
    sym = seval($, sym)
  }
  return typeof sym === 'number' ? sym + 1 : 1
}

$operators['--'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return -1
  }

  var sym = clause[1]
  if (isSymbol(sym)) {
    var value = resolve($, sym)
    if (typeof value === 'number') {
      value -= 1
    } else {
      value = -1
    }
    assign($, sym, value)
    return value
  }

  if (Array.isArray(sym)) {
    sym = seval($, sym)
  }
  return typeof sym === 'number' ? sym - 1 : -1
}

function equalDate ($, base, clause) {
  var length = clause.length
  base = base.getTime()
  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (!(value instanceof Date) || base !== value.getTime()) {
      return false
    }
  }
  return true
}

$operators['=='] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return true // null === null
  }

  var base = seval(clause[1], $)
  if (length < 3) {
    return base === null
  }
  if (base instanceof Date) {
    return equalDate($, base, clause)
  }

  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (base !== value) {
      return false
    }
  }
  return true
}

$operators['!='] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null !== null
  }

  var base = seval(clause[1], $)
  if (length < 3) {
    return base !== null
  }
  if (base instanceof Date) {
    return !equalDate($, base, clause)
  }

  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (base !== value) {
      return true
    }
  }
  return false
}

$operators['>'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false // null === null
  }

  var left = seval(clause[1], $)
  if (length < 3) {
    return false
  }

  var type = typeof left
  if (type !== 'number' && type !== 'string') {
    if (left instanceof Date) {
      type = 'date'
    } else {
      return false
    }
  }

  var right = seval(clause[2], $)
  if (type === 'date') {
    if (right instanceof Date) {
      return left.getTime() > right.getTime()
    }
  } else if (typeof right === type) {
    return left > right
  }
  return false
}

$operators['>='] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false
  }

  var left = seval(clause[1], $)
  if (length < 3) {
    return false
  }

  var type = typeof left
  if (type !== 'number' && type !== 'string') {
    if (left instanceof Date) {
      type = 'date'
    } else {
      return false
    }
  }

  var right = seval(clause[2], $)
  if (type === 'date') {
    if (right instanceof Date) {
      return left.getTime() >= right.getTime()
    }
  } else if (typeof right === type) {
    return left >= right
  }
  return false
}

$operators['<'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false
  }

  var left = seval(clause[1], $)
  if (length < 3) {
    return false
  }

  var type = typeof left
  if (type !== 'number' && type !== 'string') {
    if (left instanceof Date) {
      type = 'date'
    } else {
      return false
    }
  }

  var right = seval(clause[2], $)
  if (type === 'date') {
    if (right instanceof Date) {
      return left.getTime() < right.getTime()
    }
  } else if (typeof right === type) {
    return left < right
  }
  return false
}

$operators['<='] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return false
  }

  var left = seval(clause[1], $)
  if (length < 3) {
    return false
  }

  var type = typeof left
  if (type !== 'number' && type !== 'string') {
    if (left instanceof Date) {
      type = 'date'
    } else {
      return false
    }
  }

  var right = seval(clause[2], $)
  if (type === 'date') {
    if (right instanceof Date) {
      return left.getTime() <= right.getTime()
    }
  } else if (typeof right === type) {
    return left <= right
  }
  return false
}

$operators['&&'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var base = seval(clause[1], $)
  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (value === false || value === null || value === 0) {
      return value
    } else {
      base = value
    }
  }
  return base
}

$operators['||'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return null
  }

  var base = seval(clause[1], $)
  if (base !== false && base !== null && base !== 0) {
    return base
  }

  for (var i = 2; i < length; i++) {
    var value = seval(clause[i], $)
    if (value !== false && value !== null && value !== 0) {
      return value
    } else {
      base = value
    }
  }
  return base
}

$operators['!'] = function ($, clause) {
  var length = clause.length
  if (length < 2) {
    return true // !null
  }

  var base = seval(clause[1], $)
  return base === false || base === null || base === 0
}

function beval ($, clauses) {
  var result = null
  for (var i = 0; i < clauses.length; i++) {
    result = seval(clauses[i], $)
  }
  return result
}

// param or (param ...) or ((param value) ...)
function formatParameters (params) {
  var formatted = [true] // eliminate unwanted arguments.
  if (typeof params === 'undefined' || params === null) {
    return formatted
  }

  if (isSymbol(params)) {
    params = [params] // single parameter
  } else if (!Array.isArray(params)) {
    return formatted
  }

  for (var i = 0; i < params.length; i++) {
    var p = params[i]
    if (isSymbol(p)) {
      if (p === SymbolRepeat) {
        formatted[0] = false // variant arguments
        break // the repeat indicator is always the last one
      }
      formatted.push([p, null])
    } else if (Array.isArray(p)) {
      if (p.length < 1) {
        continue
      }
      var sym = p[0]
      if (isSymbol(sym)) {
        formatted.push([sym, p.length > 1 ? p[1] : null]) // no evaluation.
      }
    }
  }
  return formatted
}

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
      var args = Array.prototype.slice.apply(arguments)
      // new namespace
      var ns = createSpace($)
      ns[':'] = this
      if (!fixedArgs) {
        ns['argc'] = args.length
        ns['argv'] = args
      }

      // binding arguments with default values
      for (var i = 0; i < params.length; i++) {
        var p = params[i]
        set(ns, p[0], args.length > i ? args[i] : p[1])
      }

      try {
        return beval(ns, body)
      } catch (signal) {
        if (signal instanceof SuglySignal && signal.type === 'return') {
          return signal.value
        }
        throw signal
      }
    }

    f.$fixedArgs = fixedArgs
    f.$params = params
    f.$body = body
    return f
  }
}

function createClosure ($, enclosing, params, fixedArgs, body) {
  var createSpace = $.createSpace

  function $C () {
    var args = Array.prototype.slice.apply(arguments)
    // new namespace
    var ns = createSpace($)
    ns[':'] = this
    Object.assign(ns, enclosing)

    // variant arguments
    if (!fixedArgs) {
      ns['argc'] = args.length
      ns['argv'] = args
    }

    // aguments or parameter default values can overrride enclosed values.
    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      set(ns, p[0], args.length > i ? args[i] : p[1])
    }

    try {
      return beval(ns, body)
    } catch (signal) {
      if (signal instanceof SuglySignal && signal.type === 'return') {
        return signal.value
      }
      throw signal
    }
  }

  $C.$enclosing = enclosing
  $C.$fixedArgs = fixedArgs
  $C.$params = params
  $C.$body = body
  return $C
}

function createLambda ($, enclosing, params, body) {
  function $L () {
    var args = Array.prototype.slice.apply(arguments)

    enclosing = Object.assign({}, enclosing)
    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      set(enclosing, p[0], args.length > i ? args[i] : p[1])
    }

    return $.lambda(enclosing, body[1], body.slice(2))
  }

  $L.$enclosing = enclosing
  $L.$fixedArgs = true
  $L.$params = params
  $L.$body = body
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
      key = symbolFor(key)
    } else if (!isSymbol(key)) {
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
      space.$operators = Object.assign({}, space.$operators)
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
    var result
    try {
      if (typeof code === 'string') {
        var program = compile(code, source || '?')
        result = beval(space || createModuleSpace(), program)
      } else if (typeof code === 'function') {
        var args = arguments.length < 2 ? [] : Array.prototype.slice.call(arguments, 1)
        result = code.apply(null, args)
      } else {
        return null // unrecognized code type
      }
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
    if (typeof source !== 'string') {
      return null
    }

    if (!source.endsWith('.s')) {
      source += '.s'
    }
    space = verifySpace(space)
    return exec(load(source), load.normalize(source), space)
  }
}

function importJSModule ($, name) {
  try {
    return require(name)
  } catch (err) {
    warn({
      form: '$/sugly',
      message: 'failed to load JS moudle: ' + name
    })
    return null
  }
}

function $requireIn ($) {
  var load = $.load
  var modules = $.$modules
  var run = $.run
  var createModuleSpace = $.createModuleSpace

  return function $require (source, type) {
    if (typeof source !== 'string') {
      return null
    }

    if (type === 'js') {
      return importJSModule($, source)
    }

    if (!source.endsWith('.s')) {
      source += '.s'
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
    if (result && !result.timestamp) {
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

  $.$export('call', function (func, subject, args) {
    if (typeof func !== 'function') {
      return null
    }
    if (typeof subject === 'undefined') {
      subject = null
    }
    if (!Array.isArray(args)) {
      args = []
    }
    try {
      return func.apply(subject, args)
    } catch (signal) {
      // TODO - filter native errors
      throw signal
    }
  })

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
    if (typeof code === 'string') {
      if (typeof source !== 'string') {
        source = ''
      }
      space = verifySpace(space)
      return $.$exec(code, '?' + (source || ''), space)
    }
    if (typeof code === 'function') {
      return $.$exec.apply($, arguments)
    }
    return null
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

module.exports = function (loader, output/*, more options */) {
  var space = makeSpace(output)
  space.$spaceCounter = 0
  space.spaceIdentifier = 'space-0'
  space.moduleSpaceIdentifier = space.spaceIdentifier

  initializeSharedContext(space)
  if (typeof loader === 'function') {
    space.$export('load', loader(space))
  }
  return populate(space)
}
