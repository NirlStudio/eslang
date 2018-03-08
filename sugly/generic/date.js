'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.date
  var $Object = $.object
  var link = $void.link
  var Symbol$ = $void.Symbol
  var numberCompare = $.number.proto.compare

  // empty value
  link(Type, 'empty', new Date(0))

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

  link(Type, 'timezone', function () {
    var format = Intl && Intl.DateTimeFormat ? Intl.DateTimeFormat() : null
    var options = format && format.resolveOptions && format.resolveOptions()
    return $Object.of({
      name: (options && options.timeZone) || null,
      offset: (new Date()).getTimezoneOffset()
    })
  })

  var proto = Type.proto

  // test if this is a valid date.
  link(proto, 'is-valid', function () {
    return !isNaN(this.getTime())
  })
  link(proto, 'is-not-valid', function () {
    return isNaN(this.getTime())
  })

  // retrieve the date fields: year, month, day, week-day
  link(proto, 'the-date', function (utc) {
    return isNaN(this.getTime()) ? null
      : utc && utc.toLowerCase && utc.toLowerCase() === 'utc'
        ? [this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCDay()]
        : [this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getDay()]
  })
  // retrieve the time fields: hours, minutes, seconds, milliseconds
  link(proto, 'the-time', function (utc) {
    return isNaN(this.getTime()) ? null
      : utc && utc.toLowerCase && utc.toLowerCase() === 'utc'
        ? [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]
        : [this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]
  })
  // retrieve all fields: year, month, day, week-day, hours, minutes, seconds, milliseconds
  link(proto, 'all-fields', function (utc) {
    return isNaN(this.getTime()) ? null
      : utc && utc.toLowerCase && utc.toLowerCase() === 'utc'
        ? [[this.getUTCFullYear(), this.getUTCMonth() + 1, this.getUTCDate(), this.getUTCDay()],
          [this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds()]]
        : [[this.getFullYear(), this.getMonth() + 1, this.getDate(), this.getDay()],
          [this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()]]
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
  link(proto, ['is', 'equals', '=='], function (another) {
    return this === another || compare.call(this, another) === 0
  })
  link(proto, ['is-not', 'not-equals', '!='], function (another) {
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
    var ts = this.getTime()
    return ts === 0 || isNaN(ts)
  })
  link(proto, 'not-empty', function () {
    var ts = this.getTime()
    return ts !== 0 && !isNaN(ts)
  })

  // Representation for instance & description for proto itself.
  link(proto, 'to-string', function (format, localed) {
    if (typeof format === 'undefined') {
      // encoding as source code by default.
      return '(date of ' + this.getTime() + ')'
    }
    if (typeof format === 'boolean') {
      localed = format
      format = ''
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

  // Indexer
  link(proto, ':', function (index) {
    return typeof index === 'string' ? proto[index]
      : index instanceof Symbol$ ? proto[index.key] : null
  })

  // inject type
  Date.prototype.type = Type // eslint-disable-line no-extend-native
}
