'use strict'

function getTimezoneName () {
  var format, options
  return (
    (format = Intl && Intl.DateTimeFormat && Intl.DateTimeFormat()) &&
    (options = format && format.resolveOptions && format.resolveOptions()) &&
    options.timeZone
  ) || (
    process && process.env.TZ
  ) || UtcTimezoneOffset()
}

function UtcTimezoneOffset () {
  var offset = (new Date()).getTimezoneOffset() / 60
  return offset >= 0 ? 'UTC+' + offset.toString() : 'UTC' + offset.toString()
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.date
  var $Object = $.object
  var link = $void.link
  var Symbol$ = $void.Symbol
  var numberCompare = $.number.proto.compare
  var numberToString = $.number.proto['to-string']

  // the empty value
  var empty = link(Type, 'empty', new Date(0))

  // the invalid value.
  var invalid = link(Type, 'invalid', new Date(NaN))

  // parse a date/time string representation to a date object.
  link(Type, 'parse', function (str) {
    return typeof str !== 'string' ? invalid : new Date(str)
  })

  // get current time or the time as a string, a timestamp or data fields.
  link(Type, 'of', function (a, b, c, d, e, f, g) {
    switch (arguments.length) {
      case 0:
        return empty
      case 1: // string or timestamp
        return a instanceof Date ? a : new Date(a)
      case 2:
        return new Date(a, b - 1)
      case 3:
        return new Date(a, b - 1, c)
      case 4:
        return new Date(a, b - 1, c, d)
      case 5:
        return new Date(a, b - 1, c, d, e)
      case 6:
        return new Date(a, b - 1, c, d, e, f)
      default: // field values
        return new Date(a, b - 1, c, d, e, f, g)
    }
  })

  // compose a date object with utc values of its fields
  link(Type, 'of-utc', function (a, b, c, d, e, f, g) {
    switch (arguments.length) {
      case 0:
        return empty
      case 1: // string or timestamp
        return new Date(Date.UTC(a, 0))
      case 2:
        return new Date(Date.UTC(a, b - 1))
      case 3:
        return new Date(Date.UTC(a, b - 1, c))
      case 4:
        return new Date(Date.UTC(a, b - 1, c, d))
      case 5:
        return new Date(Date.UTC(a, b - 1, c, d, e))
      case 6:
        return new Date(Date.UTC(a, b - 1, c, d, e, f))
      default: // field values
        return new Date(Date.UTC(a, b - 1, c, d, e, f, g))
    }
  })

  // get current time as a date object.
  link(Type, 'now', function () {
    return new Date()
  })

  // get current time as its timestamp value.
  link(Type, 'timestamp', Date.now ? function () {
    return Date.now()
  } : function () {
    return (new Date()).getTime()
  })

  link(Type, 'timezone', function () {
    return $Object.of({
      name: getTimezoneName(),
      offset: (new Date()).getTimezoneOffset()
    })
  })

  var proto = Type.proto

  // test if this is a valid date.
  link(proto, 'is-valid', function () {
    return !isNaN(this.getTime())
  })
  link(proto, 'is-invalid', function () {
    return isNaN(this.getTime())
  })

  // retrieve the date fields: year, month, day
  link(proto, 'date-fields', function (utc) {
    return isNaN(this.getTime()) ? null : utc
      ? [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate()]
      : [this.getFullYear(), this.getMonth() + 1, this.getDate()]
  })
  // retrieve the time fields: hours, minutes, seconds, milliseconds
  link(proto, 'time-fields', function (utc) {
    return isNaN(this.getTime()) ? null : utc
      ? [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]
      : [this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]
  })
  // retrieve all fields: year, month, day, hours, minutes, seconds, milliseconds
  link(proto, 'all-fields', function (utc) {
    return isNaN(this.getTime()) ? null : utc
      ? [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(),
        this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]
      : [this.getFullYear(), this.getMonth() + 1, this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]
  })
  // get the week day value, which starts from 0 for Sunday.
  link(proto, 'week-day', function (utc) {
    return isNaN(this.getTime()) ? null
      : utc ? this.getUTCDay() : this.getDay()
  })

  link(proto, 'timestamp', function (utc) {
    return this.getTime()
  })

  // support & override general operators
  link(proto, '+', function (milliseconds) {
    return typeof milliseconds === 'number'
      ? new Date(this.getTime() + milliseconds)
      : this
  })
  link(proto, '-', function (dateOrTime) {
    return typeof dateOrTime === 'number'
      ? new Date(this.getTime() - dateOrTime)
      : dateOrTime instanceof Date
        ? this.getTime() - dateOrTime.getTime()
        : this
  })

  // Ordering: date comparison
  var compare = link(proto, 'compare', function (another) {
    return another instanceof Date
      ? numberCompare.call(this.getTime(), another.getTime())
      : null
  })

  // override Identity and Equivalence logic to test by timestamp value
  link(proto, ['is', '===', 'equals', '=='], function (another) {
    return this === another || compare.call(this, another) === 0
  })
  link(proto, ['is-not', '!==', 'not-equals', '!='], function (another) {
    return this !== another && compare.call(this, another) !== 0
  })

  // ordering operators for instance values
  link(proto, '>', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order > 0 : null
  })
  link(proto, '>=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order >= 0 : null
  })
  link(proto, '<', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order < 0 : null
  })
  link(proto, '<=', function (another) {
    var order = compare.call(this, another)
    return order !== null ? order <= 0 : null
  })

  // emptiness is defined to the 0 value of timestamp.
  link(proto, 'is-empty', function () {
    var ts = this.getTime()
    return ts === 0 || isNaN(ts)
  })
  link(proto, 'not-empty', function () {
    var ts = this.getTime()
    return ts !== 0 && !isNaN(ts)
  })

  // Representation for instance & description for proto itself.
  link(proto, 'to-string', function (format) {
    if (typeof format === 'undefined') {
      // encoding as source code by default.
      var ts = this.getTime()
      return isNaN(ts) ? '(date invalid)'
        : ts === 0 ? '(date empty)'
          : '(date of ' + numberToString.call(this.getTime()) + ')'
    }
    switch (format) {
      case 'utc':
        return this.toUTCString()
      case 'date':
        return this.toLocaleDateString()
      case 'time':
        return this.toLocaleTimeString()
      default:
        return this.toLocaleString()
    }
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? proto[index]
      : index instanceof Symbol$ ? proto[index.key] : null
  })

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  Date.prototype.type = Type // eslint-disable-line no-extend-native
}
