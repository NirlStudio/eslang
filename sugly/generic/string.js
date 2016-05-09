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
  var type = $export($, 'String')
  $export(type, 'is-type-of', isTypeOf())
  $export(type, 'code-of', codeOf($))

  var value_of = $export(type, 'value-of', valueOf($))
  $export.wrap(type, 'of-chars', String, String.fromCharCode)

  var pt = Object.create($.Null.$)
  $export(type, null, $export.copy('$', String.prototype, {
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
  }, pt))

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toString())

  $export(pt, 'concat', function () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  return type
}
