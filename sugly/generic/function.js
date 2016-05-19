'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Function

  var proto = type.proto

  // dynamically invoke a function.
  $export.copy(proto, Function.prototype, {
    'apply': 'apply',
    'call': 'call'
  })

  // A function can have one or more sub-functions
  $export(proto, 'is-fixed-args', function function$is_fixed_args () {
    return typeof this.$fixedArgs === 'boolean' ? this.$fixedArgs : false
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

  // indexer: override to implement setter.
  $export(proto, ':', function function$indexer (name) {
    if (typeof name !== 'string') {
      return null
    }
    if (typeof this[name] !== 'undefined') {
      return this[name]
    }
    return typeof proto[name] !== 'undefined' ? proto[name] : null
  })

  // override to boost - an object is always true
  $export(proto, '?', function function$bool_test (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(Function, 'type', type)
  $void.injectTo(Function, ':', proto[':'])
}
