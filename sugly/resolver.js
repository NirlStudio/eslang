'use strict'

function exposeAll (obj, sym) {
  var key = Symbol.keyFor(sym)
  if (key.startsWith('$') || key.startsWith('__')) {
    return null // actually, almost all
  }

  var value = obj[key]
  if (typeof value === 'undefined') {
    return null
  }

  // an immediate property
  if (!obj.hasOwnProperty /* ??? */ || obj.hasOwnProperty(key)) {
    if (!Object.isSealed(obj)) {
      obj[sym] = value // cache it.
    }
    return value
  }

  // trace back prototype chain
  var stack = [obj]
  var last = obj
  obj = Object.getPrototypeOf(obj)
  while (last !== obj && obj) {
    stack.push(obj)
    last = obj
    if (!obj.hasOwnProperty || obj.hasOwnProperty(obj)) {
      break
    }
    obj = Object.getPrototypeOf(obj)
  }

  // find a mutable one
  do {
    obj = stack.pop()
    if (!Object.isSealed(obj)) {
      obj[sym] = value
      break
    }
  } while (stack.length > 0)

  return value
}

module.exports = function (/* options */) {
  // TODO: filter, replace & mapping
  return exposeAll
}
