'use strict'

var $export = require('../export')
var $module = require('./module')

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
  var type = $module($, 'Function')
  $export(type, 'is-type-of', isTypeOf())
  $export(type, 'create', create())

  var pt = type.$ = Object.create($.Null.$)
  $export.copy(pt, Function.prototype, { // TODO - looper
    'apply': 'apply',
    'call': 'call'
  })
  $export(pt, 'equals', equals())

  $export(pt, 'is-empty', function () {
    return false
  })
  $export(pt, 'not-empty', function () {
    return true
  })

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toString($))
  return type
}
