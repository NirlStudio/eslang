'use strict'

module.exports = function evaluate ($void) {
  var set = $void.set
  var resolve = $void.resolve
  var Symbol$ = $void.Symbol

  $void.evaluate = function evaluate (clause, $) {
    if (!Array.isArray(clause)) {
      // not a clause.
      return clause instanceof Symbol$ ? resolve($, clause) : clause
    }
    var length = clause.length
    if (length < 1) {
      return null // empty clause
    }

    var subject = clause[0]
    // intercept subject
    if (subject instanceof Symbol$) {
      var key = subject.key
      if ($.$operators && typeof $.$operators[key] !== 'undefined') {
        return $.$operators[key]($, clause)
      } else if (typeof $void.operators[key] !== 'undefined') {
        return $void.operators[key]($, clause)
      }
      if (key === '$') {
        subject = $ // shortcut
      } else {
        subject = resolve($, subject)
      }
    } else if (Array.isArray(subject)) {
      subject = evaluate(subject, $)
    }

    if (subject === null) {
      return null // short circuit - ignoring arguments
    }

    // with only subject, take the value of subject as another clause.
    if (length < 2) {
      return evaluate(subject, $)
    }

    // predicate exists.
    var predicate = clause[1]
    if (Array.isArray(predicate)) {
      predicate = evaluate(predicate, $)
    }

    var func, offset
    if (predicate instanceof Symbol$) {
      func = resolve(subject, predicate)
      if (typeof func !== 'function') {
        return func // interpret to getter if result is not a function.
      }
      offset = 2
    } else if (typeof predicate === 'string') {
      // a string as verb is indicating a getting/setting command.
      func = resolve(subject, ':') // all object must be resolved to an indexer.
      if (typeof func !== 'function') {
        // only for space now
        return length > 2 ? set(subject, predicate, evaluate(clause[2], $)) : resolve(subject, predicate)
      }
      offset = 1
    } else if (typeof predicate === 'function') {
      func = predicate
      offset = 2
    } else {
      return predicate
    }

    // evaluate arguments.
    var max = func.$fixedArgs ? func.$params.length + 2 : length
    if (max > length) {
      max = length
    }
    var args = []
    for (var i = offset; i < max; i++) {
      args.push(evaluate(clause[i], $))
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
}
