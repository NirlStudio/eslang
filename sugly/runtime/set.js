'use strict'

module.exports = function set ($) {
  var symbolKeyOf = $.Symbol['key-of']

  $.$set = function $set (subject, sym, value) {
    if (typeof subject !== 'object' && typeof subject !== 'function') {
      return null
    }

    var key = symbolKeyOf(sym)
    if (!key.startsWith('$') && !key.startsWith('__')) {
      subject[key] = value
    }
    return value
  }
}
