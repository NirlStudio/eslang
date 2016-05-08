'use strict'
var $export = require('./export')

module.exports = function ($) {
  var $Symbol = $.Symbol
  var SymbolConstructor = $Symbol.$Constructor

  var $Null = $.Null
  var $bool = $.Bool.$
  var $int = $.Int.$
  var $float = $.Float.$
  var $string = $.String.$
  var $symbol = $Symbol.$
  var $object = $.Object.$
  var $func = $.Function.$
  var $date = $.Date.$
  var $array = $.Array.$

  return $export($, '$resolve', function $resolve (subject, sym) {
    if (typeof subject === 'undefined') {
      subject = null
    }

    var key
    if (typeof sym === 'symbol') {
      key = Symbol.keyFor(sym)
    } else if (typeof sym === 'string') {
      key = sym
    } else if (SymbolConstructor && sym instanceof SymbolConstructor) {
      key = sym.$key
    } else {
      return null
    }
    if (key.length < 1) {
      return null
    }
    if (key.charAt(0) === '$') {
      return subject
    }

    var value
    if ($.$isSpace(subject)) {
      value = subject[key]
      return typeof value !== 'undefined' ? value : null
    }

    if (Object.prototype.hasOwnProperty.call(subject, key)) {
      value = subject[key]
    } else if (subject === null) {
      value = $Null[key]
    } else if (typeof subject === 'boolean') {
      value = $bool[key]
    } else if (typeof subject === 'number') {
      value = Number.isInteger(subject) ? $int[key] : $float[key]
    } else if (typeof subject === 'string') {
      value = $string[key]
    } else if (typeof subject === 'symbol') {
      value = $symbol[key]
    } else if (SymbolConstructor && subject instanceof SymbolConstructor) {
      value = $symbol[key]
    } else if (typeof subject === 'function') {
      value = subject.hasOwnProperty(key) ? subject[key] : $func[key]
    } else if (typeof subject === 'object') {
      if (Array.isArray(subject)) {
        value = $array[key]
      } else if (subject instanceof Date) {
        value = $date[key]
      } else {
        if (typeof Object.prototype[key] !== 'undefined') {
          value = $object[key]
        } else {
          value = subject[key]
          if (typeof value === 'undefined') {
            value = $object[key]
          }
        }
      }
    } else {
      return null
    }

    return typeof value === 'undefined' ? null : value
  })
}
