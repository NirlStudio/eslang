'use strict'

var $export = require('../export')
var $module = require('./module')

function isTypeOf () {
  return function Date$is_type_of (value) {
    return value instanceof Date
  }
}

function create () {
  return function Date$create (time) {
    return typeof time === 'number' ? new Date(time) : new Date()
  }
}

function equals ($) {
  return function Date$equals (another) {
    if (Object.is(this, another)) {
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

function now () {
  return function Date$now () {
    return new Date()
  }
}

function time () {
  return function Date$time () {
    return typeof Date.now === 'function' ? Date.now() : new Date().getTime()
  }
}

function ofFields () {
  return function Date$of (year, month) {
    var args
    if (typeof month !== 'undefined') {
      args = [null]
      args.push.apply(args, arguments)
      return new (Date.bind.apply(Date, args))
    }

    month = 0
    if (typeof year === 'undefined') {
      year = 1970
    }

    var extra = Array.prototype.slice.call(arguments, 2)
    args = Array.prototype.concat.apply([null, year, month], extra)
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
  var type = $module($, 'Date')
  $export(type, 'is-type-of', isTypeOf())
  $export(type, 'create', create())

  $export(type, 'now', now())
  $export(type, 'time', time())

  $export(type, 'of', ofFields())
  $export(type, 'utc', utc())
  $export(type, 'parse', parse())

  var pt = type.$ = Object.create($.Object.$)
  $export.copy(pt, Date.prototype, {
    /* Chrome, IE, Firefox */
    'getDate': 'get-day',
    'getDay': 'get-week-day',
    'getFullYear': 'get-year',
    'getHours': 'get-hours',
    'getMilliseconds': 'get-milliseconds',
    'getMinutes': 'get-minutes',
    'getMonth': 'get-month',
    'getSeconds': 'get-seconds',

    'getTime': 'time',
    'getTimezoneOffset': 'get-timezone-offset',

    'getUTCDate': 'get-utc-day',
    'getUTCDay': 'get-utc-week-day',
    'getUTCFullYear': 'get-utc-year',
    'getUTCHours': 'get-utc-hours',
    'getUTCMilliseconds': 'get-utc-milliseconds',
    'getUTCMinutes': 'get-utc-minutes',
    'getUTCMonth': 'get-utc-month',
    'getUTCSeconds': 'get-utc-seconds',

    'setDate': 'set-day',
    'setFullYear': 'set-year',
    'setHours': 'set-hours',
    'setMilliseconds': 'set-milliseconds',
    'setMinutes': 'set-minutes',
    'setMonth': 'set-month',
    'setSeconds': 'set-seconds',

    'setTime': 'set-time',

    'setUTCDate': 'set-utc-day',
    'setUTCFullYear': 'set-utc-year',
    'setUTCHours': 'set-utc-hours',
    'setUTCMilliseconds': 'set-utc-milliseconds',
    'setUTCMinutes': 'set-utc-minutes',
    'setUTCMonth': 'set-utc-month',
    'setUTCSeconds': 'set-utc-seconds',

    'toDateString': 'to-date-string',
    'toISOString': 'to-iso-string', // IE9
    'toJSON': 'to-json',

    'toLocaleDateString': 'to-locale-date-string', // [options *]
    'toLocaleString': 'to-locale-string', // [options *]
    'toLocaleTimeString': 'to-locale-time-string', // [options *]

    'toString': 'to-string',
    'toTimeString': 'to-time-string',
    'toUTCString': 'to-utc-string'

  })

  $export(pt, 'equals', equals())
  $export(pt, 'to-code', toCode($))

  return type
}
