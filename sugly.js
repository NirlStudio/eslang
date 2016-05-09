'use strict'

module.exports = function suglizer (loader, output/*, more options */) {
  var makeSpace = require('./sugly/space')

  var warn, SuglySignal, set, seval, beval, $functionIn, $lambdaIn
  var symbolValueOf, isSymbol

  function initializeSharedContext ($) {
    if (warn) {
      return
    }
    warn = $.print.warn
    SuglySignal = $.$Signal
    set = $.$set
    seval = $.$eval
    beval = $.$beval
    $functionIn = $.$functionIn
    $lambdaIn = $.$lambdaIn

    symbolValueOf = $.Symbol['value-of']
    isSymbol = $.Symbol.is
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
      return seval(expr, $.$isSpace(this) ? this : $)
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
