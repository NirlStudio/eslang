'use strict'

function onDate () {
  return function Date$on (year, month, day, hour, minute, second, millisecond) {
    year = Number.isInteger(year) ? year : 1970
    month = Number.isInteger(month) ? month : 0
    day = Number.isInteger(day) ? day : 0
    hour = Number.isInteger(hour) ? hour : 0
    minute = Number.isInteger(minute) ? minute : 0
    second = Number.isInteger(second) ? second : 0
    millisecond = Number.isInteger(millisecond) ? millisecond : 0
    return new Date(year, month, day, hour, minute, second, millisecond)
  }
}

function equals () {
  return function date$equals (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time === another.getTime()
  }
}

function notEquals () {
  return function date$notEquals (another) {
    if (!(another instanceof Date)) {
      return true
    }
    var time = this.getTime()
    return typeof time !== 'number' || time !== another.getTime()
  }
}

function dateIndexer (proto) {
  return function date$indexer (index, value) {
    // forward to default object indexer
    if (typeof index === 'string') {
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
  var readonly = $void.readonly
  var copyProto = $void.copyProto

  // create a date value from a timestamp - milliseconds basing on 1970-1-1 0:0:0.
  readonly(type, 'value-of', function Date$valueOf (time) {
    if (typeof time === 'undefined') {
      return new Date()
    }
    return typeof time === 'number' && !isNaN(time) ? new Date(time) : new Date(0)
  })

  // get current time as a date object.
  readonly(type, 'now', function Date$now () {
    return new Date()
  })
  // get current time as its timestamp value.
  readonly(type, 'time', function Date$time () {
    return (new Date()).getTime()
  })

  // compose a date object with values of its fields
  readonly(type, 'on', onDate())

  // compose a date object with utc values of its fields
  readonly(type, 'utc', function Date$utc () {
    var time = Date.UTC.apply(Date.UTC, arguments)
    return new Date(typeof time === 'number' && !isNaN(time) ? time : 0)
  })

  // parse a date/time string representation to a date object.
  readonly(type, 'parse', function Date$parse (str) {
    if (typeof str !== 'string') {
      return new Date(0)
    }
    var date = new Date(str)
    return isNaN(date.getTime()) ? new Date(0) : date
  })

  // date/time value manipulation.
  var proto = type.proto

  // TODO - to be revised & remove some unnecessary functions.
  copyProto(type, Date, function (date) {
    return date instanceof Date
  }, {
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

  // override copy function
  readonly(proto, 'copy', function date$clone () {
    return new Date(this.getTime())
  })

  // support & override general operators
  readonly(proto, '+', function date$oprCombine (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    return new Date(time)
  })
  readonly(proto, '+=', function date$oprMerge (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() + milliseconds
    this.setTime(time)
    return this
  })
  readonly(proto, '-', function date$oprSubstract (dateOrTime) {
    if (typeof dateOrTime === 'number') {
      var time = this.getTime() - dateOrTime
      return new Date(time)
    } else if (dateOrTime instanceof Date) {
      return this.getTime() - dateOrTime.getTime()
    }
    return this
  })
  readonly(proto, '-=', function date$oprDeduct (milliseconds) {
    if (typeof milliseconds !== 'number') {
      return this
    }
    var time = this.getTime() - milliseconds
    this.setTime(time)
    return this
  })

  // support ordering logic - comparable
  readonly(proto, 'compare', function date$compare (another) {
    var diff = this.getTime() - another.getTime()
    return diff === 0 ? 0 : diff / Math.abs(diff)
  })

  // support ordering operators
  readonly(proto, '>', function date$oprGT (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time > another.getTime()
  })
  readonly(proto, '>=', function date$oprGE (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time >= another.getTime()
  })
  readonly(proto, '<', function date$oprLT (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time < another.getTime()
  })
  readonly(proto, '<=', function date$oprLE (another) {
    if (!(another instanceof Date)) {
      return false
    }
    var time = this.getTime()
    return typeof time === 'number' && time <= another.getTime()
  })

  // override equivalence logic
  readonly(proto, 'equals', equals())
  readonly(proto, 'not-equals', notEquals())

  // emptiness is defined to the 0 value of timestamp.
  readonly(proto, 'is-empty', function date$isEmpty () {
    return this.getTime() === 0
  })
  readonly(proto, 'not-empty', function date$notEmpty () {
    return this.getTime() !== 0
  })

  // persistency
  readonly(proto, 'to-code', function date$toCode () {
    if (this instanceof Date) {
      var time = this.getTime()
      if (typeof time === 'number') {
        return '(date ' + time + ')'
      }
    }
    return '(date 0)'
  })

  // indexer: overridding, interpret number value as field offset.
  readonly(proto, ':', dateIndexer(proto))

  // override equivalence operators
  readonly(proto, '==', equals())
  readonly(proto, '!=', notEquals())

  // export to system's prototype
  $void.injectTo(Date, 'type', type)
  $void.injectTo(Date, ':', proto[':'])
}
