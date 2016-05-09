'use strict'

module.exports = function sfunction ($) {
  var set = $.$set
  var beval = $.$beval
  var Signal = $.$Signal

  var symbolValueOf = $.Symbol['value-of']
  var isSymbol = $.Symbol.is
  var SymbolLambdaShort = symbolValueOf('>')
  var SymbolRepeat = symbolValueOf('*')

  // param or (param ...) or ((param value) ...)
  function formatParameters (params) {
    var formatted = [true] // eliminate unwanted arguments.
    if (typeof params === 'undefined' || params === null) {
      return formatted
    }

    if (isSymbol(params)) {
      params = [params] // single parameter
    } else if (!Array.isArray(params)) {
      return formatted
    }

    for (var i = 0; i < params.length; i++) {
      var p = params[i]
      if (isSymbol(p)) {
        if (p === SymbolRepeat) {
          formatted[0] = false // variant arguments
          break // the repeat indicator is always the last one
        }
        formatted.push([p, null])
      } else if (Array.isArray(p)) {
        if (p.length < 1) {
          continue
        }
        var sym = p[0]
        if (isSymbol(sym)) {
          formatted.push([sym, p.length > 1 ? p[1] : null]) // no evaluation.
        }
      }
    }
    return formatted
  }

  $.$functionIn = function $functionIn ($) {
    var createSpace = $.$createSpace

    // body must be a list of clauses
    return function $function (params, body) {
      if (!Array.isArray(body) || body.length < 1) {
        return null // no function body
      }

      params = formatParameters(params)
      var fixedArgs = params.shift()

      var f = function $F () {
        var args = Array.prototype.slice.apply(arguments)
        // new namespace
        var ns = createSpace($)
        ns[':'] = this
        ns['self'] = $F
        if (!fixedArgs) {
          ns['argc'] = args.length
          ns['argv'] = args
        }

        // binding arguments with default values
        for (var i = 0; i < params.length; i++) {
          var p = params[i]
          set(ns, p[0], args.length > i ? args[i] : p[1])
        }

        try {
          return beval(ns, body)
        } catch (signal) {
          if (signal instanceof Signal && signal.type === 'return') {
            return signal.value
          }
          throw signal
        }
      }

      f.$fixedArgs = fixedArgs
      f.$params = params
      f.$body = body
      return f
    }
  }

  function createClosure ($, enclosing, params, fixedArgs, body) {
    var createSpace = $.$createSpace

    function $C () {
      var args = Array.prototype.slice.apply(arguments)
      // new namespace
      var ns = createSpace($)
      ns[':'] = this
      ns['self'] = $C
      Object.assign(ns, enclosing)

      // variant arguments
      if (!fixedArgs) {
        ns['argc'] = args.length
        ns['argv'] = args
      }

      // aguments or parameter default values can overrride enclosed values.
      for (var i = 0; i < params.length; i++) {
        var p = params[i]
        set(ns, p[0], args.length > i ? args[i] : p[1])
      }

      try {
        return beval(ns, body)
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

  function createLambda ($, enclosing, params, body) {
    function $L () {
      var args = Array.prototype.slice.apply(arguments)

      enclosing = Object.assign({}, enclosing)
      for (var i = 0; i < params.length; i++) {
        var p = params[i]
        set(enclosing, p[0], args.length > i ? args[i] : p[1])
      }

      return $.lambda(enclosing, body[1], body.slice(2))
    }

    $L.$enclosing = enclosing
    $L.$fixedArgs = true
    $L.$params = params
    $L.$body = body
    return $L
  }

  $.$lambdaIn = function $lambdaIn ($) {
    return function $lambda (enclosing, params, body) {
      if (!Array.isArray(body) || body.length < 1) {
        return null // no function body
      }

      if (typeof enclosing !== 'object' || enclosing === null) {
        enclosing = {}
      }

      params = formatParameters(params)
      var fixedArgs = params.shift()

      if (body[0] === SymbolLambdaShort) {
        return createLambda($, enclosing, params, body)
      } else {
        return createClosure($, enclosing, params, fixedArgs, body)
      }
    }
  }
}
