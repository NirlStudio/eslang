'use strict'

module.exports = function assign ($) {
  var symbolKeyOf = $.Symbol['key-of']

  $.$assign = function $assign ($, sym, value) {
    var key = symbolKeyOf(sym) // TODO - optimizer
    if (Object.prototype.hasOwnProperty.call($, key)) {
      $[key] = value
      return value
    }

    var module = $
    while (module && module.spaceIdentifier && module.spaceIdentifier !== $.moduleSpaceIdentifier) {
      module = Object.getPrototypeOf(module)
    }

    if (Object.prototype.hasOwnProperty.call(module, key)) {
      module[key] = value
    } else {
      $[key] = value
    }
    return value
  }
}
