'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.string
  var link = $void.link
  var Integer$ = $void.Integer
  var copyProto = $void.copyProto
  var copyObject = $void.copyObject
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
    if (typeof value === 'string') {
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
  copyObject(Type, String, {
    'fromCharCode': 'of-chars'
  })

  typeIndexer(Type)

  var proto = Type.proto
  // generate sub-string from this string.
  copyProto(Type, String, 'string', {
    'slice': 'substring' // [start, end), supports negative values.
  })

  // find & match substring in this string.
  copyProto(Type, String, 'string', {
    /* CH/FF/IE/OP/SF */
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of',

    'match': 'match',
    'search': 'search',

    'endsWith': 'ends-with',
    'startsWith': 'starts-with'
  })

  // value converting of this string.
  copyProto(Type, String, 'string', {
    'toLocaleLowerCase': 'to-locale-lower',
    'toLocaleUpperCase': 'to-locale-upper',

    'toLowerCase': 'to-lower',
    'toUpperCase': 'to-upper',

    'replace': 'replace',
    'trim': 'trim'
  })

  // get a character or its unicode value by its offset in this string.
  copyProto(Type, String, 'string', {
    /* CH/FF/IE/OP/SF */
    'charAt': 'char-at',
    'charCodeAt': 'chat-code-at'
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
  copyProto(Type, String, 'string', {
    'split': 'split'
  })

  // Equivalence: override to be consistent with comparison
  link(proto, ['equals', '=='], function (another) {
    return typeof this === 'string' &&
      typeof another === 'string' &&
      this.localeCompare(another) === 0
  }, ['not-equals', '!='], function (another) {
    return typeof this !== 'string' ||
      typeof another !== 'string' ||
      this.localeCompare(another) !== 0
  })

  // Ordering: override general comparison logic.
  var compare = link(proto, 'compare', function (another) {
    return typeof this !== 'string' || typeof another !== 'string' ? null
      : this.localeCompare(another)
  })

  // comparing operators
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
    if (index instanceof Integer$) {
      index = index.number
    }
    if (typeof index === 'number') {
      if (value instanceof Integer$) {
        value = value.number
      }
      return typeof value === 'number'
        ? this.substr(index, value) // chars in a range.
        : this.substr(index, 1) // read a single character.
    }
    return null
  })
}
