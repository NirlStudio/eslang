'use strict'

module.exports = function operators$operator ($void) {
  var operators = $void.operators
  var evaluate = $void.evaluate
  var Symbol$ = $void.Symbol

  function populateOperatorCtx (ctx, operands) {
    var oprdc = operands.length
    ctx['%C'] = oprdc
    ctx['%V'] = operands
    for (var i = 0; i < 10; i++) {
      ctx['%' + i] = i < oprdc ? operands[i] : null
    }
  }

  // app defined operator: (operator name clause ...)
  // in the same space, an operator can only be defined once.
  operators['operator'] = function (space, impl) {
    if (!space.moduleIdentifier) {
      return null // operator can only be declared in module scope
    }

    var length = impl.length
    if (length < 3) {
      return null // an operator name & body are required
    }

    var name = impl[1]
    if (!(name instanceof Symbol$)) {
      return null // the name must be a symbol.
    }

    var key = name.key
    var operators, offset
    if (key === 'export') {
      if (length < 4) {
        return null // require name & body
      }
      name = impl[2]
      if (!(name instanceof Symbol$)) {
        return null
      }
      key = name.key
      operators = space.sealing || !space.parent
        ? space.operators : space.parent.operators
      offset = 3 // skip keyword export
    } else {
      operators = space.operators
      offset = 2
    }

    if (operators.hasOwnProperty(key)) {
      return false // an operator can only be defined once.
    }

    var statements = impl.slice(offset)
    operators[key] = function $operator (ctx, clause) {
      var oprds = []
      for (var i = 1; i < clause.length; i++) {
        oprds.push(evaluate(clause[i], ctx))
      }

      var oprStack = ctx.oprStack
      oprStack.push(oprds)
      populateOperatorCtx(ctx, oprds)
      var value = null
      try {
        for (var j = 0; j < statements.length; j++) {
          value = evaluate(statements[j], ctx)
        }
        oprStack.pop()
        populateOperatorCtx(ctx, oprStack.length > 0 ? oprStack[oprStack.length - 1] : [])
        return value
      } catch (signal) {
        oprStack.pop()
        populateOperatorCtx(ctx, oprStack.length > 0 ? oprStack[oprStack.length - 1] : [])
        throw signal
      }
    }
    return true
  }
}
