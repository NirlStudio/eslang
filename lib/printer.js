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
    args.splice(1, 0, '>')
    return args
  }

  // default native output methods
  return {
    print: function () {
      var text = formatArgs.apply(null, arguments)
      console.log(text) // keep orginal types in browser
      return text
    },
    warn: console.warn ? function () {
      var args = formatWarning.apply(null, arguments)
      var text = formatArgs.apply(null, args)
      console.warn(text) // keep orginal types in browser
      return text
    } : function () {
      var args = formatWarning.apply(null, arguments)
      args.unshift('[WARN]')
      var text = formatArgs.apply(null, args)
      console.log(text) // keep orginal types in browser
      return text
    }
  }
}
