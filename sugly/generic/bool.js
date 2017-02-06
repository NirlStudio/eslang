'use strict'

function boolAnd (valueOf) {
  return function Bool$and () {
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'boolean') {
        arg = valueOf(arg)
      }
      if (!arg) {
        return false
      }
    }
    return true
  }
}

function boolOr (valueOf) {
  return function Bool$or () {
    var length = arguments.length
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg !== 'boolean') {
        arg = valueOf(arg)
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
  var readonly = $void.readonly

  // evaluation & conversion logic
  var valueOf = readonly(type, 'value-of', function Bool$valueOf (input) {
    return typeof input !== 'undefined' && input !== null && input !== 0 && input !== false
  })

  // static boolean logic operations
  var and = readonly(type, 'and', boolAnd(valueOf))
  var or = readonly(type, 'or', boolOr(valueOf))
  readonly(type, 'not', function Bool$not (value) {
    return typeof value === 'boolean' ? !value : !valueOf(value)
  })

  // the virtual class of boolean type
  var proto = type.proto

  // function form logical operations
  readonly(proto, 'and', function bool$and (value) {
    return this && (arguments.length > 1 ? and.apply(null, arguments)
      : (typeof value === 'undefined' ? true : valueOf(value)))
  })
  readonly(proto, 'or', function bool$or (value) {
    return this || (arguments.length > 1 ? or.apply(null, arguments)
      : (typeof value === 'undefined' ? false : valueOf(value)))
  })
  readonly(proto, 'not', function bool$not () {
    return !this
  })

  // operator form logical operations
  readonly(proto, '&&', function bool$oprAND (value) {
    return this && (arguments.length > 1 ? and.apply(null, arguments)
      : (typeof value === 'undefined' ? true : valueOf(value)))
  })
  readonly(proto, '||', function bool$oprOR (value) {
    return this || (arguments.length > 1 ? or.apply(null, arguments)
      : (typeof value === 'undefined' ? false : valueOf(value)))
  })
  readonly(proto, '!', function bool$oprNOT () {
    return !this
  })

  // persistency & description
  readonly(proto, 'to-code', function bool$toCode () {
    return this === true ? 'true' : 'false'
  })
  readonly(proto, 'to-string', function bool$toString () {
    return this === true ? 'true' : 'false'
  })

  // emptiness - false is the empty value
  readonly(proto, 'is-empty', function bool$isEmpty () {
    return !this
  })
  readonly(proto, 'not-empty', function bool$notEmpty () {
    return this
  })

  // support native boolean values
  readonly(proto, ':', function entity$indexer (name) {
    return typeof name !== 'string' ? null
      : (typeof proto[name] !== 'undefined' ? proto[name] : null)
  })

  // export to system's prototype
  $void.injectTo(Boolean, 'type', type)
  $void.injectTo(Boolean, ':', proto[':'])
}
