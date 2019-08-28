'use strict'

module.exports = function generator ($void) {
  var $ = $void.$
  var Symbol$ = $void.Symbol
  var isFalsy = $void.isFalsy
  var isTruthy = $void.isTruthy
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var symbolPairing = $.symbol.pairing
  var bindThis = $void.bindThis
  var indexerOf = $void.indexerOf
  var isApplicable = $void.isApplicable
  var numberValueOf = $void.numberValueOf
  var staticOperator = $void.staticOperator
  var staticCombine = $void.staticOperators['+']

  function noop (this_) {
    return this_
  }

  function generatorOf (op, impl, defaultOp) {
    impl || (impl = noop(function (space, clause) {
      var clist = clause.$
      switch (clist.length) {
        case 1:
          return function (this_) {
            return thisCall(this_, op)
          }
        case 2:
          var base = evaluate(clist[1], space)
          return function (this_) {
            return thisCall(this_, op, base)
          }
        default:
      }
      var args = []
      for (var i = 1, len = clist.length; i < len; i++) {
        args.push(evaluate(clist[i], space))
      }
      return function (this_) {
        return thisCall.apply(null, [this_, op].concat(args))
      }
    }))

    defaultOp || (defaultOp = noop(function (this_) {
      return arguments.length < 2 ? thisCall(this_, op)
        : thisCall.apply(null, [this_, op].concat(
          Array.prototype.slice.call(arguments, 1)
        ))
    }))

    return staticOperator(op, impl, defaultOp)
  }

  // universal operations
  generatorOf('is')
  generatorOf('===')
  generatorOf('is-not')
  generatorOf('!==')

  generatorOf('equals')
  generatorOf('==')
  generatorOf('not-equals')
  generatorOf('!=')

  generatorOf('compare')

  generatorOf('is-empty')
  generatorOf('not-empty')

  generatorOf('is-a')
  generatorOf('is-an')
  generatorOf('is-not-a')
  generatorOf('is-not-an')

  generatorOf('to-code')
  generatorOf('to-string')

  // comparer operations for number and string
  generatorOf('>')
  generatorOf('>=')
  generatorOf('<')
  generatorOf('<=')

  // global arithmetic operators: -, ++, --, ...
  var numberOrString = noop(function (this_) {
    return typeof this_ === 'number' ? this_ : thisCall(this_, 'to-string')
  })

  staticOperator('+=', function (space, clause) {
    var value = staticCombine(space, clause)
    return typeof value === 'number' ? function (this_) {
      return (typeof this_ === 'number' ? this_ : numberValueOf(this_)) + value
    } : function (this_) {
      return (typeof this_ === 'string' ? this_
        : thisCall(this_, 'to-string')
      ) + value
    }
  }, bindThis(null, numberOrString))

  staticOperator('-=', function (space, clause) {
    var value = staticCombine(space, clause)
    return typeof value === 'number' ? function (this_) {
      return (typeof this_ === 'number' ? this_ : numberValueOf(this_)) - value
    } : function (this_) {
      if (typeof this_ !== 'string') {
        this_ = thisCall(this_, 'to-string')
      }
      return this_.endsWith(value)
        ? this_.substring(0, this_.length - value.length) : this_
    }
  }, bindThis(null, numberOrString))

  var defaultMultiply = bindThis(null, numberValueOf)
  staticOperator('*=', function (space, clause) {
    var clist = clause.$
    var len = clist.length
    if (len < 2) {
      return defaultMultiply
    }
    var value = evaluate(clist[1], space)
    if (typeof value !== 'number') {
      value = numberValueOf(value)
    }
    for (var i = 2; i < len; i++) {
      var factor = evaluate(clist[i], space)
      value *= (typeof factor === 'number' ? factor : numberValueOf(factor))
    }
    return value === 1 ? defaultMultiply : function (this_) {
      return (typeof this_ === 'number' ? this_
        : numberValueOf(this_)
      ) * value
    }
  }, defaultMultiply)

  var defaultDivide = bindThis(null, numberValueOf)
  staticOperator('/=', function (space, clause) {
    var clist = clause.$
    var len = clist.length
    if (len < 2) {
      return defaultDivide
    }
    var value = evaluate(clist[1], space)
    if (typeof value !== 'number') {
      value = numberValueOf(value)
    }
    for (var i = 2; i < len; i++) {
      var factor = evaluate(clist[i], space)
      value *= (typeof factor === 'number' ? factor : numberValueOf(factor))
    }
    return value === 1 ? defaultDivide : function (this_) {
      return (typeof this_ === 'number' ? this_
        : numberValueOf(this_)
      ) / value
    }
  }, defaultDivide)

  var mod = $.number.proto['%']
  var defaultMod = bindThis(null, numberValueOf)
  staticOperator('%=', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return defaultMod
    }
    var value = evaluate(clist[1], space)
    return function (this_) {
      return mod.call(typeof this_ === 'number' ? this_
        : numberValueOf(this_), value
      )
    }
  }, defaultMod)

  // bitwise: ~, ...
  function safeBitwiseOpOf (op) {
    return function (a, b) {
      return op.call(typeof a === 'number' ? a : numberValueOf(a), b)
    }
  }

  function bitwiseGeneratorOf (key) {
    var op = $.number.proto[key]

    return staticOperator(key + '=', function (space, clause) {
      var clist = clause.$
      if (clist.length < 2) {
        return function (this_) {
          return op.call(typeof this_ === 'number' ? this_
            : numberValueOf(this_)
          )
        }
      }
      var value = evaluate(clist[1], space)
      return function (this_) {
        return op.call(typeof this_ === 'number' ? this_
          : numberValueOf(this_), value
        )
      }
    }, safeBitwiseOpOf(op))
  }

  bitwiseGeneratorOf('&')
  bitwiseGeneratorOf('|')
  bitwiseGeneratorOf('^')
  bitwiseGeneratorOf('<<')
  bitwiseGeneratorOf('>>')
  bitwiseGeneratorOf('>>>')

  // control: ?

  // general: +, (str +=), (str -=)

  // logical operators: not, ...
  var logicalAnd = bindThis(null, function (a, b) {
    return isFalsy(a) || arguments.length < 2 ? a : b
  })

  staticOperator('and', staticOperator('&&', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return logicalAnd
    }
    var value
    for (var i = 1, len = clist.length; i < len; i++) {
      value = evaluate(clist[i], space)
      if (isFalsy(value)) {
        break
      }
    }
    return function (this_) {
      return logicalAnd(this_, value)
    }
  }, logicalAnd), logicalAnd)

  var logicalOr = bindThis(null, function (a, b) {
    return isTruthy(a) || arguments.length < 2 ? a : b
  })

  staticOperator('or', staticOperator('||', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return logicalOr
    }
    var value
    for (var i = 1, len = clist.length; i < len; i++) {
      value = evaluate(clist[i], space)
      if (isTruthy(value)) {
        break
      }
    }
    return function (this_) {
      return logicalOr(this_, value)
    }
  }, logicalOr), logicalOr)

  var booleanize = bindThis(null, isTruthy)

  staticOperator('?', function (space, clause) {
    var clist = clause.$
    switch (clist.length) {
      case 0:
      case 1: // booleanize function.
        return booleanize
      case 2: // pre-defined boolean fallback
        var fallback = evaluate(clist[1], space)
        return function (this_) {
          return isTruthy(this_) ? this_ : fallback
        }
      default: // predefined boolean switch
        var truthy = evaluate(clist[1], space)
        var falsy = evaluate(clist[2], space)
        return function (this_) {
          return isTruthy(this_) ? truthy : falsy
        }
    }
  }, booleanize) // the entity is also the booleanize function.

  var booleanizeEmptiness = bindThis(null, function (this_) {
    return thisCall(this_, 'not-empty')
  })

  staticOperator('?*', function (space, clause) {
    var clist = clause.$
    switch (clist.length) {
      case 0:
      case 1:
        return booleanizeEmptiness
      case 2: // pre-defined emptiness fallback
        var fallback = evaluate(clist[1], space)
        return function (this_) {
          return thisCall(this_, 'not-empty') ? this_ : fallback
        }
      default: // predefined emptiness switch
        var truthy = evaluate(clist[1], space)
        var falsy = evaluate(clist[2], space)
        return function (this_) {
          return thisCall(this_, 'not-empty') ? truthy : falsy
        }
    }
  }, booleanizeEmptiness)

  var booleanizeNull = bindThis(null, function (this_) {
    return this_ !== null && typeof this_ !== 'undefined'
  })

  staticOperator('??', function (space, clause) {
    var clist = clause.$
    switch (clist.length) {
      case 0:
      case 1:
        return booleanizeNull
      case 2: // pre-defined null fallback
        var fallback = evaluate(clist[1], space)
        return function (this_) {
          return this_ !== null && typeof this_ !== 'undefined'
            ? this_ : fallback
        }
      default: // predefined emptiness switch
        var truthy = evaluate(clist[1], space)
        var falsy = evaluate(clist[2], space)
        return function (this_) {
          return this_ !== null && typeof this_ !== 'undefined' ? truthy : falsy
        }
    }
  }, booleanizeNull)

  // logical combinator
  var allAreTruthy = staticOperator('all', function (space, clause) {
    var clist = clause.$
    var factors = []
    for (var i = 1, len = clist.length; i < len; i++) {
      var factor = evaluate(clist[i], space)
      // allow "and" to be used as a literal conjunction after "all".
      factor !== logicalAnd && factors.push(factor)
    }
    return factors.length < 1 ? noop : function (this_) {
      var factor
      for (var i = 0, len = factors.length; i < len; i++) {
        factor = factors[i]
        if (isApplicable(factor)) {
          factor = factor(this_)
        }
        if (isFalsy(factor)) {
          return factor
        }
      }
      return factor
    }
  }, function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (isFalsy(arguments[i])) {
        return arguments[i]
      }
    }
    return i > 0 ? arguments[i - 1] : null
  })

  staticOperator('both', allAreTruthy, function (a, and, b) {
    switch (arguments.length) {
      case 0: // (:both )
        return null
      case 1: // (:both a)
        return a
      case 2: // (:both a) or (:both a and)
        return and === logicalAnd ? a : logicalAnd(a, and)
      default: // (:both a b ...) or (:both a and b)
        return and === logicalAnd ? logicalAnd(a, b) : logicalAnd(a, and)
    }
  })

  var anyIsTruthy = staticOperator('any', function (space, clause) {
    var clist = clause.$
    var factors = []
    for (var i = 1, len = clist.length; i < len; i++) {
      var factor = evaluate(clist[i], space)
      // allow "or" to be used as a literal conjunction after "any".
      factor !== logicalOr && factors.push(factor)
    }
    return factors.length < 1 ? noop : function (this_) {
      var factor
      for (var i = 0, len = factors.length; i < len; i++) {
        factor = factors[i]
        if (isApplicable(factor)) {
          factor = factor(this_)
        }
        if (isTruthy(factor)) {
          return factor
        }
      }
      return factor
    }
  }, function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (isTruthy(arguments[i])) {
        return arguments[i]
      }
    }
    return i > 0 ? arguments[i - 1] : null
  })

  staticOperator('either', anyIsTruthy, function (a, or, b) {
    switch (arguments.length) {
      case 0: // (:either )
        return null
      case 1: // (:either a)
        return a
      case 2: // (:either a) or (:either a or)
        return or === logicalOr ? a : logicalOr(a, or)
      default: // (:either a b ...) or (:either a or b)
        return or === logicalOr ? logicalOr(a, b) : logicalOr(a, or)
    }
  })

  // general predictor
  staticOperator('*', function (space, clause) {
    var clist = clause.$
    var len = clist.length
    if (len < 2) {
      return null // (*) returns null.
    }
    var sym = clist[1]
    var i
    if (sym instanceof Symbol$) {
      i = 2; sym = sym.key
    } else {
      i = 1; sym = symbolPairing
    }
    var args = []
    for (; i < len; i++) {
      args.push(evaluate(clist[i], space))
    }
    return sym === symbolPairing
      // the same with the behavior of evaluate function.
      ? args.length < 1 ? function (this_) {
        return indexerOf(this_)()
      } : function (this_) {
        return indexerOf(this_).apply(this_, args)
      }
      // general this call generator.
      : args.length < 1 ? function (this_) {
        return thisCall(this_, sym)
      } : function (this_) {
        return thisCall.apply(null, [this_, sym].concat(args))
      }
  }, null) // being referred, * functions as a null.
}
