'use strict'

module.exports = function function_ ($void) {
  var Signal = $void.Signal
  var Symbol$ = $void.Symbol
  var constant = $void.constant
  var readonly = $void.readonly
  var virtual = $void.virtual

  // param or (param ...) or ((param value) ...)
  function formatParameters (params) {
    var formatted = [true] // eliminate unwanted arguments.
    if (typeof params === 'undefined' || params === null) {
      return formatted
    }

    if (params instanceof Symbol$) {
      params = [params] // single parameter
    } else if (!Array.isArray(params)) {
      return formatted
    }

    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      if (p instanceof Symbol$) {
        if (p.key === '*') {
          formatted[0] = false // variant arguments
          break // the repeat indicator is always the last one
        }
        formatted.push([p, null])
      } else if (Array.isArray(p)) {
        if (p.length < 1) {
          continue
        }
        var sym = p[0]
        if (sym instanceof Symbol$) {
          formatted.push([sym, p.length > 1 ? p[1] : null]) // no evaluation.
        }
      }
    }
    return formatted
  }

  $void.functionIn = function $functionIn (space) {
    var evaluate = $void.evaluate
    var spaceStack = $void.spaceStack
    var createSpace = $void.createSpace // createSpace depending on functionIn.
    var $ = space.$

    // body must be a list of clauses
    constant($, 'function', function $function (params, body) {
      if (!Array.isArray(body) || body.length < 1) {
        return null // no function body
      }

      params = formatParameters(params)
      var fixedArgs = params.shift()

      function $F () {
        // new namespace
        var scope = createSpace(space)
        spaceStack.push(scope, $F)
        var ns = scope.$
        ns['do'] = $F
        ns['this'] = this
        Object.assign(ns, $F.context)
        var argc = ns['argc'] = arguments.length
        if (fixedArgs) {
          ns['argv'] = null
        } else {
          ns['argv'] = Array.prototype.slice.apply(arguments)
        }

        // binding arguments with default values
        var i = 0
        var length = params.length
        for (; i < length; i++) {
          var p = params[i]
          ns[p[0].key] = argc > i ? arguments[i] : p[1]
        }

        try {
          var result = null
          length = body.length
          for (i = 0; i < length; i++) {
            result = evaluate(body[i], scope)
          }
          spaceStack.pop()
          return result
        } catch (signal) {
          spaceStack.pop()
          if (signal instanceof Signal && signal.id === 'return') {
            return signal.value
          }
          throw signal
        }
      }

      readonly($F, 'context', null)
      readonly($F, 'fixed-args', fixedArgs)
      readonly($F, 'parameters', params)
      readonly($F, 'body', body)
      return $F
    })

    function createClosure (enclosing, params, fixedArgs, body) {
      function $C () {
        // new namespace
        var scope = createSpace(space)
        spaceStack.push(scope, $C)
        var ns = scope.$
        ns['do'] = $C
        ns['this'] = this
        Object.assign(ns, $C.context)
        var argc = ns['argc'] = arguments.length
        if (fixedArgs) {
          ns['argv'] = null
        } else {
          ns['argv'] = Array.prototype.slice.apply(arguments)
        }

        // aguments or parameter default values can overrride enclosed values.
        var i = 0
        var length = params.length
        for (; i < length; i++) {
          var p = params[i]
          ns[p[0].key] = argc > i ? arguments[i] : p[1]
        }

        try {
          var result = null
          length = body.length
          for (i = 0; i < length; i++) {
            result = evaluate(body[i], scope)
          }
          spaceStack.pop()
          return result
        } catch (signal) {
          spaceStack.pop()
          if (signal instanceof Signal && signal.id === 'return') {
            return signal.value
          }
          throw signal
        }
      }

      virtual($C, 'context', enclosing)
      readonly($C, 'fixed-args', fixedArgs)
      readonly($C, 'parameters', params)
      readonly($C, 'body', body)
      return $C
    }

    function createLambda (enclosing, params, body) {
      function $L () {
        var args = Array.prototype.slice.apply(arguments)

        enclosing = Object.assign(Object.create(null), enclosing)
        for (var i = 0; i < params.length; i++) {
          var p = params[i]
          enclosing[p[0].key] = args.length > i ? args[i] : p[1]
        }

        return $.lambda(enclosing, body[1], body.slice(2))
      }

      virtual($L, 'context', enclosing)
      readonly($L, 'fixed-args', true)
      readonly($L, 'parameters', params)
      readonly($L, 'body', body)
      return $L
    }

    constant($, 'lambda', function $lambda (enclosing, params, body) {
      if (!Array.isArray(body) || body.length < 1) {
        return null // no function body
      }

      if (typeof enclosing !== 'object' || enclosing === null) {
        enclosing = Object.create(null)
      }

      params = formatParameters(params)
      var fixedArgs = params.shift()

      var first = body[0]
      if (first instanceof Symbol$ && first.key === '>') {
        return createLambda(enclosing, params, body)
      } else {
        return createClosure(enclosing, params, fixedArgs, body)
      }
    })
  }
}
