'use strict'

module.exports = function set ($void) {
  var isSpace = Object.prototype.isPrototypeOf.bind($void.$)

  $void.set = function $set (subject, sym, value) {
    var key = typeof sym === 'string' ? sym : sym.key
    if (typeof subject[':'] === 'function') {
      return subject[':'](key, value)
    } else if (isSpace(subject)) {
      return (subject[key] = value)
    } else if (typeof subject === 'object') {
      // object from prototype of null
      return (subject[key] = value)
    } else {
      return null
    }
  }
}
