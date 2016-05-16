'use strict'

var $export = require('../export')

function isTypeOf () {
  return function String$is_type_of (value) {
    return typeof value === 'string'
  }
}

function valueOf ($) {
  return function String$value_of () {
    var length = arguments.length
    var result = ''
    for (var i = 0; i < length; i++) {
      var arg = arguments[i]
      if (typeof arg === 'string') {
        result += arg
        continue
      }
      if (result.length > 0 && !result.endsWith(' ')) {
        result += ' '
      }
      var to_str = $.$resolve(arg, 'to-string')
      result += typeof to_str === 'function' ? to_str.call(arg) : ''
    }
    return result
  }
}

function toCode ($) {
  return function String$to_code () {
    return $.encode.string(this)
  }
}

function toString () {
  return function String$to_string () {
    return typeof this === 'string' ? this : ''
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.String
  // test if an value is a string.
  $export(type, 'is-type-of', isTypeOf())

  // concatenate the to-string result of arguments
  var value_of = $export(type, 'value-of', valueOf($))

  // generate a string from a series of unicode values
  $export.copy(type, String, {
    'fromCharCode': 'of-char-codes'
  })

  var proto = type.proto
  // persistency & describe
  $export(proto, 'to-code', toCode($))
  $export(proto, 'to-string', toString())

  // the emptiness if string is determined by its length.
  $export(proto, 'is-empty', function () {
    return this.length < 1
  })
  $export(proto, 'not-empty', function () {
    return this.length > 0
  })

  // generate sub-string from this string.
  $export.copy(proto, String.prototype, {
    /* CH/FF/IE/OP/SF */
    'slice': 'slice', // [start, end), supports negative values.
    'substr': 'substring', // [start, start + length)
    'substring': 'substring-in' // [start, end), only 0 or positive values.
  })

  // find & match substring in this string.
  $export.copy(proto, String.prototype, {
    /* CH/FF/IE/OP/SF */
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of',

    'match': 'match',
    'search': 'search',

    'endsWith': 'ends-with',
    'startsWith': 'starts-with'
  })

  // value converting of this string.
  $export.copy(proto, String.prototype, {
    'toLocaleLowerCase': 'to-locale-lower',
    'toLocaleUpperCase': 'to-locale-upper',

    'toLowerCase': 'to-lower',
    'toUpperCase': 'to-upper',

    'replace': 'replace',
    'trim': 'trim'
  })

  // get a character or its unicode value by its offset in this string.
  $export.copy(proto, String.prototype, {
    /* CH/FF/IE/OP/SF */
    'charAt': 'char-at',
    'charCodeAt': 'chat-code-at'
  })

  // combination and splitting of strings
  $export(proto, 'concat', function () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export.copy(proto, String.prototype, {
    'split': 'split'
  })

  // support ordering logic - comparable
  $export(proto, 'compare', function (another) {
    return this === another ? 0 : (this > another ? 1 : -1)
  })
  $export.copy(proto, String.prototype, {
    'localeCompare': 'locale-compare'
  })

  // indexer: override, interpret number as offset, readonly.
  var indexer = proto[':']
  $export(proto, ':', function (index) {
    if (typeof index === 'string') {
      return indexer.call(this, index)
    }
    // interpret a number a char offset
    if (typeof index === 'number') {
      return index >= 0 && index < this.length ? this.charAt(index) : ''
    }
    return null
  })

  // support general operators
  $export(proto, '+', function () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(proto, '-', function (value) {
    if (typeof value === 'string') {
      // remove value by its last index in this string.
      var offset = this.lastIndexOf(value)
      return offset >= 0 ? this.substring(0, offset) : this
    }
    if (typeof value === 'number') {
      // remove the trailing characters by the length of value.
      if (value > this.length) {
        value = this.length
      }
      return this.substring(0, this.length - value)
    }
    return this
  })

  // support ordering operators
  $export(proto, '>', function (another) {
    return typeof another === 'string' ? this > another : false
  })
  $export(proto, '>=', function (another) {
    return typeof another === 'string' ? this >= another : false
  })
  $export(proto, '<', function (another) {
    return typeof another === 'string' ? this < another : false
  })
  $export(proto, '<=', function (another) {
    return typeof another === 'string' ? this <= another : false
  })
}
