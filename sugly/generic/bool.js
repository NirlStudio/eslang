'use strict'

var $export = require('../export')

function isTypeOf () {
  return function Bool$is_type_of (value) {
    return value === true || value === false
  }
}

function valueOf () {
  return function Bool$value_of (input) {
    return typeof input !== 'undefined' && input !== null && input !== false && input !== 0
  }
}

function toCode () {
  return function Bool$to_code () {
    return this ? 'true' : 'false'
  }
}

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

module.exports = function ($) {
  // Bool is the type *object* of true and false.
  var type = $.Bool
  $export(type, 'is-type-of', isTypeOf())

  // evaluation & conversion logic
  var value_of = $export(type, 'value-of', valueOf())

  // boolean logic operations
  var and = $export(type, 'and', boolAnd(value_of))
  var or = $export(type, 'or', boolOr(value_of))
  $export(type, 'not', function (value) {
    return typeof value === 'boolean' ? !value : !value_of(value)
  })

  // the virtual class of boolean type
  var class_ = type.class

  // persistency & description
  $export(class_, 'to-code', toCode())
  $export(class_, 'to-string', toCode())

  // emptiness
  $export(class_, 'is-empty', function () {
    return !this
  })
  $export(class_, 'not-empty', function () {
    return this
  })

  $export(class_, 'and', function (value) {
    return this && (arguments.length > 1 ? and.apply(null, arguments)
      : (typeof value === 'undefined' ? true : value_of(value)))
  })
  $export(class_, 'or', function (value) {
    return this || (arguments.length > 1 ? or.apply(null, arguments)
      : (typeof value === 'undefined' ? false : value_of(value)))
  })
  $export(class_, 'not', function () {
    return !this
  })

  $export(class_, '&&', function (value) {
    return this && (arguments.length > 1 ? and.apply(null, arguments)
      : (typeof value === 'undefined' ? true : value_of(value)))
  })
  $export(class_, '||', function (value) {
    return this || (arguments.length > 1 ? or.apply(null, arguments)
      : (typeof value === 'undefined' ? false : value_of(value)))
  })
  $export(class_, '!', function () {
    return !this
  })

  return type
}
