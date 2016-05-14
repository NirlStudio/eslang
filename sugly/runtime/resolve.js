'use strict'

module.exports = function ($) {
  var isSpace = Object.prototype.isPrototypeOf.bind($)
  var $Symbol = $.Symbol
  var SymbolConstructor = $Symbol.$Constructor

  var $Null = $.Null
  var $bool = $.Bool.class
  var $int = $.Int.class
  var $float = $.Float.class
  var $string = $.String.class
  var $symbol = $Symbol.class
  var $object = $.Object.class
  var $func = $.Function.class
  var $date = $.Date.class
  var $array = $.Array.class

  var isObject = Object.prototype.isPrototypeOf.bind($object)

  $.$resolve = function $resolve (subject, sym) {
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

    var value
    if ($ === subject || isSpace(subject)) {
      if (key.charAt(0) === '$') {
        return subject
      }
      value = subject[key]
      return typeof value !== 'undefined' ? value : null
    }

    if (Object.prototype.hasOwnProperty.call(subject, key) || isObject(subject)) {
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
  }
}
