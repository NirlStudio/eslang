'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Function

  // define static type attributes
  $export(type, 'is-type', function Function$is_type () {
    return true
  })
  $export(type, 'is-type-of', function Function$is_type_of (value) {
    return typeof value === 'function'
  })
  $export(type, 'super', function Function$super () {
    return null
  })
  $export(type, 'get-type', function Function$get_type () {
    return $.Class
  })
  $export(type, 'is-instance', function Function$is_instance () {
    return false
  })
  $export(type, 'is-instance-of', function Function$is_instance_of (type) {
    return false
  })

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

  // define static value attributes
  $export(proto, 'is-type', function function$is_type () {
    return false
  })
  $export(proto, 'is-type-of', function function$is_type_of (value) {
    return false
  })
  $export(proto, 'super', function function$super () {
    return null
  })
  $export(proto, 'get-type', function function$get_type () {
    return type
  })
  $export(proto, 'is-instance', function function$is_instance () {
    return true
  })
  $export(proto, 'is-instance-of', function function$is_instance_of (func) {
    return type === func
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
    typeof proto[name] !== 'undefined' ? proto[name] : null
  })
}
