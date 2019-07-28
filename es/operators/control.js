'use strict'

module.exports = function control ($void) {
  var $ = $void.$
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var signalOf = $void.signalOf
  var iterateOf = $void.iterateOf
  var iteratorOf = $.iterator.of
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var symbolElse = sharedSymbolOf('else')
  var symbolIn = sharedSymbolOf('in')
  var symbolUnderscore = sharedSymbolOf('_')

  // (? sym) - resolve in global scope or original scope (in operator only).
  // (? cond true-branch false-branch)
  staticOperator('?', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return null // short circuit - the result will be null anyway.
    }
    var cond = clist[1]
    if (length < 3) {
      return cond instanceof Symbol$ ? space.$resolve(cond.key) : null
    }
    cond = evaluate(cond, space)
    if (typeof cond !== 'undefined' && cond !== null && cond !== 0 && cond !== false) {
      return evaluate(clist[2], space)
    }
    return length > 3 ? evaluate(clist[3], space) : null
  })

  // (if cond true-branch else false-branch)
  staticOperator('if', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 3) {
      return null // short circuit - the result will be null anyway.
    }

    var result, i, expr
    var cond = evaluate(clist[1], space)
    if (typeof cond !== 'undefined' && cond !== null && cond !== 0 && cond !== false) { //
      expr = clist[2]
      if (expr === symbolElse) {
        return null // no true branch.
      }
      // otherwise this expr is always taken as part of the true branch.
      result = evaluate(expr, space)
      for (i = 3; i < length; i++) {
        expr = clist[i]
        if (expr === symbolElse) {
          return result
        }
        result = evaluate(expr, space)
      }
      return result
    }
    // else, cond is false
    // skip true branch
    for (i = 2; i < length; i++) {
      if (clist[i] === symbolElse) {
        break
      }
    }
    if (i >= length) { // no else
      return null // no false branch
    }
    result = null // in case of the else is the ending expression.
    for (i += 1; i < length; i++) {
      result = evaluate(clist[i], space)
    }
    return result
  })

  // break current loop and use the argument(s) as result
  staticOperator('break', signalOf('break'))
  // skip the rest expressions in this round of loop.
  staticOperator('continue', signalOf('continue'))

  function loopTest (space, cond) {
    if (cond instanceof Symbol$) {
      return space.resolve.bind(space, cond.key)
    }
    if (cond instanceof Tuple$) {
      return evaluate.bind(null, cond, space)
    }
    return cond === false || cond === null || cond === 0
  }

  // condition-based loop
  // (while cond ... )
  staticOperator('while', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 2) {
      return null // no condition
    }

    var test = loopTest(space, clist[1])
    var staticCond = typeof test !== 'function'
    var result = null
    while (true) {
      try {
        if (staticCond) {
          if (test) { return null }
        } else { // break/continue can be used in condition expression.
          var cond = test()
          if (cond === false || typeof cond === 'undefined' || cond === null || cond === 0) {
            break
          }
        }
        for (var i = 2; i < length; i++) {
          result = evaluate(clist[i], space)
        }
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'continue') {
            result = signal.value
            continue
          }
          if (signal.id === 'break') {
            result = signal.value
            break
          }
        }
        throw signal
      }
    }
    return result
  })

  // a shortcut operator of (iterator of ...)
  staticOperator('in', function (space, clause) {
    var clist = clause.$
    return iteratorOf(clist.length > 1 ? evaluate(clist[1], space) : null)
  })

  // iterator-based loop
  // (for iterable body) - in this case, a variable name '_' is used.
  // (for i in iterable body)
  // (for (i, j) in iterable body)
  staticOperator('for', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 3) {
      return null // short circuit - no loop body
    }
    var test = clist[2]
    return test === symbolIn
      ? length < 5 ? null // short circuit - no loop body
        : forEach(space, clause, clist[1], evaluate(clist[3], space), 4)
      : forEach(space, clause, symbolUnderscore, evaluate(clist[1], space), 2)
  })

  // (for value in iterable body) OR
  // (for (value) in iterable body) OR
  // (for (key value) in iterable body)
  function forEach (space, clause, fields, next, offset) {
    var clist = clause.$
    var length = clist.length
    // find out vars
    var vars
    if (fields instanceof Symbol$) {
      vars = [fields.key]
    } else if (fields instanceof Tuple$) {
      vars = []
      var flist = fields.$
      for (var v = 0; v < flist.length; v++) {
        var field = flist[v]
        if (field instanceof Symbol$) {
          vars.push(field.key)
        }
      }
    } else {
      vars = [] // the value is not being caught.
    }
    // evaluate the iterator
    next = iterateOf(next)
    if (!next) {
      return null // no iterator.
    }
    // start to loop
    var result = null
    var values = next()
    while (typeof values !== 'undefined' && values !== null) {
      if (!Array.isArray(values)) {
        values = [values]
      }
      for (var i = 0; i < vars.length; i++) {
        space.var(vars[i], i < values.length ? values[i] : null)
      }
      try {
        for (var j = offset; j < length; j++) {
          result = evaluate(clist[j], space)
        }
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'continue') {
            result = signal.value
            values = next()
            continue
          }
          if (signal.id === 'break') {
            result = signal.value
            break
          }
        }
        throw signal
      }
      values = next()
    }
    return result
  }
}
