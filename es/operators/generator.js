'use strict'

module.exports = function generator ($void) {
  var $ = $void.$
  var Symbol$ = $void.Symbol
  var $export = $void.export
  var isFalsy = $void.isFalsy
  var isTruthy = $void.isTruthy
  var thisCall = $void.thisCall
  var evaluate = $void.evaluate
  var bindThis = $void.bindThis
  var indexerOf = $void.indexerOf
  var isApplicable = $void.isApplicable
  var numberValueOf = $void.numberValueOf
  var staticOperator = $void.staticOperator
  var tryToUpdateName = $void.tryToUpdateName

  var symbolPairing = $.symbol.pairing

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
  staticOperator('===', generatorOf('is'), $['is'])
  staticOperator('!==', generatorOf('is-not'), $['is-not'])

  staticOperator('==', generatorOf('equals'), $['equals'])
  staticOperator('!=', generatorOf('not-equals'), $['not-equals'])

  generatorOf('compare')

  generatorOf('is-empty')
  generatorOf('not-empty')

  staticOperator('is-an', generatorOf('is-a'), $['is-a'])
  staticOperator('is-not-an', generatorOf('is-not-a'), $['is-not-a'])

  generatorOf('to-code')
  generatorOf('to-string')

  // comparer operations for number and string
  generatorOf('>')
  generatorOf('>=')
  generatorOf('<')
  generatorOf('<=')

  // arithmetic operators: -, ++, --, ...
  function arithmeticGeneratorOf (op) {
    var defaultOp = tryToUpdateName(function (this_) {
      return thisCall(this_, op)
    }, '*' + op)

    return staticOperator(op + '=', function (space, clause) {
      var clist = clause.$
      var length = clist.length
      if (length < 2) {
        return defaultOp
      }
      var args = []
      for (var i = 1; i < length; i++) {
        args.push(evaluate(clist[i], space))
      }
      return function (this_) {
        return thisCall.apply(null, [this_, op].concat(args))
      }
    }, function (a, b) {
      return typeof a === 'undefined' ? null
        : typeof b === 'undefined' ? thisCall(a, op) : thisCall(a, op, b)
    })
  }

  arithmeticGeneratorOf('+')
  arithmeticGeneratorOf('-')
  arithmeticGeneratorOf('*')
  arithmeticGeneratorOf('/')
  arithmeticGeneratorOf('%')

  // bitwise: ~, ...
  function safeBitwiseOpOf (op) {
    return function (a, b) {
      return op.call(typeof a === 'number' ? a : numberValueOf(a), b)
    }
  }

  function bitwiseGeneratorOf (key) {
    var op = $.number.proto[key]

    var defaultOp = tryToUpdateName(function (this_) {
      return op.call(typeof this_ === 'number' ? this_
        : numberValueOf(this_)
      )
    }, '*' + key)

    return staticOperator(key + '=', function (space, clause) {
      var clist = clause.$
      if (clist.length < 2) {
        return defaultOp
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

  // general: +, (str +=), (str -=)

  // logical operators: not, !, ...
  var defaultAnd = tryToUpdateName(function (this_) { return this_ }, '*&&')
  var logicalAnd = bindThis(null, function (a, b) {
    return typeof a === 'undefined' || (
      isFalsy(a) || typeof b === 'undefined' ? a : b
    )
  })

  staticOperator('and', staticOperator('&&', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return defaultAnd
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

  var defaultOr = tryToUpdateName(function (this_) { return this_ }, '*||')
  var logicalOr = bindThis(null, function (a, b) {
    return typeof a !== 'undefined' && (
      isTruthy(a) || typeof b === 'undefined' ? a : b
    )
  })

  staticOperator('or', staticOperator('||', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return defaultOr
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

  var booleanize = tryToUpdateName(bindThis(null, isTruthy), '*?')

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

  var booleanizeEmptiness = tryToUpdateName(function (this_) {
    return typeof this_ === 'undefined' || thisCall(this_, 'not-empty')
  }, '*?*')

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

  var booleanizeNull = tryToUpdateName(function (this_) {
    return typeof this_ === 'undefined' || this_ !== null
  }, '*??')

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
  var allAreTruthy = noop(function () {
    var factor
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (arguments[i] !== logicalAnd) {
        factor = arguments[i]
        if (isFalsy(factor)) {
          return factor
        }
      }
    }
    return typeof factor !== 'undefined' ? factor : true
  })
  var alwaysTrue = noop(function () { return true })
  staticOperator('both', staticOperator('all', function (space, clause) {
    var clist = clause.$
    var factors = []
    for (var i = 1, len = clist.length; i < len; i++) {
      var factor = evaluate(clist[i], space)
      // allow "and" to be used as a literal conjunction after "all".
      factor !== logicalAnd && factors.push(factor)
    }
    return factors.length < 1 ? alwaysTrue : function (this_) {
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
  }, allAreTruthy), allAreTruthy)

  var anyIsTruthy = noop(function () {
    var factor
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (arguments[i] !== logicalOr) {
        factor = arguments[i]
        if (isTruthy(factor)) {
          return factor
        }
      }
    }
    return typeof factor !== 'undefined' ? factor : false
  })
  var alwaysFalse = noop(function () { return false })
  staticOperator('either', staticOperator('any', function (space, clause) {
    var clist = clause.$
    var factors = []
    for (var i = 1, len = clist.length; i < len; i++) {
      var factor = evaluate(clist[i], space)
      // allow "or" to be used as a literal conjunction after "any".
      factor !== logicalOr && factors.push(factor)
    }
    return factors.length < 1 ? alwaysFalse : function (this_) {
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
  }, anyIsTruthy), anyIsTruthy)

  var notAnyIsTruthy = noop(function () {
    for (var i = 0, len = arguments.length; i < len; i++) {
      if (arguments[i] !== logicalOr && isTruthy(arguments[i])) {
        return false
      }
    }
    return true
  })

  $export($, 'nor', $.or)
  staticOperator('neither', staticOperator('not-any', function (space, clause) {
    var clist = clause.$
    var factors = []
    for (var i = 1, len = clist.length; i < len; i++) {
      var factor = evaluate(clist[i], space)
      // allow "nor" to be used as a literal conjunction after "neither".
      factor !== logicalOr && factors.push(factor)
    }
    return factors.length < 1 ? alwaysTrue : function (this_) {
      var factor
      for (var i = 0, len = factors.length; i < len; i++) {
        factor = factors[i]
        if (isApplicable(factor)) {
          factor = factor(this_)
        }
        if (isTruthy(factor)) {
          return false
        }
      }
      return true
    }
  }, notAnyIsTruthy), notAnyIsTruthy)

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
