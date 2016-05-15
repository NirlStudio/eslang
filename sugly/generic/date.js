'use strict'

var $export = require('../export')

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

function dateIndexer ($) {
  var resolve = $.Object.class[':']
  return function date$indexer (index, value) {
    // forward to default object indexer
    if (typeof index !== 'number') {
      if (arguments.length === 1) {
        return resolve.call(this, index)
      } else if (arguments.length > 1) {
        return resolve.call(this, index, value)
      }
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

module.exports = function ($) {
  var type = $.Date
  // Date type is a native type, but logically inherited from managed object.
  $export(type, 'is-type-of', isTypeOf())

  // create a date object from a timestamp value.
  $export(type, 'create', create())

  // get current time as a data object.
  $export(type, 'now', now())
  // get current time as its timestamp value.
  $export(type, 'time', time())

  // compose a date object with values of its fields
  $export(type, 'of', ofFields())
  // compose a date object with utc values of its fields
  $export(type, 'utc', utc())

  // parse a date/time string representation to a date object.
  $export(type, 'parse', parse())

  var class_ = type.class
  $export(class_, 'equals', equals())

  // persistency
  $export(class_, 'to-code', toCode($))

  // emptiness is defined to the 0 value of timestamp.
  $export(class_, 'is-empty', function () {
    return this.getTime() === 0
  })
  $export(class_, 'not-empty', function () {
    return this.getTime() !== 0
  })

  // indexer: overridding, interpret number value as field offset.
  $export(class_, ':', dateIndexer($))

  // date/time value manipulation.
  // TODO - to be revised & remove some unnecessary functions.
  $export.copy(class_, Date.prototype, {
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

  // support ordering logic - comparable
  $export(class_, 'compare', function (another) {
    var diff = this.getTime() - another.getTime()
    return diff === 0 ? 0 : diff / Math.abs(diff)
  })

  // support general operators
  $export(class_, '+', function (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    return new Date(time)
  })
  $export(class_, '+=', function (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    this.setTime(time)
    return this
  })
  $export(class_, '-', function (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() - milliseconds
    return new Date(time)
  })
  $export(class_, '-=', function (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() - milliseconds
    this.setTime(time)
    return this
  })

  // override equivalence operators
  $export(class_, '==', function (another) {
    if (!another instanceof Date) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time === another.getTime()
  })
  $export(class_, '!=', function (another) {
    if (!another instanceof Date) {
      return true
    }
    var time = this.getTime()
    return typeof time !== 'number' || time !== another.getTime()
  })

  // support ordering operators
  $export(class_, '>', function (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time > another.getTime()
  })
  $export(class_, '>=', function (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time >= another.getTime()
  })
  $export(class_, '<', function (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time < another.getTime()
  })
  $export(class_, '<=', function (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time <= another.getTime()
  })
}
