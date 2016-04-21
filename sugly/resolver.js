'use strict'

function exposeAll (obj, sym) {
  var key = Symbol.keyFor(sym)
  if (key.startsWith('$') || key.startsWith('__')) {
    return null // actually, almost all
  }

  var value = obj[key]
  return typeof value === 'undefined' ? null : value
}

module.exports = function (/* options */) {
  // TODO: filter, replace & mapping
  return exposeAll
}
