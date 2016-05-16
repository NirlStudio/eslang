'use strict'

var $export = require('../export')

module.exports = function function_ ($void) {
  var set = $void.set
  var Signal = $void.Signal
  var Symbol$ = $void.Symbol

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
    var createSpace = $void.createSpace // createSpace depending on functionIn.
    var evaluate = $void.evaluate
    var $ = space.$

    // body must be a list of clauses
    $export($, 'function', function $function (params, body) {
      if (!Array.isArray(body) || body.length < 1) {
        return null // no function body
      }

      params = formatParameters(params)
      var fixedArgs = params.shift()

      function $F () {
        // new namespace
        var scope = createSpace(space)
        var ns = scope.$
        ns['this'] = this
        ns['self'] = $F
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
          return result
        } catch (signal) {
          if (signal instanceof Signal && signal.type === 'return') {
            return signal.value
          }
          throw signal
        }
      }

      $F.$fixedArgs = fixedArgs
      $F.$params = params
      $F.$body = body
      return $F
    })

    function createClosure (enclosing, params, fixedArgs, body) {
      function $C () {
        // new namespace
        var scope = createSpace($)
        var ns = scope.$
        ns['this'] = this
        ns['self'] = $C
        Object.assign(ns, enclosing)
        var argc = ns['argc'] = arguments.length
        if (fixedArgs) {
        } else {
          // variant arguments
          ns['argv'] = Array.prototype.slice.apply(arguments)
        }

        // aguments or parameter default values can overrride enclosed values.
        var i = 0
        var length = params.length
        for (; i < length; i++) {
          var p = params[i]
          ns[p[0]] = argc > i ? arguments[i] : p[1]
        }

        try {
          var result = null
          length = body.length
          for (i = 0; i < length; i++) {
            result = evaluate(body[i], scope)
          }
          return result
        } catch (signal) {
          if (signal instanceof Signal && signal.type === 'return') {
            return signal.value
          }
          throw signal
        }
      }

      $C.$enclosing = enclosing
      $C.$fixedArgs = fixedArgs
      $C.$params = params
      $C.$body = body
      return $C
    }

    function createLambda (enclosing, params, body) {
      function $L () {
        var args = Array.prototype.slice.apply(arguments)

        enclosing = Object.assign({}, enclosing)
        for (var i = 0; i < params.length; i++) {
          var p = params[i]
          set(enclosing, p[0], args.length > i ? args[i] : p[1])
        }

        return space.$.lambda(enclosing, body[1], body.slice(2))
      }

      $L.$enclosing = enclosing
      $L.$fixedArgs = true
      $L.$params = params
      $L.$body = body
      return $L
    }

    $export($, 'lambda', function $lambda (enclosing, params, body) {
      if (!Array.isArray(body) || body.length < 1) {
        return null // no function body
      }

      if (typeof enclosing !== 'object' || enclosing === null) {
        enclosing = {}
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
