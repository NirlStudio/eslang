'use strict'

var $export = require('../export')

function isTypeOf () {
  return function Bool$is_type_of (value) {
    return typeof value === 'boolean'
  }
}

function valueOf () {
  return function Bool$value_of (input) {
    return typeof input !== 'undefined' && input !== null && input !== 0 && input !== false
  }
}

function toCode () {
  return function Bool$to_code () {
    return typeof this === 'boolean' ? this.toString() : 'false'
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
  var type = $export($, 'Bool')
  $export(type, 'is-type-of', isTypeOf())

  var value_of = $export(type, 'value-of', valueOf())
  var and = $export(type, 'and', boolAnd(value_of))
  var or = $export(type, 'or', boolOr(value_of))
  var not = $export(type, 'not', boolNot(value_of))

  var pt = Object.create($.Null.$)
  $export(type, '$', pt)

  $export(pt, 'to-code', toCode())
  $export(pt, 'to-string', toCode())

  $export(pt, 'and', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, 'or', function () {
    return or.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, 'not', function () {
    return !not(this)
  })

  $export(pt, '&&', function () {
    return and.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, '||', function () {
    return or.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(pt, '!', function () {
    return !not(this)
  })

  return type
}
