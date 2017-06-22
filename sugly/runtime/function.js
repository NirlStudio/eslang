'use strict'

module.exports = function function_ ($void) {
  var $Tuple = $void.$.tuple
  var $Symbol = $void.$.symbol
  var Tuple$ = $void.Tuple
  var Signal$ = $void.Signal
  var Symbol$ = $void.Symbol
  var lambda = $void.lambda
  var evaluate = $void.evaluate
  var function_ = $void.function
  var createLambdaSpace = $void.createLambdaSpace
  var createFunctionSpace = $void.createFunctionSpace

  $void.lambdaOf = function lambdaOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.lambda]
    var params = formatParameters(clause.$[offset++], space)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      code.push(new Tuple$(body, true))
      return lambda(createLambda(params, body), code)
    } else {
      code.push($Tuple.plain) // empty body
      return lambda(function () { // use an empty function
        return null
      }, code)
    }
  }

  function createLambda (params, body) {
    var me = function () {
      var scope = createLambdaSpace()
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        var param = params[i]
        scope.local[param[0]] = i < arguments.length ? arguments[i] : param[1]
      }
      scope.context['do'] = me
      scope.context['this'] = typeof this === 'undefined' ? null : this
      scope.context['arguments'] = Array.prototype.slice.call(arguments)
      // execution
      while (true) { // redo
        try {
          var result = null
          for (var expr in body) {
            result = evaluate(expr, scope)
          }
          return result
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createLambdaSpace(),
                me, this, params, signal.value, signal.count)
              continue
            } else if (signal.id !== 'exit') {
              // return, break & continue if they're not in loop.
              return signal.value
            }
            throw signal
          }
          console.warn('lambda > unexpected error:', signal)
          return null
        }
      }
    }
    return me
  }

  $void.functionOf = function functionOf (space, clause, offset) {
    // compile code
    var code = [$Symbol.lambda] // a function wil be encoded to a lambda too.
    var params = formatParameters(clause.$[offset++], space)
    code.push(params[1])
    params = params[0]
    var body = clause.$.slice(offset) || []
    if (body.length > 0) {
      code.push(new Tuple$(body, true))
      return function_(createFunction(params, body, space.local, space.locals),
        code)
    } else {
      code.push($Tuple.plain) // empty body
      return function_(function () { // use an empty function
        return null
      }, code)
    }
  }

  function createFunction (params, body, local, locals) {
    var parent = {
      local: local,
      locals: locals
    }
    var me = function () {
      var scope = createFunctionSpace(parent)
      // populate arguments
      for (var i = 0; i < params.length; i++) {
        var param = params[i]
        scope.local[param[0]] = i < arguments.length ? arguments[i] : param[1]
      }
      scope.context['do'] = me
      scope.context['this'] = typeof this === 'undefined' ? null : this
      scope.context['arguments'] = Array.prototype.slice.call(arguments)
      // execution
      while (true) { // redo
        try {
          var result = null
          for (var expr in body) {
            result = evaluate(expr, scope)
          }
          return result
        } catch (signal) {
          if (signal instanceof Signal$) {
            if (signal.id === 'redo') { // clear space context
              scope = prepareToRedo(createFunctionSpace(parent),
                me, this, params, signal.value, signal.count)
              continue
            } else if (signal.id !== 'exit') {
              // return, break & continue if they're not in loop.
              return signal.value
            }
            throw signal
          } // for unexpected errors
          console.warn('function > unexpected error:', signal)
          return null
        }
      }
    }
    return me
  }

  // to prepare a new context for redo
  function prepareToRedo (scope, me, t, params, value, count) {
    scope.context['do'] = me
    scope.context['this'] = typeof t === 'undefined' ? null : t
    var args = scope.context['arguments'] = count === 0 ? []
      : count === 1 ? [value] : value
    for (var i = 0; i < params.length; i++) {
      var param = params[i]
      scope.local[param[0]] = i < args.length ? args[i] : param[1]
    }
    return scope
  }

  // accepts param, (param ...) or ((param default-value) ...)
  // returns [params-list, code]
  function formatParameters (params, space) {
    if (params instanceof Symbol$) {
      return [[[params.key, null]], params]
    }
    if (!(params instanceof Tuple$) || params.$.length < 1) {
      return [[], $Tuple.empty]
    }
    var args = []
    var code = []
    var hasDefault = false
    var counter = 0
    params = params.$
    for (var i = 0; i < params.length; i++) {
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
    if (counter === 1 && !hasDefault) {
      return [args, code[0][0]]
    }
    var list = []
    for (var pair in code) {
      if (pair[1] === null) {
        list.push(pair[0])
      } else {
        list.push(new Tuple$(pair))
      }
    }
    return [args, new Tuple$(list)]
  }
}
