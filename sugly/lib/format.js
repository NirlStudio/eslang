'use strict'

module.exports = function ($void, JS, printer) {
  var $ = $void.$
  var warn = $.warn
  var link = $void.link

  link($.string, 'unescape', function (source) {
    if (typeof source !== 'string') {
      warn('string:unescape', 'a string source should be a string.',
        '\n', source)
      return null
    }
    if (!source.startsWith('"')) {
      warn('string:unescape', 'a string source should start with a \'"\'.',
        '\n', source)
      return source
    }
    if (!source.endsWith('"')) {
      warn('string:unescape', 'a string source should end with a \'"\'.',
        '\n', source)
      return source
    }
    var value, error
    try {
      // TODO: to be replaced a to native unescape processor.
      value = JSON.parse(source)
    } catch (err) {
      error = err
    }
    if (typeof value === 'string') {
      return value
    }
    warn('string:unescape', '[JSON] invalid string input: ',
      (error && error.message) || 'unknow error.', '\n', source)
    return source.substring(1, source.length - 1)
  }, true)

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
