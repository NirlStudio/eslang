'use strict'

module.exports = function set ($void) {
  $void.set = function $set (subject, sym, value) {
    var key = typeof sym === 'string' ? sym : sym.key
    try {
      return (subject[key] = value)
    } catch (err) {
      console.warn('assignment: ', subject, key, value, err)
      return null
    }
  }
}
