'use strict'

module.exports = function set ($) {

  $.$set = function $set (subject, sym, value) {
    var key = sym.key
    if (key.startsWith('$') || key.startsWith('__')) {
      return null
    }

    try {
      subject[key] = value
      return value
    } catch (err) {
      console.warn('assignment: ', subject, key, value, err)
      return null
    }
  }
}
