'use strict'

module.exports = function suglizer (loader, output/*, more options */) {
  var makeSpace = require('./sugly/space')

  var warn, SuglySignal
  var symbolValueOf, symbolKeyOf, isSymbol
  var SymbolContext, SymbolIndexer, SymbolDerive,
    SymbolLambdaShort, SymbolRepeat

  function initializeSharedContext ($) {
    if (warn) {
      return
    }
    warn = $.print.warn
    SuglySignal = $.$Signal

    symbolValueOf = $.Symbol['value-of']
    symbolKeyOf = $.Symbol['key-of']
    isSymbol = $.Symbol.is

    SymbolContext = symbolValueOf('$')
    SymbolIndexer = symbolValueOf(':')

    SymbolDerive = symbolValueOf('>')
    SymbolLambdaShort = SymbolDerive

    SymbolRepeat = symbolValueOf('*')
  }

  function set (subject, sym, value) {
    if (typeof subject !== 'object' && typeof subject !== 'function') {
      return null
    }

    var key = symbolKeyOf(sym)
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
      key = symbolKeyOf(key)
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
      return set(this, symbolValueOf(key), value)
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
      var key = symbolKeyOf(subject)
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
        var sym = symbolValueOf(predicate)
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
    var createSpace = $.$createSpace

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
        ns['self'] = $F
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
    var createSpace = $.$createSpace

    function $C () {
      var args = Array.prototype.slice.apply(arguments)
      // new namespace
      var ns = createSpace($)
      ns[':'] = this
      ns['self'] = $C
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
        key = symbolValueOf(key)
      } else if (!isSymbol(key)) {
        return null
      }
      return set($, key, typeof value === 'undefined' ? null : value)
    }
  }

  global.spaceCounter = 0

  function $createSpaceIn ($) {
    return function $createSpace (parent, sealing) {
      var space = Object.create(parent)
      $.$spaceCounter += 1
      space.spaceIdentifier = 'space-' + $.$spaceCounter
      if (sealing) {
        // overridding parent.export
        space.$export('export', $exportTo(space))
        // isolate operators
        space.$operators = Object.assign({}, space.$operators)
        // separate modules
        space.$modules = {}
      }
      space.$loops = [] // new loop stack
      return space
    }
  }

  function $createModuleSpaceIn ($) {
    var createSpace = $.$createSpace

    return function $createModuleSpace (sealing, dir) {
      var space = createSpace($, sealing)
      space.moduleSpaceIdentifier = space.spaceIdentifier
      if (dir && dir !== space.$dir) {
        space.$dir = dir // save base dir if it is changing for this space.
      }

      // isolate function & lambda to the most recent module
      space.$export('function', $functionIn(space))
      space.$export('lambda', $lambdaIn(space))

      // isolate eval space to the most recent module
      space.$export('eval', $evalIn(space))

      // resolving will base on the directory of current space
      space.$export('load', $loadIn(space))
      space.$export('exec', $execIn(space))
      space.$export('run', $runIn(space))
      space.$export('import', $importIn(space))
      space.$export('require', $requireIn(space))

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

  function $innerExecIn ($) {
    var compile = $.compile
    var createModuleSpace = $.$createModuleSpace

    return function $innerExec (program, source, dir) {
      var result
      if (typeof program === 'string') {
        program = compile(program, source)
      }
      try {
        if (Array.isArray(program)) {
          var space = createModuleSpace(source.startsWith('?'), dir)
          result = beval(space, program)
        } else if (typeof program === 'function') {
          var args = arguments.length < 2 ? [] : Array.prototype.slice.call(arguments, 1)
          result = program.apply(null, args)
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

  function $evalIn ($) {
    return function $eval (expr) {
      var ns = verifySpace(this)
      return seval(expr, ns || $)
    }
  }

  function $loadIn ($) {
    var dirs = [$.$dir]
    var load = $.$load

    return function $load (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(dirs, source)
      return uri ? load(uri) : null
    }
  }

  function $execIn ($) {
    var dir = $.$dir
    var exec = $.$exec

    return function $exec (program, source) {
      if (typeof program === 'string' || Array.isArray(program)) {
        if (typeof source !== 'string') {
          source = ''
        }
        return exec(program, '?' + source, dir)
      }
      if (typeof program === 'function') {
        return exec.apply($, arguments)
      }
      return null
    }
  }

  function $runIn ($) {
    var dirs = [null, $.$dir]
    var load = $.$load
    var exec = $.$exec

    return function $run (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(dirs, source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return exec(load(uri), uri, path)
    }
  }

  function $importIn ($) {
    var dirs = [$.$dir]
    var load = $.$load
    var exec = $.$exec

    return function $import (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(dirs, source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return exec(load(uri), uri, path)
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
    var dirs = [$.$dir]
    var exec = $.$exec
    var load = $.$load
    var modules = $.$modules

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

      var uri = load.resolve(dirs, source)
      if (!uri) {
        return null
      }

      if (modules.hasOwnProperty(uri)) {
        return modules[uri]
      }

      var path = load.dir(uri)
      var result = exec(load(uri), uri, path)
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
    $.$set = set
    $.$eval = seval
    $.$beval = beval

    require('./sugly/runtime/signal-of')($)
    require('./sugly/operators')($)

    // create a child space from an optional parent one. - the inner version
    $.$export('$createSpace', $createSpaceIn($))

    // create a module space, new function/lambda namespace, from an optional parent one.
    $.$export('$createModuleSpace', $createModuleSpaceIn($))

    // inner execute function to support $.exec(), $.run() and $.require()
    // depending on $.beval.
    $.$exec = $innerExecIn($)

    // call a function with arguments in an array.
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

    // allow to export to root space.
    $.$export('export', $exportTo($))

    // global function & lambda generator.
    $.$export('function', $functionIn($))
    $.$export('lambda', $lambdaIn($))

    // evaluate a symbol or a clause, or return the value itself.
    $.$export('eval', $evalIn($))

    // load a file basing on current space's directory
    $.$export('load', $loadIn($))

    // execute a block of code in a module space.
    // mark source as untrusted.
    $.$export('exec', $execIn($))

    // load and execute a block of code in a child space.
    // depending on $.$load() and $.$exec().
    $.$export('run', $runIn($))
    $.$export('import', $importIn($))

    // load, execute a module and save its output.
    // depending on $.$load() and $.$exec().
    $.$export('require', $requireIn($))

    return $
  }

  // create sugly space
  var sugly = makeSpace(output)
  var notTracing = true
  var resolve = notTracing ? sugly.$resolve : function (subject, key) {
    var result = sugly.$resolve(subject, key)
    if (true) {
      console.log('resolving', key, 'to', result, 'for', subject)
    }
    return result
  }
  initializeSharedContext(sugly)

  sugly.$spaceCounter = 0
  sugly.spaceIdentifier = 'space-0'
  sugly.moduleSpaceIdentifier = sugly.spaceIdentifier

  // export runtime location
  sugly.$dir = __dirname

  // loaded module mappings.
  sugly.$modules = {}

  if (typeof loader === 'function') {
    sugly.$export('$load', loader(sugly))
  }
  return populate(sugly)
}
