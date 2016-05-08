'use strict'

var $export = require('../export')

function isType () {
  return function Array$is_type (value) {
    return Array.isArray(value)
  }
}

function create () {
  return function Array$create (x, y, z) {
    switch (arguments.length) {
      case 0:
        return []
      case 1:
        return [x]
      case 2:
        return [x, y]
      case 3:
        return [x, y, z]
      default:
        return Array.prototype.slice.call(arguments)
    }
  }
}

function isSame () {
  return function Array$is_same (another) {
    return Array.isArray(this) ? this === another : false
  }
}

function equals ($, is_same) {
  return function Array$equals (another) {
    if (is_same.call(this, another)) {
      return true
    }
    if (!Array.isArray(this) || !Array.isArray(another) || this.length !== another.length) {
      return false
    }
    var length = this.length
    for (var i = 0; i < length; i++) {
      var value = this[i]
      var eq = $.$resolve(value, 'equals')
      if (typeof eq !== 'function' || !eq.call(value, another[i])) {
        return false
      }
    }
    return true
  }
}

function toCode ($) {
  return function Array$to_code (pretty) {
    return $.encode.array(this)
  }
}

function toClause ($) {
  return function Array$to_clause (pretty) {
    return $.encode.clause(this)
  }
}

function toProgram ($) {
  return function Array$to_program (pretty) {
    return $.encode(this)
  }
}

function concat () {
  return function Array$concat () {
    return arguments.length < 1 ? [] : Array.prototype.concat.apply([], arguments)
  }
}

function ofType () {
  return function Array$of (type, length, value) {
    // TODO - to be implemented
    return []
  }
}

function fromSource () {
  return function Array$from (source, mapFunc, thisArg) {
    // TODO - to be implemented
    return []
  }
}

module.exports = function ($) {
  var type = $export($, 'Array')
  $export(type, 'is', isType())
  $export(type, 'create', create())

  $export(type, 'concat', concat())
  $export(type, 'of', ofType())
  $export(type, 'from', fromSource())

  var pt = $export(type, null, $export.copy('$', Array.prototype, {
    /* Chrome, IE, Firefox */
    'slice': 'slice',
    /* IE5.5 */
    'concat': 'concat',
    'join': 'join',
    'pop': 'pop',
    'push': 'push',
    'reverse': 'reverse',
    'shift': 'shift',
    'sort': 'sort',
    'splice': 'splice',
    'unshift': 'unshift',
    /* IE9 */
    'every': 'every',
    'filter': 'filter',
    'forEach': 'for-each',
    'indexOf': 'index-of',
    'lastIndexOf': 'last-index-of',
    'map': 'map',
    'reduce': 'reduce',
    'reduceRight': 'reduce-right',
    'some': 'some'
  }))
  var is_same = $export(pt, 'is', isSame())
  $export(pt, 'equals', equals($, is_same))

  $export(pt, 'to-code', toCode($))
  $export(pt, 'to-string', toCode($))

  $export(pt, 'to-clause', toClause($))
  $export(pt, 'to-program', toProgram($))

  return type
}
