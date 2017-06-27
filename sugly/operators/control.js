'use strict'

module.exports = function control ($void) {
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate
  var signalOf = $void.signalOf
  var thisCall = $void.thisCall
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator
  var symbolElse = sharedSymbolOf('else')
  var symbolIn = sharedSymbolOf('in')

  // (? cond true-branch false-branch)
  staticOperator('?', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 3) {
      return null // short circuit - the result will be null anyway.
    }
    var cond = evaluate(clist[1], space)
    if (cond === true ||
      cond !== false && cond !== null && cond !== 0) {
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
    if (cond === true || // would more people prefer true?
        cond !== false && cond !== null && cond !== 0) { //
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
          if (cond !== true && // it most likely is true when loop
              cond === false || cond === null || cond === 0) {
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

  // (for value in iterable body) OR
  // (for (value) in iterable body) OR
  // (for (key value) in iterable body)
  function forEach (space, clause) {
    var clist = clause.$
    var length = clist.length
    // find out vars
    var vars
    var fields = clist[1]
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
    var next = evaluate(clist[3], space)
    if (typeof next !== 'function') {
      next = thisCall(next, 'iterate')
      if (typeof next !== 'function') {
        return null // no iterator.
      }
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
        for (var j = 4; j < length; j++) {
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

  // (for init test incremental body)
  staticOperator('for', function (space, clause) {
    var clist = clause.$
    var length = clist.length
    if (length < 5) {
      return null // short circuit - no loop body
    }
    // prepare test
    var test = clist[2]
    if (test === symbolIn) {
      return forEach(space, clause)
    }
    test = loopTest(space, test)
    var staticCond = typeof test !== 'function'
    // prepare incremental
    var step = clist[3]
    // execute init expression
    var result = evaluate(clist[1], space)
    var cflag
    while (true) {
      try { // test condition
        cflag = false
        if (staticCond) {
          if (test) { return result }
        } else { // break/continue can be used in condition expression.
          var cond = test()
          if (cond !== true && // it most likely is true when loop
              cond === false || cond === null || cond === 0) {
            break
          }
        }
        // body
        for (var i = 4; i < length; i++) {
          result = evaluate(clist[i], space)
        }
        // incremental
        cflag = true
        evaluate(step, space)
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id === 'continue') {
            result = signal.value
            if (!cflag) {
              // continue can be used in step and incremental. But it will not
              // trigger incremental again even the loop indeed continues.
              evaluate(step, space)
            }
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
}
