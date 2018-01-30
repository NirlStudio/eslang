'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.string
  var link = $void.link
  var thisCall = $void.thisCall
  var initializeType = $void.initializeType
  var protoIndexer = $void.protoIndexer

  // the empty value
  initializeType(Type, '')

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
    return result.length < 1 ? ''
      : result.length === 1 ? result[0] : result.join('')
  })

  // generate a string from a series of unicode values
  link(Type, 'of-chars', function () {
    var str = String.fromCharCode.apply(String, arguments)
    return typeof str === 'undefined' ? '' : str
  })

  var proto = Type.proto
  // Searching
  // TODO: match & search with regex?
  // retrieve the first char or the index of the first occurence of value.
  link(proto, 'first', function (value, from) {
    if (typeof this !== 'string') {
      return null
    }
    switch (arguments.length) {
      case 0:
        return this.length > 0 ? this.charAt(0) : null
      case 1:
        return typeof value !== 'string' ? -1 : this.indexOf(value)
      default:
        return typeof value !== 'string' ? -1
          : this.indexOf(value, typeof from !== 'number' ? 0 : from)
    }
  })
  // retrieve the last char or the index of the last occurence of value.
  link(proto, 'last', function (value, from) {
    if (typeof this !== 'string') {
      return null
    }
    switch (arguments.length) {
      case 0:
        return this.length > 0 ? this.charAt(this.length - 1) : null
      case 1:
        return typeof value !== 'string' ? -1 : this.lastIndexOf(value)
      default:
        return typeof value !== 'string' ? -1
          : this.lastIndexOf(value, typeof from !== 'number' ? this.length : from)
    }
  })
  link(proto, 'starts-with', function (value) {
    return typeof this === 'string' && typeof value === 'string'
      ? this.startsWith(value) : null
  })
  link(proto, 'ends-with', function (value) {
    return typeof this === 'string' && typeof value === 'string'
      ? this.endsWith(value) : null
  })

  // Converting
  // generate sub-string from this string.
  link(proto, 'copy', function (begin, end) {
    if (typeof this !== 'string') {
      return null
    }
    if (typeof begin !== 'number') {
      begin = 0
    } else if (begin < 0) {
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
  link(proto, 'trim', function () {
    return typeof this === 'string' ? this.trim() : null
  })
  link(proto, 'trim-left', function () {
    return typeof this === 'string' ? this.trimLeft() : null
  })
  link(proto, 'trim-right', function () {
    return typeof this === 'string' ? this.trimRight() : null
  })
  link(proto, 'replace', function (value, newValue) {
    return typeof this !== 'string' ? null
      : typeof value !== 'string' || !value ? this
        : this.replace(
          new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          typeof newValue === 'string' ? newValue : ''
        )
  })
  link(proto, 'to-upper', function (localed) {
    return typeof this !== 'string' ? null
      : localed === true ? this.toUpperCase() : this.toLocaleUpperCase()
  })
  link(proto, 'to-lower', function (localed) {
    return typeof this !== 'string' ? null
      : localed === true ? this.toLowerCase() : this.toLocaleLowerCase()
  })

  // combination and splitting of strings
  link(proto, ['concat', '+'], function () {
    if (typeof this !== 'string') {
      return null
    }
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
    return result.length < 1 ? ''
      : result.length === 1 ? result[0] : result.join('')
  })
  // the reversed operation of '-':
  // if the argument value is a string, to removes a substring if it's the suffix.
  // if the argument value is a number, to removes a suffix with the length of this number.
  // other argument values will be converted to a string and to be removed as suffix.
  link(proto, '-', function () {
    if (typeof this !== 'string') {
      return null
    }
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
    return typeof this !== 'string' ? null
      : typeof value !== 'string' || value.length < 1 ? [this] : this.split(value)
  })

  // get a character's unicode value by its offset in this string.
  link(proto, 'char-at', function (offset) {
    if (typeof this !== 'string' || typeof offset !== 'number') {
      return null
    }
    if (offset < 0) {
      offset += this.length
    }
    return offset < 0 || offset >= this.length ? null : this.charCodeAt(offset)
  })

  // Equivalence inherits from null.

  // Ordering: override general comparison logic.
  link(proto, 'compare', function (another, localed) {
    return typeof this !== 'string' || typeof another !== 'string' ? null
      : localed === true ? this.localeCompare(another)
        : this === another ? 0 : this > another ? 1 : -1
  })

  // comparing operators
  link(proto, '>', function (another) {
    return typeof this === 'string' && typeof another === 'string'
      ? this > another : null
  })
  link(proto, '>=', function (another) {
    return typeof this === 'string' && typeof another === 'string'
      ? this >= another : null
  })
  link(proto, '<', function (another) {
    return typeof this === 'string' && typeof another === 'string'
      ? this < another : null
  })
  link(proto, '<=', function (another) {
    return typeof this === 'string' && typeof another === 'string'
      ? this <= another : null
  })

  // the emptiness of string is determined by its length.
  link(proto, 'is-empty', function () {
    return typeof this === 'string' ? this === '' : null
  }, 'not-empty', function () {
    return typeof this === 'string' ? this !== '' : null
  })

  // Encoding
  link(proto, 'to-code', function () {
    return typeof this === 'string' ? this : null
  })

  // Representation
  link(proto, 'to-string', function () {
    return typeof this === 'string' ? JSON.stringify(this)
      : this === proto ? '(string proto)' : null
  })

  // Indexer
  protoIndexer(Type, function (index, value) {
    return typeof this !== 'string' ? null
      : typeof index === 'string'
        ? index === 'length' ? this.length : proto[index]
        : typeof index !== 'number' ? null
          : this.substr(index, typeof value === 'number' ? value : 1) // chars in a range.
  })

  // inject type
  String.prototype.type = Type // eslint-disable-line no-extend-native
}
