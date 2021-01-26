'use strict'

module.exports = function evaluate ($void) {
  var $ = $void.$
  var $Operator = $.operator
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var indexerOf = $void.indexerOf
  var symbolPairing = $.symbol.pairing
  var symbolSubject = $.symbol.subject
  var staticOperators = $void.staticOperators

  function invokeOperator (predicate, clause, space, subject) {
    try {
      var result = predicate(space, clause, subject)
      return typeof result === 'undefined' ? null : result
    } catch (signal) {
      if (signal instanceof Signal$) {
        throw signal
      }
      warn('evaluate', 'unknown signal:[', signal.code || signal.message,
        '] when evaluating operator:', clause, '\n', signal)
      return null
    }
  }

  $void.evaluate = function evaluate (clause, space) {
    if (!(clause instanceof Tuple$)) {
      return clause instanceof Symbol$ ? space.resolve(clause.key) : clause
    }
    var clist = clause.$
    var length = clist.length
    if (length < 1) { // empty clause
      return null
    }
    if (clause.plain) { // a plain expression list (code block)
      var last = null
      for (var i = 0; i < length; i++) {
        last = evaluate(clist[i], space)
      }
      return last
    }
    // The subject and evaluation mode:
    //  implicit: the subject will be invoked if it's a function
    //  explicit: the subject keeps as a subject even it's a function.
    var subject = clist[0]
    var offset = 1
    var implicitSubject = true // by default, use implicit mode.
    if (subject instanceof Symbol$) {
      if (subject === symbolSubject) { // switching to explicit mode.
        switch (length) {
          case 1:
            return null // no subject.
          case 2:
            return evaluate(clist[1], space)
          default:
            subject = evaluate(clist[1], space)
        }
        offset = 2
        implicitSubject = false // explicit mode
      } else if (subject === symbolPairing) { // switching to explicit mode.
        if (length < 2) {
          return null // no predicate.
        }
        subject = evaluate(clist[1], space)
        if (typeof subject !== 'function') {
          return null // invalid operation
        }
        offset = 2
      } else if (staticOperators[subject.key]) { // static operators
        return invokeOperator(staticOperators[subject.key], clause, space)
      } else { // a common symbol
        subject = space.resolve(subject.key)
      }
    } else if (subject instanceof Tuple$) { // a statement
      subject = evaluate(subject, space)
    } // else, the subject is a common value.

    // switch subject to predicate if it's applicable.
    var predicate
    if (typeof subject === 'function' && implicitSubject) {
      if (subject.type === $Operator) {
        return invokeOperator(subject, clause, space)
      }
      predicate = subject
      subject = null
    } else {
      predicate = null
    }

    // with only subject, apply evaluation to it.
    if (offset >= length && predicate === null) {
      return evaluate(subject, space) // explicitly calling this function.
    }

    var args = []
    if (predicate === null) { // resolve the predicate if there is not.
      predicate = clist[offset++]
      if (predicate instanceof Tuple$) { // nested clause
        predicate = evaluate(predicate, space)
      }
      // try to find a function as verb
      if (predicate instanceof Symbol$) {
        if (predicate.key === ':') {
          predicate = indexerOf(subject) // explicitly calling the indexer
        } else { // implicitly call the indexer
          var indexer = indexerOf(subject)
          predicate = indexer.get
            ? indexer.get.call(subject, predicate.key)
            : indexer.call(subject, predicate.key)
          if (typeof predicate !== 'function') {
            // interpret to getter if the result is not a function.
            return typeof predicate === 'undefined' ? null : predicate
          }
        }
      } else if (typeof predicate !== 'function') {
        args.push(predicate)
        predicate = indexerOf(subject)
      }
    }

    // pass the original clause if the predicate is an operator.
    if (predicate.type === $Operator) {
      return invokeOperator(predicate, clause, space, subject)
    }

    // evaluate arguments.
    for (; offset < length; offset++) {
      args.push(evaluate(clist[offset], space))
    }

    // evaluate the statement.
    try {
      var result = predicate.apply(subject, args)
      return typeof result === 'undefined' ? null : result
    } catch (signal) {
      if (signal instanceof Signal$) {
        throw signal
      }
      warn('evaluate', 'unknown signal:[', signal.code || signal.message,
        '] when evaluating function/lambda:', clause, '\n', signal)
      return null
    }
  }
}
