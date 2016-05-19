'use strict'

var $export = require('../export')

module.exports = function ($void) {
  var $ = $void.$
  var ownsProperty = $void.ownsProperty
  var type = $.Function
  var proto = type.proto

  // attach/detach a property or subfunction.
  var attach = $export(proto, 'attach', function function$attach (name, value) {
    if (typeof name !== 'string' || name.startsWith('$')) {
      return null
    }
    return (this[name] = typeof value === 'undefined' ? null : value)
  })
  // query the value of a property or a subfunction
  var query = $export(proto, 'query', function function$query (name) {
    if (typeof name !== 'string' || name.startsWith('$')) {
      return null
    }
    return typeof this[name] !== 'undefined' ? this[name]
      : typeof proto[name] !== 'undefined' ? proto[name] : null
  })
  // remove a property or subfunction
  var detach = $export(proto, 'detach', function function$detach (name) {
    if (typeof name !== 'string' || name.startsWith('$')) {
      return null
    }
    var value
    if (ownsProperty(this, name)) {
      value = this[name]
      delete this[name]
    } else {
      value = null
    }
    return value
  })

  // dynamically invoke a function.
  $export.copy(proto, Function.prototype, {
    'apply': 'apply',
    'call': 'call'
  })

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

  // indexer: override to implement setter.
  $export(proto, ':', function function$indexer (name, value) {
    return typeof value === 'undefined' ? query.call(this, name)
      : value === null ? detach.call(this, name)
        : attach.call(this, name)
  })

  // override to boost - an object is always true
  $export(proto, '?', function function$bool_test (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(Function, 'type', type)
  $void.injectTo(Function, ':', proto[':'])
}
