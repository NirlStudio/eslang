'use strict'

module.exports = function assign ($) {
  var ownsProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)

  $.$assign = function $assign ($, sym, value) {
    var key = typeof sym === 'string' ? sym : sym.key
    if (key.startsWith('$') || key.startsWith('__')) {
      return null
    }

    if (ownsProperty($, key) || typeof $[key] === 'undefined') {
      $[key] = value
    } else {
      Object.getPrototypeOf($)[key] = value
    }
    return value
  }
}
