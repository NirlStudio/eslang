'use strict'

module.exports = function function_ ($void) {
  var $ = $void.$
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var lambda = $void.lambda
  var stambda = $void.stambda
  var constambda = $void.constambda
  var evaluate_ = $void.evaluate
  var function_ = $void.function
  var ownsProperty = $void.ownsProperty
  var createLambdaSpace = $void.createLambdaSpace
  var createFunctionSpace = $void.createFunctionSpace
  var createEmptyOperation = $void.createEmptyOperation

  var alignWithGeneric = isFunctionLengthWritable()
    ? alignWithGenericDefault
    : alignWithGenericFallback

  function evaluate (tbody, scope) {
    var retval = evaluate_(tbody, scope)
    return ownsProperty(scope.context, 'retval') ? scope.context.retval : retval
  }

  $void.lambdaOf = function lambdaOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.lambda]
    var params = formatParameters(clause.$[offset++], space)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return lambda(createLambda(
        params, tbody, space.app, space.modules, space.local['-module']
      ), new Tuple$(code))
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.lambda.noop
        : lambda(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createLambda (params, tbody, app, modules, module_) {
    var createScope = createLambdaSpace.bind(null, app, modules, module_)
    var $lambda = function () {
      var scope = createScope()
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        scope.local[params[i]] = i < arguments.length ? arguments[i] : null
      }
      scope.prepare($lambda, this, Array.prototype.slice.call(arguments))
      // execution
      while (true) { // redo
        try {
          return evaluate(tbody, scope)
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createScope(),
                $lambda, this, params, signal.value, signal.count)
              continue
            } else if (signal.id !== 'exit') {
              // return, break & continue if they're not in loop.
              return signal.value
            }
            throw signal
          }
          warn('lambda:eval', 'unexpected error:', signal)
          return null
        }
      }
    }
    return alignWithGeneric($lambda, params.length)
  }

  $void.staticLambdaOf = function staticLambdaOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.stambda]
    var params = formatParameters(clause.$[offset++], space, 1)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return (params.length > 0 ? stambda : constambda)(
        createStaticLambda(params, tbody), new Tuple$(code)
      )
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.lambda.static
        : constambda(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createStaticLambda (params, tbody) {
    var key
    if (params.length > 0) {
      key = params[0]
    }
    var $stambda = function () {
      var scope = createLambdaSpace()
      // populate argument
      if (key) {
        key === 'this'
          ? (scope.context.this = this)
          : (scope.local[key] =
            typeof arguments[0] === 'undefined' ? null : arguments[0]
          )
      }
      // execution
      try {
        return evaluate(tbody, scope)
      } catch (signal) {
        if (signal instanceof Signal$) {
          if (signal.id !== 'exit') {
            // redo, return, break & continue if they're not in loop.
            return signal.value
          }
          throw signal
        }
        warn('stambda:eval', 'unexpected error:', signal)
        return null
      }
    }
    if (key === 'this') {
      return $stambda
    }
    $stambda = $stambda.bind(null)
    $stambda.this = null
    return alignWithGeneric($stambda, params.length)
  }

  $void.functionOf = function functionOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.function]
    var params = formatParameters(clause.$[offset++], space)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      var tbody = new Tuple$(body, true)
      code.push(tbody)
      return function_(
        createFunction(params, tbody, space.reserve()),
        new Tuple$(code)
      )
    } else {
      code.push($Tuple.blank) // empty body
      return params.length < 1 ? $.function.noop
        : function_(createEmptyOperation(), new Tuple$(code))
    }
  }

  function createFunction (params, tbody, parent) {
    var $func = function () {
      var scope = createFunctionSpace(parent)
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        scope.local[params[i]] = i < arguments.length ? arguments[i] : null
      }
      scope.prepare($func, this, Array.prototype.slice.call(arguments))
      // execution
      while (true) { // redo
        try {
          return evaluate(tbody, scope)
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createFunctionSpace(parent),
                $func, this, params, signal.value, signal.count)
              continue
            } else if (signal.id !== 'exit') {
              // return, break & continue if they're not in loop.
              return signal.value
            }
            throw signal
          } // for unexpected errors
          warn('function:eval', 'unexpected error:', signal)
          return null
        }
      }
    }
    return alignWithGeneric($func, params.length)
  }

  // to prepare a new context for redo
  function prepareToRedo (scope, me, t, params, value, count) {
    var args = count === 0 ? [] : count === 1 ? [value] : value
    scope.prepare(me, t, args)
    for (var i = 0; i < params.length; i++) {
      scope.local[params[i]] = i < args.length ? args[i] : null
    }
    return scope
  }

  // accepts param, (param ...) or ((param default-value) ...)
  // returns [params-list, code]
  function formatParameters (params, space, maxArgs) {
    if (params instanceof Symbol$) {
      return [[params.key], new Tuple$([params])]
    }
    if (!(params instanceof Tuple$) || params.$.length < 1) {
      return [[], $Tuple.empty]
    }
    params = params.$
    maxArgs = maxArgs > 0
      ? maxArgs > params.length ? params.length : maxArgs
      : params.length
    var args = []
    var code = []
    for (var i = 0; i < maxArgs; i++) {
      var param = params[i]
      if (param instanceof Symbol$) {
        args.push(param.key)
        code.push(param)
      }
    }
    return args.length > 0 ? [args, new Tuple$(code)] : [[], $Tuple.empty]
  }

  function isFunctionLengthWritable () {
    var func = function () {}
    try {
      Object.defineProperty(func, 'length', { value: 2 })
      return true
    } catch (err) {
      // fortunately, this should only happen in IE, ...
      if (err.number !== -2146823209) { // but if not, display its details.
        warn('runtime/function', 'function\'s length is not writable.', err)
      }
      return false
    }
  }

  function alignWithGenericDefault (func, paramNo) {
    return paramNo > 0 ? Object.defineProperties(func, {
      length: {
        value: paramNo
      },
      name: {
        value: undefined
      }
    }) : Object.defineProperty(func, 'name', {
      value: undefined
    })
  }

  function alignWithGenericFallback (func, paramNo) {
    func = alignParamNumber(func)
    return !func.name ? func : Object.defineProperty(func, 'name', {
      value: undefined
    })
  }

  function alignParamNumber (func, paramNo) {
    switch (paramNo) {
      case 1: return function (a) { return func.apply(this, arguments) }
      case 2: return function (a, b) { return func.apply(this, arguments) }
      case 3: return function (a, b, c) { return func.apply(this, arguments) }
      case 4: return function (a, b, c, d) {
        return func.apply(this, arguments)
      }
      case 5: return function (a, b, c, d, e) {
        return func.apply(this, arguments)
      }
      case 6: return function (a, b, c, d, e, f) {
        return func.apply(this, arguments)
      }
      case 7: return function (a, b, c, d, e, f, g) {
        return func.apply(this, arguments)
      }
      case 8: return function (a, b, c, d, e, f, g, h) {
        return func.apply(this, arguments)
      }
      case 9: return function (a, b, c, d, e, f, g, h, i) {
        return func.apply(this, arguments)
      }
      case 10: return function (a, b, c, d, e, f, g, h, i, j) {
        return func.apply(this, arguments)
      }
      case 11: return function (a, b, c, d, e, f, g, h, i, j, k) {
        return func.apply(this, arguments)
      }
      case 12: return function (a, b, c, d, e, f, g, h, i, j, k, l) {
        return func.apply(this, arguments)
      }
      case 13: return function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
        return func.apply(this, arguments)
      }
      case 14: return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
        return func.apply(this, arguments)
      }
      case 15: return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        return func.apply(this, arguments)
      }
      case 16: return function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        return func.apply(this, arguments)
      }
      default:
        return func
    }
  }
}
