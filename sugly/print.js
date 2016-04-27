'use strict'

var JS = global || window

function exportTo (container, name, obj) {
  var owner = container.identityName
  obj.identityName = '(' + owner + ' "' + name + '")'

  container[name] = obj
  return obj
}

function printer ($) {
  return function print () {
    if (typeof this !== 'function') {
      return null
    }

    var args = Array.prototype.slice.apply(arguments)
    var code
    if (args.length < 1) {
      code = ''
    } else if (args.length === 1) {
      code = $.encode.value(args[0])
    } else {
      code = $.encode.value(args)
    }
    this(code)
    return code
  }
}

function codePrinter (output) {
  if (typeof output.log !== 'function') {
    return function () { return null }
  }

  var log = output.log
  return function printCode (encode, program) {
    var text = encode ? encode(program) : program
    log(text)
    return text
  }
}

module.exports = function ($, output) {
  if (!output) {
    output = JS.console || {
      log: null,
      info: null,
      warn: null
    }
  }

  var print = printer($)
  var printCode = codePrinter(output)

  // encode and print one or more values to standard output.
  function $print () {
    return print.apply(output.log, arguments)
  }
  $print.identityName = '($"print")'

  // print text literally
  exportTo($print, 'code', function () {
    var args = Array.prototype.slice.apply(arguments)
    var values = []
    for (var i = 0; i < args.length; i++) {
      var value = args[i]
      values.push(typeof value === 'string' ? value : $.encode.value(value))
    }
    return printCode(null, values.join(''))
  })
  // encode and print an clause to standard output.
  exportTo($print, 'clause', function (clause) {
    return printCode($.encode.clause, clause)
  })
  // print a piece of program which is a set of clauses
  exportTo($print, 'program', function (clauses) {
    return printCode($.encode, clauses)
  })

  // encode arguments and print it as some diagnostic information to standard error.
  exportTo($print, 'info', function () {
    return print.apply(output.info, arguments)
  })

  // encode arguments and print it as an issue record to standard error.
  exportTo($print, 'warn', function () {
    return print.apply(output.warn, arguments)
  })

  return $print
}
