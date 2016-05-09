'use strict'

module.exports = function seval ($) {
  var set = $.$set
  var resolve = $.$resolve
  var indexer = $.$indexer

  var symbolValueOf = $.Symbol['value-of']
  var symbolKeyOf = $.Symbol['key-of']
  var isSymbol = $.Symbol['is-type-of']

  var SymbolContext = symbolValueOf('$')
  var SymbolIndexer = symbolValueOf(':')

  function $eval (clause, $) {
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
      subject = $eval(subject, $)
    }

    if (subject === null) {
      return null // short circuit - ignoring arguments
    }

    // with only subject, take the value of subject as another clause.
    if (length < 2) {
      return $eval(subject, $)
    }

    // predicate exists.
    var predicate = clause[1]
    if (Array.isArray(predicate)) {
      predicate = $eval(predicate, $)
    }

    var func
    switch (typeof predicate) {
      case 'string': // an immediate string indicating get/set command.
        var sym = symbolValueOf(predicate)
        return length > 2 ? set(subject, sym, $eval(clause[2], $)) : resolve(subject, sym)

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
      args.push($eval(clause[i], $))
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

  $.$eval = $eval
  $.$beval = function $beval ($, clauses) {
    var result = null
    for (var i = 0; i < clauses.length; i++) {
      result = $eval(clauses[i], $)
    }
    return result
  }
}
