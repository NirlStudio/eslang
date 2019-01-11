'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var stringOf = $.string.of

  function formatArgs () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      strings.push(stringOf(arguments[i]))
    }
    return strings.join(' ')
  }

  function bindTo (method, type) {
    method = console[method]
    method = method
      ? $void.isNativeHost ? method.bind(console, '#', type)
        : method.bind(console, '#')
      : console.log.bind(console, '#', type)
    return !$void.isNativeHost ? method : function () {
      method(formatArgs.apply(null, arguments))
    }
  }

  // default native output methods
  return {
    print: function () {
      var text = formatArgs.apply(null, arguments)
      console.log(text)
      return text
    },
    info: bindTo('info', '[I]'),
    verbose: bindTo('info', '[V]'),
    warn: bindTo('warn', '[W]'),
    error: bindTo('error', '[E]'),
    debug: bindTo('debug', '[D]')
  }
}
