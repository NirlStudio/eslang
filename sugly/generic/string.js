'use strict'

function ceateValueOf ($void) {
  return function String$valueOf () {
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
      var toStr = $void.indexerOf(arg).call(arg, 'to-string')
      result += typeof toStr === 'function' ? toStr.call(arg) : ''
    }
    return result
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.String
  var readonly = $void.readonly
  var copyObject = $void.copyObject
  var copyProto = $void.copyProto

  // concatenate the to-string result of arguments
  var valueOf = readonly(type, 'value-of', ceateValueOf($void))

  // generate a string from a series of unicode values
  copyObject(type, String, {
    'fromCharCode': 'of-char-codes'
  })

  var proto = type.proto

  // forward the length property.
  readonly(proto, 'length', function string$length () {
    return this.length
  })

  var verify = function string$verify (value) {
    return typeof value === 'string'
  }

  // generate sub-string from this string.
  copyProto(type, String, verify, {
    /* CH/FF/IE/OP/SF */
    'slice': 'slice', // [start, end), supports negative values.
    'substr': 'substring', // [start, start + length)
    'substring': 'substring-in' // [start, end), only 0 or positive values.
  })

  // find & match substring in this string.
  copyProto(type, String, verify, {
    /* CH/FF/IE/OP/SF */
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of',

    'match': 'match',
    'search': 'search',

    'endsWith': 'ends-with',
    'startsWith': 'starts-with'
  })

  // value converting of this string.
  copyProto(type, String, verify, {
    'toLocaleLowerCase': 'to-locale-lower',
    'toLocaleUpperCase': 'to-locale-upper',

    'toLowerCase': 'to-lower',
    'toUpperCase': 'to-upper',

    'replace': 'replace',
    'trim': 'trim'
  })

  // get a character or its unicode value by its offset in this string.
  copyProto(type, String, verify, {
    /* CH/FF/IE/OP/SF */
    'charAt': 'char-at',
    'charCodeAt': 'chat-code-at'
  })

  // combination and splitting of strings
  readonly(proto, 'concat', function string$concat () {
    return valueOf.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  copyProto(type, String, verify, {
    'split': 'split'
  })

  // support general operators
  readonly(proto, '+', function string$oprConcat () {
    return valueOf.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })
  readonly(proto, '-', function string$oprRemove (value) {
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
  readonly(proto, 'compare', function string$compare (another) {
    return this === another ? 0 : (this > another ? 1 : -1)
  })
  copyProto(type, String, verify, {
    'localeCompare': 'locale-compare'
  })

  // support ordering operators
  readonly(proto, '>', function string$oprGT (another) {
    return typeof another === 'string' ? this > another : false
  })
  readonly(proto, '>=', function string$oprGE (another) {
    return typeof another === 'string' ? this >= another : false
  })
  readonly(proto, '<', function string$oprLT (another) {
    return typeof another === 'string' ? this < another : false
  })
  readonly(proto, '<=', function string$oprLE (another) {
    return typeof another === 'string' ? this <= another : false
  })

  // the emptiness if string is determined by its length.
  readonly(proto, 'is-empty', function string$isEmpty () {
    return this.length < 1
  })
  readonly(proto, 'not-empty', function string$notEmpty () {
    return this.length > 0
  })

  // persistency & describe
  readonly(proto, 'to-code', function string$toCode () {
    return JSON.stringify(typeof this === 'string' ? this : '')
  })
  readonly(proto, 'to-string', function string$toString () {
    return this
  })

  // indexer: override, interpret number as offset, readonly.
  readonly(proto, ':', function string$indexer (index) {
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
  readonly(proto, '?', function string$boolTest (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(String, 'type', type)
  $void.injectTo(String, ':', proto[':'])
}
