'use strict'

module.exports = function ($void, mutePrint) {
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
      ? $void.isNativeHost ? method.bind(console, '#' + type)
        : method.bind(console, '#')
      : console.log.bind(console, '#' + type)
    return !$void.isNativeHost ? function () {
      method.apply(null, arguments)
      return formatArgs.apply(null, arguments)
    } : function () {
      var text = formatArgs.apply(null, arguments)
      method(text)
      return text
    }
  }

  // default native output methods
  return {
    print: function () {
      var text = formatArgs.apply(null, arguments)
      !mutePrint && console.log(text)
      return text
    },
    verbose: bindTo('info', 'V'),
    info: bindTo('info', 'I'),
    warn: bindTo('warn', 'W'),
    error: bindTo('error', 'E'),
    debug: bindTo('debug', 'D')
  }
}
