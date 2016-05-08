'use strict'

module.exports = function $measure (obj) {
  // shortcut for string & array
  if (typeof obj === 'string' || Array.isArray(obj)) {
    return obj.length
  }

  if (typeof obj !== 'object') {
    return NaN
  }

  // check common properties & getters
  var keys = ['length', 'size', 'count']
  var key
  for (var i = 0; i < keys.length; i++) {
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

  // try to enumerate it. TODO - looper
  var count = 0
  for (key in obj) {
    count += 1
  }
  if (count) {
    return count
  }

  // try to get owned properties. TODO - looper
  if (typeof Object.getOwnPropertyNames === 'function') {
    return Object.getOwnPropertyNames(obj).length
  }

  return NaN
}
