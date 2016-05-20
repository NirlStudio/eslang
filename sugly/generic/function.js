'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Function

  // dynamically call a function. execute & execute-with will be implmented with $execute.
  $export(type, 'call', function Function$call (subject, func) {
    return typeof func !== 'function' ? null
      : func.apply(subject, Array.prototype.slice.call(arguments, 2))
  })
  $export(type, 'apply', function Function$apply (subject, func, args) {
    if (typeof args === 'undefined') {
      args = func; func = subject; subject = null
    }
    return typeof func !== 'function' ? null
      : func.apply(subject, Array.isArray(args) ? args : [])
  })

  var proto = type.proto

  // A function can have one or more sub-functions
  $export(proto, 'is-fixed-args', function function$is_fixed_args () {
    return this.$fixedArgs === true
  })
  $export(proto, 'parameters', function function$parameters () {
    return this.$params || []
  })
  $export(proto, 'body', function function$body () {
    return this.$body || null
  })
  $export(proto, 'enclosing', function function$enclosing () {
    return this.$enclosing || null
  })

  // persistency & describing
  $export(proto, 'to-code', function function$to_code () {
    return $.encode.function(this)
  })
  $export(proto, 'to-string', function function$to_string () {
    return '[Function ' + (this.identityName || this.Name || '(anonymous)') + ']'
  })

  // indexer: override to expose this function's meta information.
  $export(proto, ':', function function$indexer (name) {
    return typeof name !== 'string' ? null
      : typeof proto[name] === 'undefined' ? null : proto[name]
  })

  // override to boost - an object is always true
  $export(proto, '?', function function$bool_test (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(Function, 'type', type)
  $void.injectTo(Function, ':', proto[':'])
}
