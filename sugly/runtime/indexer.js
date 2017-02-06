'use strict'

module.exports = function indexerOf ($void) {
  var $ = $void.$
  var $null = $void.null[':']
  var $entity = $.Type.proto[':']
  var $object = $.Object.proto[':']
  var $bool = $.Bool.proto[':']
  var $int = $.Int.proto[':']
  var $float = $.Float.proto[':']
  var $string = $.String.proto[':']
  var $array = $.Array.proto[':']
  var $date = $.Date.proto[':']
  var Symbol$ = $void.Symbol
  var $symbol = $.Symbol.proto[':']
  var $func = $.Function.proto[':']

  $void.indexerOf = function $indexerOf (subject) {
    if (typeof subject === 'undefined' || subject === null) {
      return $null
    }
    if (typeof subject === 'object') {
      if (Array.isArray(subject)) {
        return $array
      }
      if (subject instanceof Date) {
        return $date
      }
      if (subject instanceof Symbol$) {
        return $symbol
      }
      return $object
    }
    if (typeof subject === 'string') {
      return $string
    }
    if (typeof subject === 'function') {
      return $func
    }
    if (typeof subject === 'number') {
      return Number.isInteger(subject) ? $int : $float
    }
    if (typeof subject === 'boolean') {
      return $bool
    }
    return $entity // unkown and/or unsupported native types, e.g. Symbol
  }
}
