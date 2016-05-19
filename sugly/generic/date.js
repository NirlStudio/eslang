'use strict'

var $export = require('../export')

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

function equals () {
  return function date$equals (another) {
    if (!another instanceof Date) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time === another.getTime()
  }
}

function notEquals () {
  return function date$not_equals (another) {
    if (!another instanceof Date) {
      return true
    }
    var time = this.getTime()
    return typeof time !== 'number' || time !== another.getTime()
  }
}

function dateIndexer (proto) {
  return function date$indexer (index, value) {
    // forward to default object indexer
    if (index === 'string') {
      // read only
      return typeof proto[index] === 'undefined' ? null : proto[index]
    } else if (typeof index !== 'number') {
      return null
    }
    // try to retrieve value by field offset.
    if (arguments.length < 1) {
      return null
    }
    if (arguments.length === 1) {
      switch (index) {
        case 0:
          return this.getFullYear()
        case 1:
          return this.getMonth()
        case 2:
          return this.getDate()
        case 3:
          return this.getHours()
        case 4:
          return this.getMinutes()
        case 5:
          return this.getSeconds()
        case 6:
          return this.getMilliseconds()
        default:
          return null
      }
    }
    // try to set value by field offset
    if (typeof value !== 'number') {
      return this
    }
    switch (index) {
      case 0:
        this.setFullYear(value)
        break
      case 1:
        this.setMonth(value)
        break
      case 2:
        this.setDate(value)
        break
      case 3:
        this.setHours(value)
        break
      case 4:
        this.setMinutes(value)
        break
      case 5:
        this.setSeconds(value)
        break
      case 6:
        this.setMilliseconds(value)
        break
    }
    return this
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Date

  // prevent inheritance since it's really a native type.
  type.finalized = true

  // create a date object from a timestamp value.
  $export(type, 'create', function Date$create (time) {
    return typeof time === 'number' ? new Date(time) : new Date(0)
  })

  // get current time as a date object.
  $export(type, 'now', function Date$now () {
    return new Date()
  })
  // get current time as its timestamp value.
  $export(type, 'time', function Date$time () {
    return typeof Date.now === 'function' ? Date.now() : new Date().getTime()
  })

  // compose a date object with values of its fields
  $export(type, 'of', ofFields())
  // compose a date object with utc values of its fields
  $export(type, 'utc', function Date$utc () {
    return new Date(Date.UTC.apply(Date.UTC, arguments))
  })

  // parse a date/time string representation to a date object.
  $export(type, 'parse', function Date$parse (str) {
    return new Date(typeof str === 'string' ? str : 0)
  })

  // date/time value manipulation.
  var proto = type.proto

  // TODO - to be revised & remove some unnecessary functions.
  $export.copy(proto, Date.prototype, {
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

  // override combine, merge and clone functions
  $export(proto, 'combine', function date$combine (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    return new Date(time)
  })
  $export(proto, 'merge', function date$merge (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    this.setTime(time)
    return this
  })
  $export(proto, 'clone', function date$clone () {
    return new Date(this.getTime())
  })

  // support general operators
  $export(proto, '+', function date$opr_combine (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    return new Date(time)
  })
  $export(proto, '+=', function date$opr_merge (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    this.setTime(time)
    return this
  })
  $export(proto, '-', function date$opr_substract (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() - milliseconds
    return new Date(time)
  })
  $export(proto, '-=', function date$opr_deduct (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() - milliseconds
    this.setTime(time)
    return this
  })

  // support ordering logic - comparable
  $export(proto, 'compare', function date$compare (another) {
    var diff = this.getTime() - another.getTime()
    return diff === 0 ? 0 : diff / Math.abs(diff)
  })

  // support ordering operators
  $export(proto, '>', function date$opr_gt (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time > another.getTime()
  })
  $export(proto, '>=', function date$opr_ge (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time >= another.getTime()
  })
  $export(proto, '<', function date$opr_lt (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time < another.getTime()
  })
  $export(proto, '<=', function date$opr_le (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time <= another.getTime()
  })

  // override equivalence logic
  $export(proto, 'equals', equals())
  $export(proto, 'not-equals', notEquals())

  // persistency
  $export(proto, 'to-code', function date$to_code () {
    return $.encode.date(this)
  })

  // emptiness is defined to the 0 value of timestamp.
  $export(proto, 'is-empty', function date$is_empty () {
    return this.getTime() === 0
  })
  $export(proto, 'not-empty', function date$not_empty () {
    return this.getTime() !== 0
  })

  // indexer: overridding, interpret number value as field offset.
  $export(proto, ':', dateIndexer(proto))

  // override equivalence operators
  $export(proto, '==', equals())
  $export(proto, '!=', notEquals())

  // export to system's prototype
  $void.injectTo(Date, 'type', type)
  $void.injectTo(Date, ':', proto[':'])
}
