'use strict'

module.exports = function operators$function ($void) {
  var Symbol$ = $void.Symbol
  var operators = $void.operators
  var resolve = $void.resolve
  var evaluate = $void.evaluate
  var signalOf = $void.signalOf

  // (= symbols > params body ...)
  // symbols can be symbol or (symbol ...) or (@ prop: value ...)
  function lambdaCreate (space, symbols, params, body) {
    var enclosing = Object.create(null)
    if (symbols instanceof Symbol$) {
      enclosing[symbols.key] = resolve(space, symbols)
      return space.$.lambda(enclosing, params, body)
    }

    if (!Array.isArray(symbols)) {
      return null // invalid expression
    }

    if (symbols.length < 1) {
      return space.$.lambda(enclosing, params, body)
    }

    // enclosing context values.
    if (symbols[0] instanceof Symbol$ && symbols[0].key === '@') {
      // it should be an object expression: (@ prop: value ...)
      var obj = evaluate(symbols, space)
      if (typeof obj === 'object' && obj !== null) {
        enclosing = obj
      }
    } else {
      // it should be an symbol list: (sym ...)
      for (var i = 0; i < symbols.length; i++) {
        var s = symbols[i]
        if (s instanceof Symbol$) {
          enclosing[s.key] = resolve(space, s)
        }
      }
    }

    return space.$.lambda(enclosing, params, body)
  }

  operators['='] = function (space, clause) {
    if (clause.length < 3) {
      return null
    }

    var c1 = clause[1]
    if (c1 instanceof Symbol$ && c1.key === '>') {
      // (= > params body)
      if (clause.length < 4) {
        return null
      }
      return lambdaCreate(space, [], clause[2], clause.slice(3))
    }

    var c2 = clause[2]
    if (c2 instanceof Symbol$ && c2.key === '>') {
      // (= enclosing > params body)
      if (clause.length < 5) {
        return null
      }
      return lambdaCreate(space, c1, clause[3], clause.slice(4))
    }

    // (= param body ...)
    return space.$.function(c1, clause.slice(2))
  }

  // (=> params body)
  operators['=>'] = function (space, clause) {
    if (clause.length < 3) {
      return null
    }
    return lambdaCreate(space, [], clause[1], clause.slice(2))
  }

  // leave function or module.
  operators['return'] = signalOf('return')
  // leave a module or an event callback
  operators['exit'] = signalOf('exit')
  // request to quit the whole application.
  operators['halt'] = signalOf('halt')
}
