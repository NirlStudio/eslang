'use strict'

module.exports = function indexer ($) {
  var set = $.$set

  var Symbol$ = $.$SymbolConstructor
  var symbolValueOf = $.Symbol['value-of']

  function getter (subject, key) {
    if (typeof subject !== 'object' && typeof subject !== 'function') {
      return null
    }

    if (key instanceof Symbol$) {
      key = key.key
    }

    var value = subject[key]
    if (typeof value !== 'undefined') {
      return value
    }
    return null
  }

  $.$indexer = function $indexer (key, value) {
    if (key === null) {
      return null
    }
    // getting value
    if (typeof value === 'undefined') {
      return getter(this, key)
    }

    // setting property
    if (typeof key === 'string') {
      return set(this, symbolValueOf(key), value)
    }
    if (key instanceof Symbol$) {
      return set(this, key, value)
    }

    // general operation - TODO - looper, type filtering?
    try {
      this[key] = value
    } catch (err) {
      console.log('indexer error: ', err)
      return null
    }
  }
}
