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
    }
  }
}
