'use strict'

module.exports = function operators$operator ($) {
  var $operators = $.$operators
  var seval = $.$eval
  var isSymbol = $.Symbol.is
  var symbolKeyOf = $.Symbol['key-of']
  var symbolValueOf = $.Symbol['value-of']
  var SymbolExport = symbolValueOf('export')

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
  $operators['operator'] = function ($, impl) {
    if ($.moduleSpaceIdentifier !== $.spaceIdentifier) {
      return null // operator can only be declared in module scope
    }

    var length = impl.length
    if (length < 3) {
      return null // an operator name & body are required
    }

    var name = impl[1]
    if (!isSymbol(name)) {
      return null // the name must be a symbol.
    }

    var exporting, offset
    if (name === SymbolExport) {
      if (length < 4) {
        return null // require name & body
      }
      name = impl[2]
      if (!isSymbol(name)) {
        return null
      }
      exporting = true
      offset = 3
    } else {
      exporting = false
      offset = 2
    }

    var key = symbolKeyOf(name)
    var existed = $.$operators.hasOwnProperty(key)
    if (exporting) {
      if (existed) {
        return false
      }
    } else {
      // trying to define a new operator.
      if (!Object.prototype.hasOwnProperty.call($, '$operators')) {
        // create a local operator table.
        $.$operators = Object.assign({}, $.$operators)
      } else if (existed) {
        return false // cannot re-create an operator in the same space.
      }
    }

    var statements = impl.slice(offset)
    $.$operators[key] = function $OPR (ctx, clause) {
      var oprds = []
      for (var i = 1; i < clause.length; i++) {
        oprds.push(seval(clause[i], ctx))
      }

      var oprStack = ctx.$OprStack
      oprStack.push(oprds)
      populateOperatorCtx(ctx, oprds)
      var value = null
      try {
        for (var j = 0; j < statements.length; j++) {
          value = seval(statements[j], ctx)
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
