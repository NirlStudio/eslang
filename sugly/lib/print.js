'use strict'

var $export = require('../export')

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

module.exports = function ($, JS, output) {
  if (!output) {
    output = JS.console || {
      log: null,
      info: null,
      warn: null
    }
  }

  var print = printer($)
  var printCode = codePrinter(output)

  // print a piece of program which is a set of clauses
  var $print = $export($, 'print', function $print (clauses) {
    return printCode($.encode, clauses)
  })

  // print text literally
  $export($print, 'code', function () {
    var args = Array.prototype.slice.apply(arguments)
    var values = []
    for (var i = 0; i < args.length; i++) {
      var value = args[i]
      values.push(typeof value === 'string' ? value : $.encode.value(value))
    }
    return printCode(null, values.join(''))
  })
  // encode and print one or more values to standard output.
  $export($print, 'value', function () {
    return print.apply(output.log, arguments)
  })
  // encode and print an clause to standard output.
  $export($print, 'clause', function (clause) {
    return printCode($.encode.clause, clause)
  })

  // encode arguments and print it as some diagnostic information to standard error.
  $export($print, 'info', function () {
    return print.apply(output.info, arguments)
  })

  // encode arguments and print it as an issue record to standard error.
  $export($print, 'warn', function () {
    return print.apply(output.warn, arguments)
  })

  return $print
}
