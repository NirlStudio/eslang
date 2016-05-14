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

function codeOf ($) {
  return function String$code_of (input) {
    return $.encode.value(input)
  }
}

function toCode ($) {
  return function String$to_code () {
    return $.encode.string(this)
  }
}

function toString () {
  return function String$to_string () {
    console.log('is string?', typeof this === 'string')
    return typeof this === 'string' ? this : ''
  }
}

module.exports = function ($) {
  var type = $.String
  $export.copy(type, String, {
    'fromCharCode': 'of-chars'
  })

  var value_of = $export(type, 'value-of', valueOf($))
  $export(type, 'is-type-of', isTypeOf())
  $export(type, 'code-of', codeOf($))

  var class_ = type.class
  $export.copy(class_, String.prototype, {
    /* CH/FF/IE/OP/SF */
    'charAt': 'char-at',
    'charCodeAt': 'chat-code-at',
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of',
    'localeCompare': 'locale-compare',
    'match': 'match',
    'replace': 'replace',
    'search': 'search',
    'slice': 'slice',
    'split': 'split',
    'substr': 'substring',
    'substring': 'substring-in',
    'toLocaleLowerCase': 'to-locale-lower',
    'toLocaleUpperCase': 'to-locale-upper',
    'toLowerCase': 'to-lower',
    'toUpperCase': 'to-upper',

    /* polyfilled */
    'trim': 'trim',
    'endsWith': 'ends-with',
    'startsWith': 'starts-with'
  })

  $export(class_, 'to-code', toCode($))
  $export(class_, 'to-string', toString())

  $export(class_, 'is-empty', function () {
    return this.length < 1
  })
  $export(class_, 'not-empty', function () {
    return this.length > 0
  })

  // indexer: override, interpret number as offset, readonly.
  $export(class_, ':', function (index) {
    if (typeof index === 'string') {
      var value = class_[index]
      return typeof value !== 'undefined' ? value : null
    }
    // interpret a number a char offset
    if (typeof index === 'number') {
      return index >= 0 && index < this.length ? this.charAt(index) : ''
    }
    return null
  })

  $export(class_, 'concat', function () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  // support ordering logic - comparable
  $export(class_, 'compare', function (another) {
    return this === another ? 0 : (this > another ? 1 : -1)
  })

  // support ordering operators
  $export(class_, '>', function (another) {
    return this > another
  })
  $export(class_, '>=', function (another) {
    return this >= another
  })
  $export(class_, '<', function (another) {
    return this < another
  })
  $export(class_, '<=', function (another) {
    return this <= another
  })
}
