'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.string
  var link = $void.link
  var thisCall = $void.thisCall
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer

  // the empty value
  link(Type, 'empty', '')

  // generate a string from inputs.
  link(Type, 'of', function (value) {
    // return the empty value without argument.
    if (typeof value === 'undefined') {
      return ''
    }
    // returns the original string if there's only one string argument.
    if (typeof value === 'string' && arguments.length < 2) {
      return value
    }
    // concat the trimed values of strings and to-string results of non-strings.
    var result = []
    for (var i = 0; i < arguments.length; i++) {
      var str = arguments[i]
      if (typeof str !== 'string') {
        str = $void.thisCall(str, 'to-string')
        if (typeof str !== 'string') {
          str = '()'
        }
      }
      str = str.trim()
      if (str) {
        result.push(str)
      }
    }
    return result.join(' ')
  })

  // generate a string from a series of unicode values
  link(Type, 'of-chars', function () {
    var str = String.fromCharCode.apply(String, arguments)
    return typeof str === 'undefined' ? '' : str
  })

  typeIndexer(Type)

  var proto = Type.proto
  // Searching
  // TODO: match & search with regex?
  // retrieve the first char or the index of the first occurence of value.
  link(proto, 'first', function (value, from) {
    return typeof this !== 'string' ? null
      : typeof value !== 'string' ? this.length > 0 ? this.charAt(0) : null
        : this.indexOf(value, typeof from !== 'number' ? 0 : from)
  })
  // retrieve the last char or the index of the last occurence of value.
  link(proto, 'last', function (value, from) {
    return typeof this !== 'string' ? null
      : typeof value !== 'string' ? this.length > 0
          ? this.charAt(this.length - 1) : null
        : this.lastIndexOf(value, typeof from !== 'number' ? this.length : from)
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
    if (typeof this === 'string') {
      if (typeof begin !== 'number') {
        begin = 0
      }
      if (typeof end !== 'number' || end > this.length) {
        end = this.length
      }
      return this.slice(begin, end)
    }
    return null
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
      : typeof value !== 'string' || value.length < 1 ? this
        : this.replace(
          new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          typeof newValue === 'string' ? newValue : ''
        )
  })
  link(proto, 'to-upper', function (localed) {
    return typeof this !== 'string' ? null
      : typeof localed === 'undefined' || localed === false || localed === null || localed === 0
        ? this.toUpperCase() : this.toLocaleUpperCase()
  })
  link(proto, 'to-lower', function (localed) {
    return typeof this !== 'string' ? null
      : typeof localed === 'undefined' || localed === false || localed === null || localed === 0
        ? this.toLowerCase() : this.toLocaleLowerCase()
  })

  // combination and splitting of strings
  link(proto, ['concat', '+'], function () {
    if (typeof this !== 'string') {
      return null
    }
    var result = [this]
    for (var i = 0; i < arguments.length; i++) {
      var str = arguments[i]
      if (typeof str === 'string') {
        result.push(str)
      } else {
        str = $void.thisCall(str, 'to-string')
        result.push(typeof str === 'string' ? str : '()')
      }
    }
    return result.join('')
  })
  // the reversed operation of '-':
  // if the argument value is a string, to removes a substring if it's the suffix.
  // if the argument value is a number, to removes a suffix with the lenth of this number.
  // other argument values will be converted to a string and to be removed as suffix.
  link(proto, '-', function () {
    if (typeof this !== 'string') {
      return null
    }
    if (this.length < 1 || arguments.length < 1) {
      return this
    }
    var result = this
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i]
      if (typeof value === 'string') {
        if (result.endsWith(value)) {
          result = result.substring(0, result.length - value.length)
        }
      } else if (typeof value === 'number') {
        result = result.substring(0, result.length - value)
      } else {
        value = thisCall(value, 'to-string')
        if (result.endsWith(value)) {
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
    return typeof this !== 'string' ? null
      : typeof offset !== 'number' || offset < 0 || offset >= this.length
        ? null : this.charCodeAt(offset)
  })

  // Identity & Equivalence: override to be consistent with comparison
  link(proto, ['is', 'equals', '=='], function (another) {
    return typeof this === 'string' && typeof another === 'string' &&
      this === another
  }, ['is-not', 'not-equals', '!='], function (another) {
    return typeof this !== 'string' || typeof another !== 'string' ||
      this !== another
  })

  // Ordering: override general comparison logic.
  link(proto, 'compare', function (another, localed) {
    if (typeof this !== 'string' || typeof another !== 'string') {
      return null
    }
    if (typeof localed === 'undefined' || localed === false ||
        localed === null || localed === 0) {
      return this === another ? 0 : this > another ? 1 : -1
    }
    return this.localeCompare(another)
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

  typeVerifier(Type)

  // the emptiness if string is determined by its length.
  link(proto, 'is-empty', function () {
    return typeof this === 'string' ? this === '' : null
  }, 'not-empty', function () {
    return typeof this === 'string' ? this !== '' : null
  })

  // Encoding: standardize to a boolean value.
  link(proto, 'to-code', function () {
    return typeof this === 'string' ? this : null
  })

  // Representation
  link(proto, 'to-string', function () {
    return typeof this === 'string' ? JSON.stringify(this) : null
  })

  // Indexer
  nativeIndexer(Type, String, 'string', function (index, value) {
    if (typeof this !== 'string') {
      return null
    }
    // getting properties
    if (typeof index === 'string') {
      return index === ':' ? null
        : index === 'type' ? Type // fake field
          : index === 'length' ? this.length // expose length
            : typeof proto[index] === 'undefined' ? null : proto[index]
    }
    // read char(s)
    if (typeof index === 'number') {
      return typeof value === 'number'
        ? index >= 0 ? this.substr(index, value) // chars in a range.
          : null
        : index >= 0 && index < this.length ? this.substr(index, 1) // read a single character.
          : null
    }
    return null
  })
}
