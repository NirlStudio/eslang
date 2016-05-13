'use strict'

var $export = require('../export')

function isTypeOf () {
  return function Function$is_type_of (value) {
    return typeof value === 'function'
  }
}

function create () {
  return function Function$create (params, body) {
    // This function only exists as a placeholder.
    return function () { return null }
  }
}

function equals () {
  return function Function$equals (another) {
    if (typeof this !== 'function' || typeof another !== 'function') {
      return false
    }
    // TODO - to compare parameters?
    return this === another
  }
}

function toCode ($) {
  return function Function$to_code () {
    return $.encode.function(this)
  }
}

function toString () {
  return function Function$to_string () {
    return '[Function ' + (this.identityName || this.Name || '(anonymous)') + ']'
  }
}

module.exports = function ($) {
  var type = $.Function
  $export(type, 'is-type-of', isTypeOf())
  $export(type, 'create', create())

  var class_ = type.class
  $export(class_, 'equals', equals())

  $export(class_, 'is-empty', function () {
    return false
  })
  $export(class_, 'not-empty', function () {
    return true
  })

  $export(class_, 'to-code', toCode($))
  $export(class_, 'to-string', toString($))

  $export.copy(class_, Function.prototype, { // TODO - looper
    'apply': 'apply',
    'call': 'call'
  })

  return type
}
