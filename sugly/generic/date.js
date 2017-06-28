'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.date
  var $Number = $.number
  var link = $void.link
  var copyProto = $void.copyProto
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer
  var numberCompare = $Number.compare

  // empty value
  link(Type, 'empty', new Date(0))

  // get current time or the time as a string, a timestamp or data fields.
  link(Type, 'of', function (a, b, c, d, e, f, g) {
    switch (arguments.length) {
      case 0: // now
        return new Date()
      case 1: // string or timestamp
        return new Date(a)
      default: // field values
        return new Date(a, b, c, d, e, f, g)
    }
  })

  // get current time as a date object.
  link(Type, 'now', function () {
    return new Date()
  })

  // get current time as its timestamp value.
  link(Type, 'time', function () {
    return (new Date()).getTime()
  })

  // compose a date object with utc values of its fields
  link(Type, 'utc', function () {
    return Date.UTC.apply(Date.UTC, arguments)
  })

  // parse a date/time string representation to a date object.
  link(Type, 'parse', function (str) {
    return typeof str !== 'string' ? new Date(NaN) : new Date(str)
  })

  typeIndexer(Type)

  var proto = Type.proto

  // test if this is a valid date.
  link(proto, 'is-valid', function () {
    return this instanceof Date ? !isNaN(this.getTime()) : null
  }, 'is-not-valid', function () {
    return this instanceof Date ? isNaN(this.getTime()) : null
  })

  // TODO - refactoring to less functions.
  copyProto(Type, Date, function (date) {
    return date instanceof Date
  }, {
    /* Chrome, IE, Firefox */
    'getDate': 'day',
    'getDay': 'week-day',
    'getFullYear': 'year',
    'getHours': 'hours',
    'getMilliseconds': 'milliseconds',
    'getMinutes': 'minutes',
    'getMonth': 'month',
    'getSeconds': 'seconds',

    'getTime': 'time',
    'getTimezoneOffset': 'timezone-offset',

    'getUTCDate': 'utc-day',
    'getUTCDay': 'utc-week-day',
    'getUTCFullYear': 'utc-year',
    'getUTCHours': 'utc-hours',
    'getUTCMilliseconds': 'utc-milliseconds',
    'getUTCMinutes': 'utc-minutes',
    'getUTCMonth': 'utc-month',
    'getUTCSeconds': 'utc-seconds',

    'toDateString': 'to-date-string',
    'toTimeString': 'to-time-string',
    'toISOString': 'to-iso-string', // IE9
    'toUTCString': 'to-utc-string'
  })

  // support & override general operators
  link(proto, '+', function (milliseconds) {
    return this instanceof Date
      ? typeof milliseconds !== 'number' ? this
        : new Date(this.getTime() + milliseconds)
      : null
  })
  link(proto, '-', function (dateOrTime) {
    return this instanceof Date
      ? typeof dateOrTime === 'number'
        ? new Date(this.getTime() - dateOrTime)
        : dateOrTime instanceof Date
          ? this.getTime() - dateOrTime.getTime() : this
      : null
  })

  // Ordering: date comparison
  var compare = link(proto, 'compare', function (another) {
    return this instanceof Date && another instanceof Date
      ? numberCompare.call(this.getTime(), another.getTime())
      : null // invalid type.
  })

  // override Identity and Equivalence logic to test by timestamp value
  link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || compare.call(this, another) === 0
  }, ['is-not', 'not-equals', '!='], function (another) {
    return this !== another && compare.call(this, another) !== 0
  })

  // ordering operators for instance values
  link(proto, '>', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order > 0 : null
  })
  link(proto, '>=', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order >= 0 : null
  })
  link(proto, '<', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order < 0 : null
  })
  link(proto, '<=', function (another) {
    var order = compare.call(this, another)
    return typeof order === 'number' ? order <= 0 : null
  })

  // Type Verification
  typeVerifier(Type)

  // emptiness is defined to the 0 value of timestamp.
  link(proto, 'is-empty', function () {
    if (this instanceof Date) {
      var ts = this.getTime()
      return ts === 0 || isNaN(ts)
    }
    return null
  }, 'not-empty')

  // Encoding
  link(proto, 'to-code', function () {
    return this instanceof Date ? this : null
  })

  // Representation for instance & description for proto itself.
  link(proto, 'to-string', function (format) {
    if (this instanceof Date) {
      if (format) {
        // TODO - for display
        return this.toString()
      }
      // as source code
      // TODO - revise to keep TZ & locale ? or use timestamp?
      return '(date of ' + this.getTime() + ')'
    }
    return null
  })

  // Indexer for proto and instances
  nativeIndexer(Type, Date, Date)
}
