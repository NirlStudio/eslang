'use strict'

module.exports = function assign ($void) {
  var ownsProperty = $void.ownsProperty

  $void.assign = function $assign (space, sym, value) {
    var key = typeof sym === 'string' ? sym : sym.key
    if (ownsProperty(space.$, key) || space.moduleIdentifier || !space.parent) {
      return (space.$[key] = value)
    }

    var parent = space.parent.$
    return typeof parent[key] === 'undefined'
      ? (space.$[key] = value) : (parent[key] = value)
  }

  $void.set = function $set (subject, sym, value) {
    var key = typeof sym === 'string' ? sym : sym.key
    if (typeof subject[':'] === 'function') {
      return subject[':'](key, value)
    } else if (typeof subject === 'object') {
      // object from prototype of null
      return (subject[key] = value)
    } else {
      return null
    }
  }

  $void.seti = function $seti (subject, index, value) {
    return typeof subject[':'] === 'function' ? subject[':'](index, value) : null
  }
}
