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
  var evaluate = $void.evaluate
  var function_ = $void.function
  var createLambdaSpace = $void.createLambdaSpace
  var createFunctionSpace = $void.createFunctionSpace
  var createEmptyOperation = $void.createEmptyOperation

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
    var $lambda = function () {
      var scope = createLambdaSpace(app, modules, module_)
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        var param = params[i]
        scope.local[param[0]] = i < arguments.length ? arguments[i] : param[1]
      }
      scope.prepare($lambda, this, Array.prototype.slice.call(arguments))
      // execution
      while (true) { // redo
        try {
          return evaluate(tbody, scope)
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createLambdaSpace(app, modules, module_),
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
    return $lambda
  }

  $void.staticLamdaOf = function staticLamdaOf (space, clause, offset) {
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
    var key, defaultValue
    if (params.length > 0) {
      key = params[0][0]
      defaultValue = params[0][1]
    }
    var $stambda = function () {
      var scope = createLambdaSpace()
      // populate argument
      if (key) {
        scope.local[key] = key === 'this' ? this
          : arguments.length > 0 ? arguments[0] : defaultValue
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
    if (key !== 'this') {
      $stambda = $stambda.bind(null)
      $stambda.this = null
    }
    return $stambda
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
        var param = params[i]
        scope.local[param[0]] = i < arguments.length ? arguments[i] : param[1]
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
    return $func
  }

  // to prepare a new context for redo
  function prepareToRedo (scope, me, t, params, value, count) {
    var args = count === 0 ? [] : count === 1 ? [value] : value
    scope.prepare(me, t, args)
    for (var i = 0; i < params.length; i++) {
      var param = params[i]
      scope.local[param[0]] = i < args.length ? args[i] : param[1]
    }
    return scope
  }

  // accepts param, (param ...) or ((param default-value) ...)
  // returns [params-list, code]
  function formatParameters (params, space, maxArgs) {
    if (params instanceof Symbol$) {
      return [[[params.key, null]], new Tuple$([params])]
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
    var hasDefault = false
    var counter = 0
    for (var i = 0; i < maxArgs; i++) {
      var param = params[i]
      if (param instanceof Symbol$) {
        args.push([param.key, null])
        code.push([param, null])
        counter++
      } else if (param instanceof Tuple$ && param.length > 0) {
        var sym = param.$[0]
        if (sym instanceof Symbol$) {
          if (param.length < 2) {
            args.push([sym.key, null])
            code.push([sym, null])
            counter++
          } else {
            var value = evaluate(param.$[1], space)
            hasDefault = $Tuple.accepts(value) && value !== null
            args.push([sym.key, hasDefault ? value : null])
            code.push([sym, hasDefault ? value : null])
            counter++
          }
        }
      }
    }
    if (counter === 0) {
      return [[], $Tuple.empty]
    }
    var list = []
    for (i = 0; i < code.length; i++) {
      var pair = code[i]
      if (pair[1] === null) {
        list.push(pair[0])
      } else {
        list.push(new Tuple$(pair))
      }
    }
    return [args, new Tuple$(list)]
  }
}
