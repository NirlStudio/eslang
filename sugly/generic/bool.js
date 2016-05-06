'use strict'

var $export = require('../export')

function isType () {
  return function Bool$is_type (value) {
    return typeof value === 'boolean'
  }
}

function valueOf () {
  return function Bool$value_of (input) {
    return typeof input !== 'undefined' && input !== null && input !== 0 && input !== false
  }
}

function toCode (value_of) {
  return function Bool$to_code (value) {
    return typeof value === 'boolean' ? value.toString() : value_of(value).toString()
  }
}

function isValue (value_of) {
  return function Bool$is_value (value) {
    var left = typeof this === 'boolean' ? this : value_of(this)
    return left === (typeof value === 'boolean' ? value : value_of(value))
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

function boolNot (value_of) {
  return function Bool$not (value) {
    return typeof value === 'boolean' ? !value : !value_of(value)
  }
}

module.exports = function ($) {
  var is_type = isType()
  var value_of = valueOf()

  var to_code = toCode(value_of)
  var is_value = isValue(value_of)

  var and = boolAnd(value_of)
  var or = boolOr(value_of)
  var not = boolNot(value_of)

  var $Bool = $export.copy('Bool')
  $Bool.is = is_type
  $Bool['value-of'] = value_of

  $Bool['to-code'] = to_code
  $Bool['to-string'] = to_code

  $Bool.and = and
  $Bool.or = or
  $Bool.not = not

  $Bool.$ = $export.copy('$')
  $Bool.$.is = is_value
  $Bool.$.equals = is_value

  $Bool.$['to-code'] = function () {
    return to_code(this)
  }
  $Bool.$['to-string'] = function () {
    return to_code(this)
  }

  $Bool.$.and = function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  }
  $Bool.$.or = function () {
    return or.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  }
  $Bool.$.not = function () {
    return !not(this)
  }

  return $Bool
}
