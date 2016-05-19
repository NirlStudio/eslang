'use strict'

module.exports = function operators$control ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var resolve = $void.resolve
  var Signal = $void.Signal
  var signalOf = $void.signalOf
  var Symbol$ = $void.Symbol

  var iterate = $void.$.iterate
  var symbolValueOf = $void.$.Symbol['value-of']
  var SymbolElse = symbolValueOf('else')

  operators['if'] = function (space, clause) {
    var length = clause.length
    if (length < 3) {
      return null // short circuit - the result will be null anyway.
    }

    // look for else
    var offset = clause.indexOf(SymbolElse, 1)
    if (offset === 1) {
      return null // short circuit - the cond is required.
    }

    var cond = evaluate(clause[1], space)
    var tb, fb
    if (offset > 0) {
      tb = clause.slice(2, offset)
      fb = clause.slice(offset + 1)
    } else {
      tb = length > 2 ? [clause[2]] : []
      fb = length > 3 ? clause.slice(3) : []
    }

    var option = cond !== false && cond !== null && cond !== 0 ? tb : fb
    if (option.length < 1) {
      return null
    }

    var result
    for (var i = 0; i < option.length; i++) {
      result = evaluate(option[i], space)
    }
    return result
  }

  function createLoopSignal (type) {
    var signal = signalOf(type)
    return function loopSignal ($, clause) {
      if ($.loops.length > 0) {
        signal($, clause)
      }
      return null // not in loop.
    }
  }

  operators['break'] = createLoopSignal('break')
  operators['continue'] = createLoopSignal('continue')

  function loopTest (space, cond) {
    // loop test function returns a BREAK flag
    if (cond instanceof Symbol$) {
      return function loopTestOfSymbol () {
        var value = resolve(space, cond)
        return value === false || value === null || value === 0
      }
    }

    if (Array.isArray(cond)) {
      return function loopTestOfClause () {
        var value = evaluate(cond, space)
        return value === false || value === null || value === 0
      }
    }

    return cond === false || cond === null || cond === 0
  }

  operators['while'] = function (space, clause) {
    var length = clause.length
    if (length < 3) {
      return null // short circuit - no loop body
    }

    var test = loopTest(space, clause[1])
    var dynamicTest = typeof test === 'function'

    var body = clause.slice(2)
    var result = null
    space.loops.push(test)
    while (true) {
      try { // break/continue can be used in condition expression.
        if (dynamicTest ? test() : test) {
          break
        }
        length = body.length
        for (var i = 0; i < length; i++) {
          result = evaluate(body[i], space)
        }
      } catch (signal) {
        if (signal instanceof Signal) {
          if (signal.type === 'continue') {
            result = signal.value
            continue
          }
          if (signal.type === 'break') {
            result = signal.value
            break
          }
        }
        space.loops.pop()
        throw signal
      }
    }
    space.loops.pop()
    return result
  }

  // (for value in iterable body) OR
  // (for (value) in iterable body) OR
  // (for (key value) in iterable body)
  function forEach (space, clause) {
    var length = clause.length
    if (length < 5) {
      return null // short circuit - no loop body
    }

    var keySymbol, valueSymbol
    var fields = clause[1]
    if (fields instanceof Symbol$) {
      keySymbol = null
      valueSymbol = fields
    } else if (Array.isArray(fields)) {
      if (fields.length > 1) {
        keySymbol = fields[0]
        valueSymbol = fields[1]
        if (!(keySymbol instanceof Symbol$) || !(valueSymbol instanceof Symbol$)) {
          return null // invalid fields expresion
        }
      } else if (fields.length > 0) {
        keySymbol = null
        valueSymbol = fields[0]
        if (!(valueSymbol instanceof Symbol$)) {
          return null // invalid fields expresion
        }
      } else {
        return null // missing fields expression
      }
    } else {
      return null // invalid field(s) expression
    }

    var iterable = evaluate(clause[3], space)
    var iterator = iterate(iterable)
    if (iterator === null || typeof iterator.next !== 'function') {
      return null // not an iterable object.
    }

    var body = clause.slice(4)
    var result = null
    space.loops.push(iterator)
    while (iterator.next()) {
      space.$[valueSymbol.key] = typeof iterator.value !== 'undefined' ? iterator.value : null
      if (keySymbol) {
        space.$[keySymbol.key] = typeof iterator.key !== 'undefined' ? iterator.key : null
      }
      try {
        length = body.length
        for (var i = 0; i < length; i++) {
          result = evaluate(body[i], space)
        }
      } catch (signal) {
        if (signal instanceof Signal) {
          if (signal.type === 'continue') {
            result = signal.value
            continue
          }
          if (signal.type === 'break') {
            result = signal.value
            break
          }
        }
        space.loops.pop()
        throw signal
      }
    }
    space.loops.pop()
    return result
  }

  // (for condition incremental body)
  operators['for'] = function (space, clause) {
    var length = clause.length
    if (length < 4) {
      return null // short circuit - no loop body
    }

    var step = clause[2]
    if (step instanceof Symbol$ && step.key === 'in') {
      return forEach(space, clause)
    }
    var runStep = Array.isArray(step)

    var test = loopTest(space, clause[1])
    var dynamicTest = typeof test === 'function'

    var body = clause.slice(3)
    var result = null
    space.loops.push(test)
    while (true) {
      try { // break/continue can be used in condition expression.
        if (dynamicTest ? test() : test) {
          break
        }
        length = body.length
        for (var i = 0; i < length; i++) {
          result = evaluate(body[i], space)
        }
        if (runStep) {
          evaluate(step, space)
        }
      } catch (signal) {
        if (signal instanceof Signal) {
          if (signal.type === 'continue') {
            result = signal.value
            if (runStep) {
              evaluate(step, space)
            }
            continue
          }
          if (signal.type === 'break') {
            result = signal.value
            break
          }
        }
        space.loops.pop()
        throw signal
      }
    }
    space.loops.pop()
    return result
  }
}
