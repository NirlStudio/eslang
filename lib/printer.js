'use strict'

module.exports = function ($) {
  var stringOf = $.string.of

  function formatArgs () {
    var strings = []
    for (var i = 0; i < arguments.length; i++) {
      strings.push(stringOf(arguments[i]))
    }
    return strings.join(' ')
  }

  function formatWarning () {
    var args = Array.prototype.slice.call(arguments)
    args.splice(2, 0, '>')
    return args
  }

  // default native output methods
  return {
    print: function () {
      var text = formatArgs.apply(null, arguments)
      console.log(text)
      return text
    },
    log: function () {
      var args = formatWarning.apply(null, arguments)
      args.unshift('[LOG]')
      typeof window === 'undefined'
        ? console.log(formatArgs.apply(null, args))
        : console.log.apply(console, args)
    },
    warn: console.warn ? function () {
      var args = formatWarning.apply(null, arguments)
      typeof window === 'undefined'
        ? console.warn(formatArgs.apply(null, args))
        : console.warn.apply(console, args)
    } : function () {
      var args = formatWarning.apply(null, arguments)
      args.unshift('[WARN]')
      typeof window === 'undefined'
        ? console.log(formatArgs.apply(null, args))
        : console.log.apply(console, args)
    },
    debug: console.debug
      ? typeof window !== 'undefined'
        ? function () {
          console.debug.apply(console, arguments)
        } : function () {
          console.debug(formatArgs.apply(null, arguments))
        }
      : function () {
        var args = Array.prototype.slice.call(arguments)
        args.unshift('[DEBUG]')
        typeof window === 'undefined'
          ? console.log(formatArgs.apply(null, args))
          : console.log.apply(console, args)
      }
  }
}
