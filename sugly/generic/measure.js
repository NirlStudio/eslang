'use strict'

module.exports = function measure ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']

  $.$measure = function $measure (obj) {
    if (typeof obj === 'undefined' || obj === null) {
      return 0
    }
    if (typeof obj === 'boolean') {
      return obj ? 1 : 0
    }
    if (typeof obj === 'number') {
      return obj
    }
    if (typeof obj === 'string' || Array.isArray(obj)) {
      return obj.length
    }
    if (isSymbol(obj)) {
      return symbolKeyOf(obj).length
    }
    if (obj instanceof Date) {
      return obj.getTime()
    }
    if (typeof obj === 'function') {
      return Infinity // ensure not-empty
    }
    if (typeof obj !== 'object') {
      return 0 // unknown object
    }

    // check common properties & getters
    var keys = ['length', 'size', 'count', 'get-length', 'get-size', 'get-count']
    var i, key
    for (i = 0; i < keys.length; i++) {
      key = keys[i]
      try {
        var value = obj[key]
        if (typeof value === 'function') {
          value = value()
        }
        if (typeof value === 'number') {
          return value
        }
      } catch (err) {}
    }

    // try to enumerate it.
    var count = 0
    for (key in obj) {
      if (typeof key !== 'string' || !key.startsWith('$')) {
        count += 1
      }
    }
    if (count) {
      return count
    }

    // try to get owned properties.
    if (typeof Object.getOwnPropertyNames === 'function') {
      var names = Object.getOwnPropertyNames(obj)
      for (i = 0; i < names.length; i++) {
        var name = names[i]
        if (!name.startsWith('$')) {
          count += 1
        }
      }
    }
    return count
  }
}
