'use strict'

module.exports = function operators$control ($) {
  var $operators = $.$operators
  var set = $.$set
  var seval = $.$eval
  var beval = $.$beval
  var resolve = $.$resolve
  var Signal = $.$Signal
  var createSignalOf = $.$createSignalOf

  var symbolValueOf = $.Symbol['value-of']
  var isSymbol = $.Symbol['is-type-of']
  var SymbolElse = symbolValueOf('else')
  var SymbolIn = symbolValueOf('in')

  $operators['if'] = function ($, clause) {
    var length = clause.length
    if (length < 3) {
      return null // short circuit - the result will be null anyway.
    }

    // look for else
    var offset = clause.indexOf(SymbolElse, 1)
    if (offset === 1) {
      return null // short circuit - the cond is required.
    }

    var cond = seval(clause[1], $)
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
    return option.length === 1 ? seval(option[0], $) : beval($, option)
  }

  function createLoopSignal (type) {
    var signal = createSignalOf(type)
    return function loopSignal ($, clause) {
      if ($.$loops.length > 0) {
        signal($, clause)
      }
      return null // not in loop.
    }
  }

  $operators['break'] = createLoopSignal('break')
  $operators['continue'] = createLoopSignal('continue')

  function loopTest ($, cond) {
    // loop test function returns a BREAK flag
    if (isSymbol(cond)) {
      return function loopTestOfSymbol () {
        var value = resolve($, cond)
        return value === false || value === null || value === 0
      }
    }

    if (Array.isArray(cond)) {
      return function loopTestOfClause () {
        var value = seval(cond, $)
        return value === false || value === null || value === 0
      }
    }

    return cond === false || cond === null || cond === 0
  }

  $operators['while'] = function ($, clause) {
    var length = clause.length
    if (length < 3) {
      return null // short circuit - no loop body
    }

    var test = loopTest($, clause[1])
    var dynamicTest = typeof test === 'function'

    var body = clause.slice(2)
    var result = null
    $.$loops.push(test)
    while (true) {
      try { // break/continue can be used in condition expression.
        if (dynamicTest ? test() : test) {
          break
        }
        result = beval($, body)
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
        $.$loops.pop()
        throw signal
      }
    }
    $.$loops.pop()
    return result
  }

  // (for value in iterable body) OR
  // (for (value) in iterable body) OR
  // (for (key value) in iterable body)
  function forEach ($, clause) {
    var length = clause.length
    if (length < 5) {
      return null // short circuit - no loop body
    }

    var keySymbol, valueSymbol
    var fields = clause[1]
    if (isSymbol(fields)) {
      keySymbol = null
      valueSymbol = fields
    } else if (Array.isArray(fields)) {
      if (fields.length > 1) {
        keySymbol = fields[0]
        valueSymbol = fields[1]
        if (!isSymbol(keySymbol) || !isSymbol(valueSymbol)) {
          return null // invalid fields expresion
        }
      } else if (fields.length > 0) {
        keySymbol = null
        valueSymbol = fields[0]
        if (!isSymbol(valueSymbol)) {
          return null // invalid fields expresion
        }
      } else {
        return null // missing fields expression
      }
    } else {
      return null // invalid field(s) expression
    }

    var iterable = seval(clause[3], $)
    var iterator = $.iterate(iterable)
    if (iterator === null || typeof iterator.next !== 'function') {
      return null // not an iterable object.
    }

    var body = clause.slice(4)
    var result = null
    $.$loops.push(iterator)
    while (iterator.next()) {
      set($, valueSymbol, typeof iterator.value !== 'undefined' ? iterator.value : null)
      if (keySymbol) {
        set($, keySymbol, typeof iterator.key !== 'undefined' ? iterator.key : null)
      }
      try {
        result = beval($, body)
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
        $.$loops.pop()
        throw signal
      }
    }
    $.$loops.pop()
    return result
  }

  // (for condition incremental body)
  $operators['for'] = function ($, clause) {
    var length = clause.length
    if (length < 4) {
      return null // short circuit - no loop body
    }

    var step = clause[2]
    if (step === SymbolIn) {
      return forEach($, clause)
    }
    var runStep = Array.isArray(step)

    var test = loopTest($, clause[1])
    var dynamicTest = typeof test === 'function'

    var body = clause.slice(3)
    var result = null
    $.$loops.push(test)
    while (true) {
      try { // break/continue can be used in condition expression.
        if (dynamicTest ? test() : test) {
          break
        }
        result = beval($, body)
        if (runStep) {
          seval(step, $)
        }
      } catch (signal) {
        if (signal instanceof Signal) {
          if (signal.type === 'continue') {
            result = signal.value
            if (runStep) {
              seval(step, $)
            }
            continue
          }
          if (signal.type === 'break') {
            result = signal.value
            break
          }
        }
        $.$loops.pop()
        throw signal
      }
    }
    $.$loops.pop()
    return result
  }
}
