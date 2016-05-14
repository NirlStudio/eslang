'use strict'

module.exports = function operators$pattern ($) {
  var $operators = $.$operators
  var seval = $.$eval
  var Symbol$ = $.$SymbolConstructor
  var symbolValueOf = $.Symbol['value-of']

  var SymbolContext = symbolValueOf('$')
  var SymbolQuote = symbolValueOf('`')
  var SymbolLambdaShort = symbolValueOf('>')

  var SymbolLambda = symbolValueOf('=>')
  var SymbolThen = symbolValueOf('then')
  var SymbolNext = symbolValueOf('next')

  // (-> clause sub-clause1 sub-clause2 ...).
  $operators['->'] = function ($, clause) {
    var length = clause.length
    if (length < 2) {
      return null
    }
    var subject = seval(clause[1], $)
    for (var i = 2; subject !== null && i < length; i++) {
      var next = clause[i]
      if (Array.isArray(subject) || subject instanceof Symbol$) {
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
          if (Array.isArray(value) || value instanceof Symbol$) {
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
          if (Array.isArray(value) || value instanceof Symbol$) {
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
}
