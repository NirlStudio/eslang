'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var constant = $void.constant

  constant($, 'print', function print () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i]
      if (typeof value === 'string') {
        strings.push(value)
      } else if (typeof value === 'undefined' || value === null) {
        strings.push(value)
      } else {
        var toString = value['to-string'] ||
          (value.type && value.type.proto && value.type.proto['to-string'])
        strings.push(typeof toString === 'function' ? toString.call(value) : '(?)')
      }
    }
    if (strings.length > 0) {
      console.log(strings.join(''))
    } else {
      console.log('')
    }
  })

  constant($, 'warn', function warn () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i]
      if (typeof value === 'string') {
        strings.push(value)
      } else if (typeof value === 'undefined' || value === null) {
        strings.push(value)
      } else {
        var toCode = value['to-code'] ||
          (value.type && value.type.proto && value.type.proto['to-code'])
        strings.push(typeof toCode === 'function' ? toCode.call(value) : '(?)')
      }
    }
    if (strings.length > 0) {
      console.warn(strings.join(''))
    } else {
      console.warn('')
    }
  })
}
