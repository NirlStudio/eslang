'use strict'

var $export = require('../export')
var $module = require('./module')

function isNull () {
  return function Null$is_null (value) {
    return typeof value === 'undefined' || value === null
  }
}

function toCode () {
  return function Null$to_code () {
    return 'null'
  }
}

function nullIsSame () {
  return function null$is_same (another) {
    return Object.is(this, another)
  }
}

function nullToCode () {
  return function null$to_code () {
    // if code indeed goes here, this is not null, but we have to take this as null.
    return '()'
  }
}

module.exports = function ($) {
  var type = $module($, 'Null')
  $export(type, 'is', isNull())
  $export(type, 'equals', isNull())

  $export(type, 'to-code', toCode())
  $export(type, 'to-string', toCode())

  $export(type, 'is-empty', function Null$is_empty () {
    return true
  })
  $export(type, 'not-empty', function Null$not_empty () {
    return false
  })

  // for all other values
  var pt = type.$ = Object.create(null)
  $export(pt, 'is', nullIsSame())
  $export(pt, 'equals', nullIsSame())

  $export(pt, 'to-code', nullToCode())
  $export(pt, 'to-string', nullToCode())

  $export(pt, 'is-empty', function () {
    return true
  })
  $export(pt, 'not-empty', function () {
    return false
  })

  return type
}
