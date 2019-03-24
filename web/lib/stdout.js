'use strict'

var tracer = require('../../lib/stdout')

function connectTo (term, tracing, type) {
  return function () {
    var trace = tracing[type]
    var text = trace.apply(null, arguments)
    term[type](text)
    return text
  }
}

module.exports = function (term) {
  return function ($void) {
    var tracing = tracer($void, true)
    var connect = connectTo.bind(null, term, tracing)
    var stdout = {}
    for (var type in tracing) {
      stdout[type] = type !== 'printf' ? connect(type)
        : function (value, format) {
          value = tracing.printf(value)
          term.printf(value, format)
          return value
        }
    }
    return stdout
  }
}
