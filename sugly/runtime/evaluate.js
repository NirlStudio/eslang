'use strict'

module.exports = function evaluate ($void) {
  var resolve = $void.resolve
  var Symbol$ = $void.Symbol
  var indexerOf = $void.indexerOf

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
    // check sentence mode: implicit (auto-test) or explicit (S P O).
    var implicitMode, offset
    if (subject instanceof Symbol$ && subject.key === ':') {
      if (length < 2) {
        return null
      }
      implicitMode = false
      subject = clause[1]
      offset = 2
    } else {
      implicitMode = true
      offset = 1
    }

    // intercept subject
    if (subject instanceof Symbol$) {
      var key = subject.key
      var localOperators = space.operators || space.parent.operators
      if (typeof localOperators[key] !== 'undefined') {
        return localOperators[key](space, clause)
      } else if (typeof $void.operators[key] !== 'undefined') {
        return $void.operators[key](space, clause)
      }
      subject = resolve(space, subject)
    } else if (Array.isArray(subject)) {
      subject = evaluate(subject, space)
    }

    var predicate
    if (implicitMode && typeof subject === 'function') {
      predicate = subject
      subject = null
    } else {
      predicate = null
    }

    // with only subject, take the value of subject as another clause.
    if (length <= offset && predicate === null) {
      return evaluate(subject, space)
    }

    var args = []
    if (predicate === null) {
      // resolve the predicate
      predicate = clause[offset]
      offset += 1
      if (Array.isArray(predicate)) {
        // nested clause
        predicate = evaluate(predicate, space)
      }
      // try to find a function as verb
      if (predicate instanceof Symbol$) {
        predicate = predicate.key === ':' ? indexerOf(subject)
          : indexerOf(subject).call(subject, predicate.key)
        if (typeof predicate !== 'function') {
          return predicate // interpret to getter if result is not a function.
        }
      } else if (typeof predicate === 'string' || typeof predicate === 'number') {
        args.push(predicate)
        predicate = indexerOf(subject)
      } else if (typeof predicate !== 'function') {
        return null // invalid predicate
      }
    }

    // evaluate arguments.
    var max = predicate['fixed-args'] ? predicate.parameters.length : 1024
    for (; offset < length && args.length < max; offset++) {
      args.push(evaluate(clause[offset], space))
    }

    // execute the clause.
    try {
      var result = predicate.apply(subject, args)
      return typeof result === 'undefined' ? null : result
    } catch (signal) {
      // TODO - filter native errors
      throw signal
    }
  }
}
