'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.date
  var $Number = $.number
  var link = $void.link
  var initializeType = $void.initializeType
  var protoIndexer = $void.protoIndexer
  var numberCompare = $Number.proto.compare

  // empty value
  initializeType(Type, new Date(0))

  // parse a date/time string representation to a date object.
  link(Type, 'parse', function (str) {
    return typeof str !== 'string' ? new Date(NaN) : new Date(str)
  })

  // get current time or the time as a string, a timestamp or data fields.
  link(Type, 'of', function (a, b, c, d, e, f, g) {
    switch (arguments.length) {
      case 0: // now
        return new Date()
      case 1: // string or timestamp
        return new Date(a)
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
  link(Type, 'of-utc', function () {
    var fields = Array.prototype.slice.call(arguments)
    if (typeof fields[1] === 'number') {
      fields[1] -= 1
    }
    return new Date(Date.UTC.apply(Date, fields))
  })

  // get current time as a date object.
  link(Type, 'now', function () {
    return new Date()
  })

  // get current time as its timestamp value.
  link(Type, 'timestamp', function () {
    return (new Date()).getTime()
  })

  var proto = Type.proto

  // test if this is a valid date.
  link(proto, 'is-valid', function () {
    return this instanceof Date ? !isNaN(this.getTime()) : null
  }, 'is-not-valid', function () {
    return this instanceof Date ? isNaN(this.getTime()) : null
  })

  // retrieve the date fields: year, month, day, week-day
  link(proto, 'date', function (utc) {
    return this instanceof Date && !isNaN(this.getTime())
      ? utc === true
        ? [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCDay()]
        : [this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getDay()]
      : null
  })
  // retrieve the time fields: hours, minutes, seconds, milliseconds
  link(proto, 'time', function (utc) {
    return this instanceof Date && !isNaN(this.getTime())
      ? utc === true
        ? [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]
        : [this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]
      : null
  })
  // retrieve all fields: year, month, day, week-day, hours, minutes, seconds, milliseconds
  link(proto, 'date-time', function (utc) {
    return this instanceof Date && !isNaN(this.getTime())
      ? utc === true
        ? [[this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCDay()],
          [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]]
        : [[this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getDay()],
          [this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]]
      : null
  })

  link(proto, 'timestamp', function (utc) {
    return this instanceof Date ? this.getTime() : null
  })

  link(proto, 'tz-offset', function () {
    return this instanceof Date ? this.getTimezoneOffset() : null
  })

  // support & override general operators
  link(proto, '+', function (milliseconds) {
    return this instanceof Date
      ? isNaN(this.getTime()) || typeof milliseconds !== 'number' || milliseconds === 0
        ? this : new Date(this.getTime() + milliseconds)
      : null
  })
  link(proto, '-', function (dateOrTime) {
    return this instanceof Date
      ? typeof dateOrTime === 'number'
        ? isNaN(this.getTime()) || dateOrTime === 0
          ? this : new Date(this.getTime() - dateOrTime)
        : dateOrTime instanceof Date
          ? this.getTime() - dateOrTime.getTime() : this
      : null
  })

  // Ordering: date comparison
  var compare = link(proto, 'compare', function (another) {
    return (this instanceof Date) && (another instanceof Date)
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

  // emptiness is defined to the 0 value of timestamp.
  link(proto, 'is-empty', function () {
    if (this instanceof Date) {
      var ts = this.getTime()
      return ts === 0 || isNaN(ts)
    }
    return null
  }, 'not-empty', function () {
    if (this instanceof Date) {
      var ts = this.getTime()
      return ts !== 0 && !isNaN(ts)
    }
    return null
  })

  // Encoding
  link(proto, 'to-code', function () {
    return this instanceof Date ? this : null
  })

  // Representation for instance & description for proto itself.
  link(proto, 'to-string', function (format, localed) {
    if (!(this instanceof Date)) {
      return this === proto ? '(date proto)' : null
    }
    if (typeof format === 'boolean') {
      localed = format
      format = ''
    } else if (typeof format !== 'string') {
      // encoding as source code for unnown format.
      return '(date of ' + this.getTime() + ')'
    }
    switch (format) {
      case 'utc':
        return this.toUTCString()
      case 'date':
        return localed === true ? this.toLocaleDateString() : this.toDateString()
      case 'time':
        return localed === true ? this.toLocaleTimeString() : this.toTimeString()
      default:
        return localed === true ? this.toLocaleString() : this.toString()
    }
  })

  // Indexer for proto and instances
  protoIndexer(Type)

  // inject type
  Date.prototype.type = Type // eslint-disable-line no-extend-native
}
