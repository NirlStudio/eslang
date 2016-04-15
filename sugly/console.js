'use strict'

const SymbolIdentityName = Symbol.for('identityName')

let JS = global || window

function exportTo (container, name, obj) {
  var owner = container[SymbolIdentityName]
  obj[SymbolIdentityName] = '(' + owner + ' "' + name + '")'

  container[name] = obj
  container[Symbol.for(name)] = obj
  return obj
}

function formatter ($, isCode) {
  return function format () {
    var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
    var toArray = args.length > 1 && !isCode
    var strings = toArray ? ['(@'] : []

    if (args.length > 1) {
      strings.push
    }

    for (var i = 0; i < args.length; i++) {
      var value = args[i]
      if (isCode && typeof value === 'string') {
        strings.push(value)
      } else {
        strings.push($.encode.value(args[i]))
      }
    }
    if (toArray) {
      strings.push(')')
    }
    return strings
  }
}

module.exports = function ($, output) {
  if (!output) {
    output = JS.console
  }

  var format = formatter($)
  var formatCode = formatter($, true)

  var $console = {}
  $console[SymbolIdentityName] = '($"console")'

  exportTo($console, 'log', function () {
    output.log.apply(output, format.apply(null, arguments))
  })

  exportTo($console, 'warn', function () {
    output.warn.apply(output, format.apply(null, arguments))
  })

  exportTo($console, 'error', function () {
    output.error.apply(output, format.apply(null, arguments))
  })
  exportTo($console, 'trace', function () {
    output.trace.apply(output, format.apply(null, arguments))
  })

  exportTo($console, 'code', function (text) {
    output.log.apply(output, formatCode.apply(null, arguments))
  })

  exportTo($console, 'clause', function (expr) {
    output.log($.encode.clause(expr))
  })

  exportTo($console, 'program', function (clauses) {
    output.log($.encode(clauses))
  })

  return $console
}
