'use strict'

module.exports = function evaluate ($void) {
  var resolve = $void.resolve
  var get = $void.get
  var set = $void.set
  var Symbol$ = $void.Symbol

  $void.evaluate = function evaluate (clause, space) {
    if (!Array.isArray(clause)) {
      // not a clause.
      return clause instanceof Symbol$ ? resolve(space, clause) : clause
    }
    var length = clause.length
    if (length < 1) {
      return null // empty clause
    }

    var subject = clause[0]
    // intercept subject
    if (subject instanceof Symbol$) {
      var key = subject.key
      if (space.operators && typeof space.operators[key] !== 'undefined') {
        return space.operators[key](space, clause)
      } else if (typeof $void.operators[key] !== 'undefined') {
        return $void.operators[key](space, clause)
      }
      if (key === '$') {
        subject = space.$ // shortcut
      } else {
        subject = resolve(space, subject)
      }
    } else if (Array.isArray(subject)) {
      subject = evaluate(subject, space)
    }

    if (subject === null) {
      return null // short circuit - ignoring arguments
    }

    // with only subject, take the value of subject as another clause.
    if (length < 2) {
      return evaluate(subject, space)
    }

    // predicate exists.
    var predicate = clause[1]
    if (Array.isArray(predicate)) {
      predicate = evaluate(predicate, space)
    }

    var func
    if (predicate instanceof Symbol$) {
      func = get(subject, predicate)
      if (typeof func !== 'function') {
        return func // interpret to getter if result is not a function.
      }
    } else if (typeof predicate === 'string') {
      // a string as verb is indicating a getting/setting command.
      return length > 2 ? set(subject, predicate, evaluate(clause[2], space))
        : get(subject, predicate)
    } else if (typeof predicate === 'function') {
      func = predicate
    } else {
      return predicate
    }

    // evaluate arguments.
    var max = func.$fixedArgs ? func.$params.length + 2 : length
    if (max > length) {
      max = length
    }
    var args = []
    for (var i = 2; i < max; i++) {
      args.push(evaluate(clause[i], space))
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
