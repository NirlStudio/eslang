'use strict'

module.exports = function assign ($) {
  $.$assign = function $assign ($, sym, value) {
    var key = typeof sym === 'symbol' ? Symbol.keyFor(sym) : sym.$key
    if (key.startsWith('$') || key.startsWith('__')) {
      return null
    }

    if (Object.prototype.hasOwnProperty.call($, key) || typeof $[key] === 'undefined') {
      $[key] = value
    } else {
      Object.getPrototypeOf($)[key] = value
    }
    return value
  }
}
