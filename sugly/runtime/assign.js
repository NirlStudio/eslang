'use strict'

module.exports = function assign ($void) {
  var ownsProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

  $void.assign = function $assign ($, sym, value) {
    var key = typeof sym === 'string' ? sym : sym.key
    if (ownsProperty($, key) || typeof $[key] === 'undefined') {
      $[key] = value
    } else {
      Object.getPrototypeOf($)[key] = value
    }
    return value
  }
}
