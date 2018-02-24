'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.string
  var link = $void.link
  var Symbol$ = $void.Symbol
  var thisCall = $void.thisCall

  // the empty value
  link(Type, 'empty', '')

  // generate a string from inputs.
  link(Type, 'of', function (value) {
    // return the empty value without an argument.
    if (typeof value === 'undefined') {
      return ''
    }
    // concat the trimed values of strings and to-string results of non-strings.
    var result = []
    for (var i = 0; i < arguments.length; i++) {
      var str = arguments[i]
      if (typeof str !== 'string') {
        str = thisCall(str, 'to-string')
        if (typeof str !== 'string') {
          str = ''
        }
      }
      if (str) {
        result.push(str)
      }
    }
    return result.join('')
  })

  // generate a string from a series of unicode values
  link(Type, 'of-chars', function () {
    return String.fromCharCode.apply(String, arguments)
  })

  var proto = Type.proto
  // return the length of this string.
  link(proto, 'length', function () {
    return this.length
  })

  // Searching
  // retrieve the first char.
  link(proto, 'first', function (count) {
    return typeof count === 'undefined'
      ? this.length > 0 ? this.charAt(0) : null
      : this.substr(0, count >> 0)
  })
  // try to find the index of the first occurence of value.
  link(proto, 'first-of', function (value, from) {
    from >>= 0
    return this.indexOf(value, from < 0 ? from + this.length : from)
  })
  // retrieve the last char.
  link(proto, 'last', function (count) {
    return typeof count === 'undefined'
      ? this.length > 0 ? this.charAt(this.length - 1) : null
      : this.substr(this.length - (count >>= 0), count)
  })
  // retrieve the last char or the index of the last occurence of value.
  link(proto, 'last-of', function (value, from) {
    return this.lastIndexOf(value, typeof from !== 'number' ? this.length : from)
  })

  link(proto, 'starts-with', String.prototype.startsWith)
  link(proto, 'ends-with', String.prototype.endsWith)

  // Converting
  // generate sub-string from this string.
  link(proto, 'copy', function (begin, count) {
    begin >>= 0
    count = typeof count === 'undefined' ? this.length : count >> 0
    if (count < 0) {
      begin += count
      count = -count
    }
    if (begin < 0) {
      begin += this.length
      if (begin < 0) {
        begin = 0
      }
    }
    return this.substr(begin, count)
  })
  link(proto, 'in', function (begin, end) {
    begin >>= 0
    if (begin < 0) {
      begin += this.length
      if (begin < 0) {
        begin = 0
      }
    }
    if (typeof end !== 'number') {
      end = this.length
    } else if (end < 0) {
      end += this.length
      if (end < 0) {
        end = 0
      }
    }
    return this.substr(begin, end - begin)
  })

  link(proto, 'trim', String.prototype.trim)
  link(proto, 'trim-left', String.prototype.trimLeft)
  link(proto, 'trim-right', String.prototype.trimRight)

  link(proto, 'replace', function (value, newValue) {
    return typeof value !== 'string' || !value ? this
      : this.replace(
        new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        typeof newValue === 'string' ? newValue : ''
      )
  })
  link(proto, 'to-upper', function (localed) {
    return localed === true ? this.toUpperCase() : this.toLocaleUpperCase()
  })
  link(proto, 'to-lower', function (localed) {
    return localed === true ? this.toLowerCase() : this.toLocaleLowerCase()
  })

  // combination and splitting of strings
  link(proto, ['concat', '+'], function () {
    var result = this ? [this] : []
    for (var i = 0; i < arguments.length; i++) {
      var str = arguments[i]
      if (typeof str !== 'string') {
        str = $void.thisCall(str, 'to-string')
        if (typeof str !== 'string') {
          str = ''
        }
      }
      if (str) {
        result.push(str)
      }
    }
    return result.join('')
  })
  // the reversed operation of '-':
  // if the argument value is a string, to removes a substring if it's the suffix.
  // if the argument value is a number, to removes a suffix with the length of this number.
  // other argument values will be converted to a string and to be removed as suffix.
  link(proto, '-', function () {
    if (this.length < 1 || arguments.length < 1) {
      return this
    }
    var result = this
    for (var i = arguments.length - 1; i >= 0; i--) {
      var value = arguments[i]
      if (typeof value === 'string') {
        if (result.endsWith(value)) {
          result = result.substring(0, result.length - value.length)
        }
      } else if (typeof value === 'number') {
        result = result.substring(0, result.length - value)
      } else {
        value = thisCall(value, 'to-string')
        if (typeof value !== 'string') {
          value = ''
        }
        if (value && result.endsWith(value)) {
          result = result.substring(0, result.length - value.length)
        }
      }
    }
    return result
  })
  link(proto, 'split', function (value) {
    return typeof value !== 'string' || value.length < 1 ? [this] : this.split(value)
  })

  // get a character's unicode value by its offset in this string.
  link(proto, 'char-at', function (offset) {
    offset >>= 0
    var code = this.charCodeAt(offset < 0 ? offset + this.length : offset)
    return isNaN(code) ? null : code
  })

  // Equivalence inherits from null.

  // Ordering: override general comparison logic.
  link(proto, 'compare', function (another, localed) {
    return typeof another !== 'string' ? null
      : localed === true ? this.localeCompare(another)
        : this === another ? 0 : this > another ? 1 : -1
  })

  // comparing operators
  link(proto, '>', function (another) {
    return typeof another === 'string' ? this > another : null
  })
  link(proto, '>=', function (another) {
    return typeof another === 'string' ? this >= another : null
  })
  link(proto, '<', function (another) {
    return typeof another === 'string' ? this < another : null
  })
  link(proto, '<=', function (another) {
    return typeof another === 'string' ? this <= another : null
  })

  // the emptiness of string is determined by its length.
  link(proto, 'is-empty', function () {
    return this === ''
  }, 'not-empty', function () {
    return this !== ''
  })

  // Representation
  link(proto, 'to-string', function () {
    return JSON.stringify(this)
  })

  // Indexer
  link(proto, ':', function (index, value) {
    return typeof index === 'string' ? proto[index]
      : index instanceof Symbol$ ? [proto.key]
        : typeof index !== 'number' ? null
          : this.substr(index, typeof value === 'number' ? value : 1) // chars in a range.
  })

  // inject type
  String.prototype.type = Type // eslint-disable-line no-extend-native
}
