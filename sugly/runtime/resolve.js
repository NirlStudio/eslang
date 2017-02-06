'use strict'

module.exports = function resolve ($void) {
  $void.resolve = function $resolve (space, sym) {
    var key = typeof sym === 'string' ? sym : (sym.key || '')
    var value = space.$[key]
    return typeof value === 'undefined' ? null : value
  }
}
