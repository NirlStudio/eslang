'use strict'

function createValueOf () {
  return function Float$valueOf (input) {
    if (typeof input === 'string') {
      var value = parseFloat(input)
      return isNaN(value) ? 0.0 : value
    }
    if (typeof input === 'undefined' || input === null) {
      return 0.0
    }
    return typeof input === 'number' ? input : 0.0
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var type = $.Float
  var readonly = $void.readonly

  // override to only accept string, null and number itself.
  readonly(type, 'value-of', createValueOf())

  // super type is fixed to Number
  readonly(type, 'super', function Float$super () {
    return $.Number
  })

  var proto = type.proto

  // override indexer to expose functions
  readonly(proto, ':', function float$indexer (name) {
    if (typeof name === 'string') {
      return typeof proto[name] !== 'undefined' ? proto[name] : null
    }
    return null
  })
}
