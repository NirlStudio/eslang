'use strict'

var tracer = require('../../lib/stdout')

module.exports = function $stdout (term) {
  return function stdoutIn ($void) {
    var stdout = Object.create(null)

    var tracing = tracer($void, true)

    function forward (type) {
      return function trace () {
        var trace = tracing[type]
        var text = trace.apply(null, arguments)
        term[type](text)
        return text
      }
    }

    for (var type in tracing) {
      stdout[type] = type !== 'printf'
        ? forward(type)
        : function printf (value, format) {
          value = tracing.printf(value)
          term.printf(value, format)
          return value
        }
    }

    return stdout
  }
}
