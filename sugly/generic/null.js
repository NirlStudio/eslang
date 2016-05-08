'use strict'

var $export = require('../export')
var measure = require('./measure')

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

function isEmpty () {
  return function null$is_empty () {
    return typeof this === 'undefined' || this === null ? true : !measure(this)
  }
}

module.exports = function ($) {
  var type = $export($, 'Null')
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
  var pt = $export(type, '$')
  $export(pt, 'is', nullIsSame())
  $export(pt, 'equals', nullIsSame())

  $export(pt, 'to-code', nullToCode())
  $export(pt, 'to-string', nullToCode())

  // a customized emptiness logic should override both is-empty & not-empty.
  var is_empty = $export(pt, 'is-empty', isEmpty())
  $export(pt, 'not-empty', function () {
    return !is_empty.call(this)
  })

  return type
}
