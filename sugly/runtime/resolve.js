'use strict'

module.exports = function ($void) {
  var Symbol$ = $void.Symbol
  var $ = $void.$

  var $Null = $.Null
  var $null = $.Type.proto
  var $bool = $.Bool.proto
  var $int = $.Int.proto
  var $float = $.Float.proto
  var $string = $.String.proto
  var $Symbol = $.Symbol
  var $symbol = $Symbol.proto
  var $object = $.Class.proto
  var $func = $.Function.proto
  var $date = $.Date.proto
  var $array = $.Array.proto

  var isSpace = Object.prototype.isPrototypeOf.bind($)
  var isObject = Object.prototype.isPrototypeOf.bind($object)
  var ownsProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

  $void.resolve = function $resolve (subject, sym) {
    // resolve key form symbol.
    var key = typeof sym === 'string' ? sym : (sym.key || '')

    // empty key to be resolved to null.
    if (key.length < 1) {
      return null
    }

    var value
    if (typeof subject === 'object') {
      if (ownsProperty(subject, key) || isObject(subject)) {
        value = subject[key]
      } else if ($ === subject || isSpace(subject)) {
        if (key.charAt(0) === '$') {
          return subject
        }
        value = subject[key]
      } else if (Array.isArray(subject)) {
        value = $array[key]
      } else if (subject instanceof Date) {
        value = $date[key]
      } else if (subject instanceof Symbol$) {
        value = $symbol[key]
      } else if (subject === null) {
        value = $Null[key]
      } else {
        // an native object
        value = subject[key]
        if (typeof value === 'undefined') {
          value = $object[key]
        }
      }
    } else if (typeof subject === 'string') {
      value = key === 'length' ? subject.length : $string[key]
    } else if (typeof subject === 'number') {
      value = Number.isInteger(subject) ? $int[key] : $float[key]
    } else if (typeof subject === 'boolean') {
      value = $bool[key]
    } else if (typeof subject === 'function') {
      value = ownsProperty(subject, key) ? subject[key] : $func[key]
    } else {
      value = $null[key]
    }

    return typeof value === 'undefined' ? null : value
  }
}
