'use strict'

module.exports = function ($void, JS, printer) {
  var $ = $void.$
  // var warn = $.warn
  var link = $void.link

  link($.string, 'format', function (pattern, args) {
    if (typeof pattern !== 'string') {
      return null
    }
    // TODO
    return pattern + args
  }, true)

  $void.formatPattern = function (pattern) {
    if (pattern.indexOf('$') < 0) {
      return null
    }
    // TODO
    return [pattern, '(x + y)']
  }
}
