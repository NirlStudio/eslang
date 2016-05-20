'use strict'

module.exports = function evaluate ($void) {
  var resolve = $void.resolve
  var get = $void.get
  var set = $void.set
  var geti = $void.geti
  var seti = $void.seti
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
    // check sentence mode: implicit (auto-test) or explicit (S P O).
    var implicitMode, offset
    if (subject instanceof Symbol$ && subject.key === '$') {
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
        predicate = get(subject, predicate)
        if (typeof predicate !== 'function') {
          return predicate // interpret to getter if result is not a function.
        }
      } else if (typeof predicate === 'string') {
        // a string as verb is indicating a getting/setting command.
        return length > 2 ? set(subject, predicate, evaluate(clause[2], space))
          : get(subject, predicate)
      } else if (typeof predicate === 'number') {
        // a number may be a valid index for some types.
        return length > 2 ? seti(subject, predicate, evaluate(clause[2], space))
          : geti(subject, predicate)
      } else if (typeof predicate !== 'function') {
        return null // invalid predicate
      }
    }

    // evaluate arguments.
    var max = predicate.$fixedArgs ? predicate.$params.length + offset : length
    if (max > length) {
      max = length
    }
    var args = []
    for (var i = offset; i < max; i++) {
      args.push(evaluate(clause[i], space))
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
