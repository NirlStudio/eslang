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
}
