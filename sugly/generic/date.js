'use strict'

var $export = require('../export')
var dump = $export.dump(Date)

var $inst = {}
Object.assign($inst, dump.methods)

function isType () {
  return function Date$is (value) {
    return value instanceof Date
  }
}

function create () {
  return function Date$create (time) {
    return typeof time === 'number' ? new Date(time) : new Date()
  }
}

function isSame () {
  return function Date$is_same (another) {
    return Object.is(this, another)
  }
}

function equals ($, is_same) {
  return function Date$equals (another) {
    if (is_same.call(this, another)) {
      return true
    }
    if (!(this instanceof Date) || !(another instanceof Date)) {
      return false
    }
    return this.getTime() === another.getTime()
  }
}

function toCode ($) {
  return function Date$to_code () {
    return $.encode.date(this)
  }
}

function toString ($) {
  return function Date$to_string (format) {
    return this instanceof Date ? this.toString() : ''
  }
}

function now () {
  return function Date$now () {
    return Date()
  }
}

function time () {
  return function Date$time () {
    return typeof Date.now === 'function' ? Date.now() : new Date().getTime()
  }
}

function ofFields () {
  return function Date$of (year, month) {
    if (typeof month !== 'undefined') {
      return new (Date.bind.apply(null, arguments))
    }

    month = 0
    if (typeof year === 'undefined') {
      year = 1970
    }

    var extra = Array.prototype.slice.call(arguments, 2)
    var args = Array.prototype.concat.apply([year, month], extra)
    return new (Date.bind.apply(null, args))
  }
}

function utc () {
  return function Date$utc () {
    return new Date(Date.UTC.apply(Date.UTC, arguments))
  }
}

function parse () {
  return function Date$parse (str) {
    return new Date(typeof str === 'string' ? str : 0)
  }
}

module.exports = function ($) {
  var type = $export($, 'Date')
  $export(type, 'is', isType())
  $export(type, 'create', create())

  $export(type, 'now', now())
  $export(type, 'time', time())

  $export(type, 'of', ofFields())
  $export(type, 'utc', utc())
  $export(type, 'parse', parse())

  var pt = $export(type, null, $export.copy('$', $inst))
  $export.wrap(pt, 'time', null, $inst.getTime)

  $export(pt, 'is', isSame())
  $export(pt, 'equals', equals())

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toString($))

  return type
}
