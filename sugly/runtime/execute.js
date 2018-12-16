'use strict'

module.exports = function execute ($void) {
  var Signal$ = $void.Signal
  var warn = $void.warn
  var evaluate = $void.evaluate
  var createAppSpace = $void.createAppSpace
  var createModuleSpace = $void.createModuleSpace

  $void.execute = function execute (space, code, uri, args, mainApp) {
    var scope = mainApp ? createAppSpace(uri) : createModuleSpace(uri, space)
    populateArguments(scope, args, mainApp)
    try {
      return [evaluate(code, scope), scope]
    } catch (signal) {
      if (signal instanceof Signal$) {
        if (signal.id === 'exit' || signal.id === 'return') {
          return [signal.value, scope]
        }
        throw signal
      }
      warn('execute > unknown error:', signal,
        'with', args, 'for', code, 'from', uri
      )
      return [null, null]
    }
  }
  // to unify the usage of app/module arguments.
  $void.parseArguments = parseArguments
  $void.populateArguments = populateArguments

  // export to be used for interpreter.
  function populateArguments (scope, args, mainApp) {
    var context = scope.context
    if (typeof args === 'undefined' || args === null) {
      context.this = null
      context.arguments = []
      return
    }

    if (Array.isArray(args)) {
      args = parseArguments(args)
    } else if (typeof args !== 'object') {
      context.this = null
      context.arguments = [args] // a native argument value
      return
    }

    context.this = typeof args.this !== 'undefined' ? args.this : null
    context.arguments = Array.isArray(args.arguments) ? args.arguments : []

    var keys = Object.getOwnPropertyNames(args)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (key !== 'arguments' && key !== 'this') {
        if (mainApp && key === 'env') {
          populateEnv(args.env)
        } else {
          scope.local[key] = args[key]
        }
      }
    }
  }

  function populateEnv (envs) {
    for (var i = 0; i < envs.length; i++) {
      var pair = envs[i]
      var value = $void.env(pair[0])
      if (typeof value === 'string') {
        $void.env(pair[0], [value, pair[1]])
      } else if (Array.isArray(value)) {
        value.push(pair[1])
      } else {
        $void.env(pair[0], pair[1])
      }
    }
  }
}

function parseArgValue (value) {
  var offset = value.indexOf('=')
  return offset <= 0 ? value : [
    value.substring(0, offset), value.substring(offset + 1)
  ]
}

function parseArguments (args) {
  var result = Object.create(null)
  if (!Array.isArray(args)) {
    result.arguments = [args] // ensure the existence of arguments in context.
    return result
  }
  // try to parse arguments.
  result.command = []
  result.arguments = args
  var values // current value collector
  for (var i = 0; i < args.length; i++) {
    var arg = args[i]
    if (typeof arg !== 'string') { // a typed value
      if (values) { // an argument is collecting values.
        values.push(arg)
      }
    } else if (arg.startsWith('--')) { // --full-arg-name value ...
      if (arg.length < 3) {
        values = null // taken a '--' as a a separator.
      } else {
        var name = arg.substring(2)
        values = result[name]
        if (!values) { // new argument
          values = []
          result[name] = values
        }
      }
    } else if (arg.startsWith('-')) { // -xvalue or -x value ...
      if (arg.length < 2) {
        values = null // taken '-' as a separator too.
      } else { // has a flag
        var flag = arg.charAt(1)
        values = result[flag]
        if (!values) { // new flag
          values = []
          result[flag] = values
        }
        if (arg.length > 2) { // has value
          values.push(parseArgValue(arg.substring(2)))
        }
      }
    } else if (values) { // someone is collecting values
      values.push(parseArgValue(arg)) // a common text value
    } else { // a free value is taken as a command
      result.command.push(arg) // a command will not be discreted.
    }
  }
  return result
}
