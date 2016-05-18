'use strict'

var $export = require('../export')

function boolAnd (value_of) {
  return function Bool$and () {
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'boolean') {
        arg = value_of(arg)
      }
      if (!arg) {
        return false
      }
    }
    return true
  }
}

function boolOr (value_of) {
  return function Bool$or () {
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'boolean') {
        arg = value_of(arg)
      }
      if (arg) {
        return true
      }
    }
    return false
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Bool

  // evaluation & conversion logic
  var value_of = $export(type, 'value-of', function Bool$value_of (input) {
    return typeof input !== 'undefined' && input !== null && input !== 0 && input !== false
  })

  // static boolean logic operations
  var and = $export(type, 'and', boolAnd(value_of))
  var or = $export(type, 'or', boolOr(value_of))
  $export(type, 'not', function Bool$not (value) {
    return typeof value === 'boolean' ? !value : !value_of(value)
  })

  // the virtual class of boolean type
  var proto = type.proto

  // function form logical operations
  $export(proto, 'and', function bool$and (value) {
    return this && (arguments.length > 1 ? and.apply(null, arguments)
      : (typeof value === 'undefined' ? true : value_of(value)))
  })
  $export(proto, 'or', function bool$or (value) {
    return this || (arguments.length > 1 ? or.apply(null, arguments)
      : (typeof value === 'undefined' ? false : value_of(value)))
  })
  $export(proto, 'not', function bool$not () {
    return !this
  })

  // operator form logical operations
  $export(proto, '&&', function bool$opr_and (value) {
    return this && (arguments.length > 1 ? and.apply(null, arguments)
      : (typeof value === 'undefined' ? true : value_of(value)))
  })
  $export(proto, '||', function bool$opr_or (value) {
    return this || (arguments.length > 1 ? or.apply(null, arguments)
      : (typeof value === 'undefined' ? false : value_of(value)))
  })
  $export(proto, '!', function bool$opr_not () {
    return !this
  })

  // persistency & description
  $export(proto, 'to-code', function bool$to_code () {
    return this ? 'true' : 'false'
  })
  $export(proto, 'to-string', function bool$to_string () {
    return this ? 'true' : 'false'
  })

  // emptiness - false is the empty value
  $export(proto, 'is-empty', function bool$is_empty () {
    return !this
  })
  $export(proto, 'not-empty', function bool$not_empty () {
    return this
  })

  // support native boolean values
  $export(proto, ':', function entity$indexer (name) {
    return typeof name !== 'string' ? null
      : (typeof proto[name] !== 'undefined' ? proto[name] : null)
  })

  // export to system's prototype
  $void.injectTo(Boolean, 'type', type)
  $void.injectTo(Boolean, ':', proto[':'])
}
