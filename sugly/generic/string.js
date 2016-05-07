'use strict'

var $export = require('../export')
var dump = $export.dump(String)

var $inst = {}
Object.assign($inst, dump.methods)

function isType () {
  return function String$is_type (value) {
    return typeof value === 'string'
  }
}

function valueOf ($) {
  return function String$value_of (input) {
    var length = arguments.length
    var result = ''
    for (var i = 0; i < length; i++) {
      var arg = arguments[0]
      if (typeof arg === 'string') {
        result += arg
        continue
      }
      if (result.length > 0) {
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

function isSame () {
  return function String$is_same (value) {
    return typeof this === 'string' ? this === value : false
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

module.exports = function ($) {
  var type = $export($, 'String')
  $export(type, 'is', isType())
  $export(type, 'code-of', codeOf())

  var value_of = $export(type, 'value-of', valueOf())
  $export.wrap(type, 'of-chars', String, String.fromCharCode)

  var pt = $export(type, null, $export.copy('$', $inst))
  $export(pt, 'is', isSame())
  $export(pt, 'equals', isSame())

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toString())

  $export(pt, 'concat', function () {
    return value_of.apply(null, [this].concat(Array.prototype.slice.call(arguments)))
  })

  return type
}
