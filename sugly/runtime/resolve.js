'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Null = $void.null
  var $entity = $.Type.proto
  var $int = $.Int.proto
  var $float = $.Float.proto

  $void.resolve = function $resolve (space, sym) {
    var key = typeof sym === 'string' ? sym : (sym.key || '')
    var value = space.$[key]
    return typeof value === 'undefined' ? null : value
  }

  $void.get = function $get (subject, sym) {
    var key = typeof sym === 'string' ? sym : (sym.key || '')
    var value
    if (typeof subject === 'undefined' || subject === null) {
      value = $Null[key]
    } else if (typeof subject === 'number') {
      value = Number.isInteger(subject) ? $int[key] : $float[key]
    } else {
      var indexer = subject[':']
      if (typeof indexer !== 'function') {
        indexer = $entity[':']
      }
      value = indexer.call(subject, key)
    }
    return typeof value === 'undefined' ? null : value
  }

  $void.geti = function $geti (subject, index) {
    if (typeof subject === 'number') {
      var indexer = Number.isInteger(subject) ? $int[':'] : $float[':']
      return indexer.call(subject, index)
    } else {
      return typeof subject[':'] === 'function' ? subject[':'](index) : null
    }
  }
}
