'use strict'

var $export = require('../export')

function valueOf (get) {
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
      var to_str = get(arg, 'to-string')
      result += typeof to_str === 'function' ? to_str.call(arg) : ''
    }
    return result
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var get = $void.get
  var type = $.String

  // concatenate the to-string result of arguments
  var value_of = $export(type, 'value-of', valueOf(get))

  // generate a string from a series of unicode values
  $export.copy(type, String, {
    'fromCharCode': 'of-char-codes'
  })

  var proto = type.proto

  // forward the length property.
  $export(proto, 'length', function string$length () {
    return this.length
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
  $export(proto, 'concat', function string$concat () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export.copy(proto, String.prototype, {
    'split': 'split'
  })

  // support general operators
  $export(proto, '+', function string$opr_concat () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  $export(proto, '-', function string$opr_remove (value) {
    if (typeof value === 'string') {
      // remove value by its last index in this string.
      var offset = this.lastIndexOf(value)
      return offset >= 0 ? this.substring(0, offset) : this
    }
    if (typeof value === 'number') {
      // remove the trailing characters by the length of value.
      if (value > this.length) {
        return ''
      } else if (value < 0) {
        return this
      }
      return this.substring(0, this.length - value)
    }
    return this
  })

  // support ordering logic - comparable
  $export(proto, 'compare', function string$compare (another) {
    return this === another ? 0 : (this > another ? 1 : -1)
  })
  $export.copy(proto, String.prototype, {
    'localeCompare': 'locale-compare'
  })

  // support ordering operators
  $export(proto, '>', function string$opr_gt (another) {
    return typeof another === 'string' ? this > another : false
  })
  $export(proto, '>=', function string$opr_ge (another) {
    return typeof another === 'string' ? this >= another : false
  })
  $export(proto, '<', function string$opr_lt (another) {
    return typeof another === 'string' ? this < another : false
  })
  $export(proto, '<=', function string$opr_le (another) {
    return typeof another === 'string' ? this <= another : false
  })

  // persistency & describe
  $export(proto, 'to-code', function string$to_code () {
    return $.encode.string(this)
  })
  $export(proto, 'to-string', function string$to_string () {
    return typeof this === 'string' ? this : ''
  })

  // the emptiness if string is determined by its length.
  $export(proto, 'is-empty', function string$is_empty () {
    return this.length < 1
  })
  $export(proto, 'not-empty', function string$not_empty () {
    return this.length > 0
  })

  // indexer: override, interpret number as offset, readonly.
  $export(proto, ':', function string$indexer (index) {
    if (typeof index === 'string') {
      return typeof proto[index] !== 'undefined' ? proto[index] : null
    }
    // interpret a number a char offset
    if (typeof index === 'number') {
      return index >= 0 && index < this.length ? this.charAt(index) : ''
    }
    return null
  })

  // override to boost - an object is always true
  $export(proto, '?', function string$bool_test (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(String, 'type', type)
  $void.injectTo(String, ':', proto[':'])
}
