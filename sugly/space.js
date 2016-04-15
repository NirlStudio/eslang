'use strict'

const SymbolIdentityName = Symbol.for('identityName')

let JS = global || window

function exportTo (container, name, obj) {
  if (typeof obj === 'object' || typeof obj === 'function') {
    if (!obj[SymbolIdentityName]) {
      var owner = container[SymbolIdentityName]
      obj[SymbolIdentityName] = '(' + owner + ' "' + name + '")'
    }
  }

  container[name] = obj
  container[Symbol.for(name)] = obj
  return obj
}

function exportJSFunction (container, name, func) {
  if (!func) {
    func = JS[name]
  }
  exportTo(container, name, function () {
    return func.apply(null, arguments)
  })
}

function exportFunction (container, name, owner, func) {
  exportTo(container, name, function () {
    return func.apply(owner, arguments)
  })
}

function copyJSObject (name, jsObject) {
  var copied = {}
  copied[SymbolIdentityName] = '($"' + name + '")'

  var keys = Object.getOwnPropertyNames(jsObject)
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var prop = jsObject[key]
    if (typeof prop === 'function') {
      exportFunction(copied, key, jsObject, prop)
    } else {
      copied[Symbol.for(key)] = prop
    }
  }
  return copied
}

function exportURIFunctions () {
  var URI = {}
  URI[SymbolIdentityName] = '($"URI")'

  exportJSFunction(URI, 'encode', JS.encodeURI)
  exportJSFunction(URI, 'encodeComponent', JS.encodeURIComponent)
  exportJSFunction(URI, 'decode', JS.decodeURI)
  exportJSFunction(URI, 'decodeComponent', JS.decodeURIComponent)

  return URI
}

function initializeSpace ($) {
  exportTo($, 'Infinity', JS.Infinity)
  exportTo($, 'NaN', JS.NaN)

  exportJSFunction($, 'isFinite')
  exportJSFunction($, 'isNaN')
  exportJSFunction($, 'parseFloat')
  exportJSFunction($, 'parseInt')

  exportTo($, 'object', function $object (prototype) {
    if (typeof prototype !== 'object' || prototype === null) {
      prototype = Object.prototype
    }
    return Object.create(prototype)
  })

  exportTo($, 'bool', function $bool (value) {
    return typeof value !== 'undefined' && value !== false && value !== null && value !== 0
  })

  exportTo($, 'string', function $string () {
    var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
    var str = ''
    for (var i = 0; i < args.length; i++) {
      var value = args[i]
      if (typeof value === 'string') {
        str += value
      } else {
        str += $.encode.value(value)
      }
    }
    return str
  })

  exportTo($, 'symbol', function $symbol (key) {
    return typeof key === 'string' ? Symbol.for(key) : null // no duplicated symbol instances
  })

  exportJSFunction($, 'number', JS.Number)
  exportTo($, 'date', function $date (value) {
    return new Date(value)
  })

  exportTo($, 'array', function $array () {
    return arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
  })

  exportTo($, 'URI', exportURIFunctions())
  exportTo($, 'Math', copyJSObject('Math', JS.Math))
  exportTo($, 'JSON', copyJSObject('JSON', JS.JSON))
}

module.exports = function (/* options */) {
  var $ = Object.create(null)
  $[SymbolIdentityName] = '$'

  // meta information
  var sugly = exportTo($, 'sugly', {})
  exportTo(sugly, 'runtime', 'js')
  exportTo(sugly, 'version', '0.0.1')
  exportTo(sugly, 'isDebugging', true)

  // import objects from JS environment
  initializeSpace($)

  // compile function factory
  exportTo($, 'compiler', require('./compiler'))

  // compile a piece of code to program/clauses: [[]].
  exportTo($, 'compile', function (code, src) {
    return $.compiler()(code, src)
  })

  // encode function factory
  exportTo($, 'encoder', require('./encoder'))

  // default encode function
  exportTo($, 'encode', $.encoder(true))

  // customized console object. depending on $.encode
  exportTo($, 'console', require('./console')($))

  // this is only used by runtime itself or its assembler
  $.$export = function (name, obj) {
    exportTo(this, name, obj)
  }

  // placeholder function of $load.
  // Since $load is expected to return a piece of code, it should always
  // return a piece of code.
  var load = exportTo($, 'load', function $load (source, cb) {
    const code = '(console error "An implementation of $load should be assembled to sugly.")' +
      '(@statusCode: 600 ' +
        'statusDescription: "No $load function").'

    return typeof cb === 'function' ? cb(code) : code
  })
  exportTo(load, 'normalize', function $load$normalize (source) {
    return source
  })

  return $
}