'use strict'

var render, isIE
if (typeof window === 'undefined') {
  render = require('colors/safe')
  isIE = false
} else {
  render = null
  isIE = /MSIE \d|Trident.*rv:/.test(navigator.userAgent)
}

var styleClasses = Object.assign(Object.create(null), {
  red: 'color',
  green: 'color',
  blue: 'color',
  yellow: 'color',
  grey: 'color',
  gray: 'color',
  underline: 'text-decoration'
})

function formatterOf (props) {
  return render ? function format (text) {
    for (var key in props) {
      var value = props[key]
      text = render[value](text)
    }
    return text
  } : null
}

function applyClass (cls) {
  var values = cls.split(/\s/)
  var props = {}
  var enabled = false
  for (var i = 0; i < values.length; i++) {
    var value = values[i]
    if (styleClasses[value]) {
      enabled = true
      props[styleClasses[value]] = value
    }
  }
  return enabled && formatterOf(props)
}

function applyStyle (obj) {
  var props = {}
  var enabled = false
  for (var key in obj) {
    var value = obj[key]
    if (styleClasses[value] === key) {
      enabled = true
      props[key] = value
    }
  }
  return enabled && formatterOf(props)
}

var bindToConsole = isIE ? function (method, prompt) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(prompt)
    console[method].apply(console, args)
  }
} : function (method, prompt) {
  return console[method].bind(console, prompt)
}

module.exports = function ($void, tracing) {
  var $ = $void.$
  var stringOf = $.string.of

  const write = tracing || typeof window !== 'undefined' ? null
    : function (text) {
      process.stdout.write(text)
      return text
    }

  function formatArgs () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      strings.push(stringOf(arguments[i]))
    }
    return strings.join(' ')
  }

  function bindTo (method, type, color) {
    var log = !console[method]
      ? bindToConsole('log', '#' + type)
      : $void.isNativeHost
        ? bindToConsole(method, render.gray('#' + type))
        : bindToConsole(method, '#')

    return $void.isNativeHost ? function () {
      var text = formatArgs.apply(null, arguments)
      log(color ? color(text) : text)
      return text
    } : function () {
      log.apply(null, arguments)
      return formatArgs.apply(null, arguments)
    }
  }

  // default native output methods
  return {
    print: function () {
      var text = formatArgs.apply(null, arguments)
      !tracing && console.log(text)
      return text
    },
    printf: function (value, format) {
      var text = formatArgs(value)
      if (write) {
        var formatted = null
        if (format && render) {
          var formatter = typeof format === 'string' ? applyClass(format)
            : typeof format === 'object' ? applyStyle(format) : null
          formatted = formatter ? formatter(text) : text
        }
        write(formatted || text)
      }
      return text
    },
    // by default, write logs to js console even in tracing mode (web browser).
    verbose: bindTo('info', 'V', render && render.gray),
    info: bindTo('info', 'I', render && render.gray),
    warn: bindTo('warn', 'W', render && render.yellow),
    error: bindTo('error', 'E', render && render.red),
    debug: bindTo('debug', 'D', render && render.blue)
  }
}
