
'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.function
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Operator = $.operator
  var link = $void.link
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var $export = $void.export
  var thisCall = $void.thisCall
  var prepareOperation = $void.prepareOperation

  // the empty function
  link(Type, 'empty', $void.function(function () {
    return null
  }, new Tuple$( // (= () )
    [$Symbol.lambda, $Tuple.empty, new Tuple$([], true)]
  )))

  // prepare common type implementation.
  prepareOperation(Type)

  // Encoding: downgrade to a lambda.
  // Desccription
  link(Type.proto, 'to-string', function () {
    return typeof this !== 'function' ? null
      : (this.name || '?function') + $Tuple.of($Symbol.function,
        this.code instanceof Tuple$ ? this.code.$[1] : $Tuple.unknown,
        $Symbol.etc)['to-string']()
  })

  // explicitly call a function on subject with arguments.
  $export($, 'call', function (subject, func) {
    if (typeof subject === 'undefined') {
      return null
    }
    var args = Array.prototype.slice.call(arguments, 2)
    if (typeof func === 'function') {
      return func.type === $Operator ? null : func.apply(subject, args)
    }
    var name
    if (typeof func === 'string') {
      name = func
    } else if (func instanceof Symbol$) {
      name = func.key
    } else {
      return subject
    }
    args.splice(0, 0, subject, name)
    return thisCall.apply(null, args)
  })

  // apply a function and expand arguments from an array.
  $export($, 'apply', function (subject, func, args) {
    // re-arrange arguments
    switch (arguments.length) {
      case 0:
        return null
      case 1:
        func = subject
        subject = null
        args = []
        break
      case 2:
        args = func
        func = subject
        subject = null
        break
      default:
        break
    }
    if (typeof subject === 'undefined') {
      subject = null
    }
    if (!Array.isArray(args)) {
      args = []
    }
    if (typeof func === 'function') {
      return func.type === $Operator ? null : func.apply(subject, args)
    }
    var name
    if (typeof func === 'string') {
      name = func
    } else if (func instanceof Symbol$) {
      name = func.key
    } else {
      return subject
    }
    args.splice(0, 0, subject, name)
    return thisCall.apply(null, args)
  })
}
