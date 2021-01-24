'use strict'

var style = require('./style')
var styles = style.styles

function bindToConsole (method, prompt) {
  return console[method].bind(console, prompt)
}

module.exports = function stdoutIn ($void) {
  var $ = $void.$
  var stringOf = $.string.of
  var isNativeHost = $void.isNativeHost

  function formatArgs () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      strings.push(stringOf(arguments[i]))
    }
    return strings.join(' ')
  }

  var write = function (text) {
    process.stdout.write(text)
    return text
  }

  function bindTo (method, type, color) {
    var log = isNativeHost
      ? bindToConsole(method, styles.gray('#' + type))
      : bindToConsole(method, '#')

    return isNativeHost ? function () {
      var text = formatArgs.apply(null, arguments)
      log(color ? color(text) : text)
      return text
    } : function () {
      log.apply(null, arguments)
      return formatArgs.apply(null, arguments)
    }
  }

  // default native output methods
  var stdout = Object.create(null)

  // by default, write logs to js console even in tracing mode (web browser).
  stdout.debug = bindTo('debug', 'D', styles && styles.blue)
  stdout.verbose = bindTo('info', 'V', styles && styles.gray)
  stdout.info = bindTo('info', 'I', styles && styles.gray)
  stdout.warn = bindTo('warn', 'W', styles && styles.yellow)
  stdout.error = bindTo('error', 'E', styles && styles.red)

  stdout.print = function print () {
    var text = formatArgs.apply(null, arguments)
    isNativeHost && console.log(text)
    return text
  }

  stdout.printf = function (value, format) {
    var text = formatArgs(value)
    if (isNativeHost) {
      write(style.apply(text, style.parse(format)))
    }
    return text
  }

  return stdout
}
