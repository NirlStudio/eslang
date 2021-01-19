'use strict'

function parseOffset (str, length) {
  var value
  try {
    value = parseInt(str)
  } catch (e) {
    return e
  }
  if (value < 0) {
    value += length
    if (value < 0) {
      value = length
    }
  } else if (value >= length) {
    value = length
  }
  return value
}

function formatValue (cache, offset, rawValue, fmt, thisCall) {
  if (offset >= cache.length) {
    return '...'
  }
  var value = cache[offset]
  var map
  if (value) {
    if (typeof fmt !== 'string' || typeof rawValue === 'string') {
      return value[0] !== null ? value[0] : (
        value[0] = typeof rawValue === 'string' ? rawValue
          : thisCall(rawValue, 'to-string')
      )
    }
    map = value[1] || (value[1] = Object.create(null))
    return (map[fmt] || (map[fmt] = thisCall(rawValue, 'to-string', fmt)))
  }
  value = cache[offset] = [null, null]
  if (typeof fmt !== 'string' || typeof rawValue === 'string') {
    return (value[0] = typeof rawValue === 'string' ? rawValue
      : thisCall(rawValue, 'to-string'))
  }
  map = value[1] = Object.create(null)
  return (map[fmt] = thisCall(rawValue, 'to-string', fmt))
}

module.exports = function formatIn ($void) {
  var $ = $void.$
  var warn = $void.$warn
  var link = $void.link
  var thisCall = $void.thisCall

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
      (error && error.message) || 'unknown error.', '\n', source)
    return source.substring(1, source.length - 1)
  }, true)

  link($.string, 'format', function (pattern) {
    if (typeof pattern !== 'string') {
      warn('string:format', 'the pattern must be a string.', pattern)
      return null
    }
    var args = []
    if (arguments.length > 1) {
      args[arguments.length - 2] = undefined
    }
    var values = []
    var i = 0
    var counter = 0
    var c, end, placeholder, offset, fmt
    while (i < pattern.length) {
      c = pattern[i++]
      if (c !== '{') {
        values.push(c); continue
      }
      if (pattern[i] === '{') {
        values.push('{'); i++; continue
      }
      end = pattern.indexOf('}', i)
      if (end < i) {
        end = pattern.length
        warn('string:format', 'missing an ending "}".', pattern, i)
      }
      placeholder = pattern.substring(i, end)
      i = end + 1
      end = placeholder.indexOf(':')
      if (end < 0) {
        end = placeholder.length
      }
      offset = placeholder.substring(0, end)
      if (offset) {
        offset = parseOffset(offset, args.length)
      } else if (counter >= args.length) {
        // replace missing implicit placeholder to empty.
        counter++; continue
      } else {
        offset = counter
      }
      if (typeof offset !== 'number') {
        warn('string:format', 'invalid offset value gets ignored',
          pattern, i, placeholder.substring(0, end))
        offset = counter
      } else if (offset >= args.length) {
        warn('string:format', 'offset value is out of range',
          pattern, offset, args.length - 1)
      }
      fmt = end < placeholder.length ? placeholder.substring(end + 1) : null
      values.push(formatValue(args, offset, arguments[offset + 1], fmt, thisCall))
      counter++
    }
    return values.join('')
  }, true)

  $void.formatPattern = function (pattern) {
    if (pattern.indexOf('$') < 0) {
      return [pattern]
    }
    var expr = ''
    var format = []
    var escaping = ''
    var depth = 0
    var args = []
    var pushExpr = function (ending) {
      format.push('{' + args.length + '}')
      args.push(ending ? expr + ending : expr)
      expr = ''; escaping = ''; depth = 0
    }
    var endExpr = function (ending) {
      switch (escaping) {
        case '$':
          if (expr.length > 0) {
            pushExpr()
          } else {
            format.push('$'); escaping = ''
          }
          break
        case ' ':
          pushExpr()
          break
        case '(':
          pushExpr(ending)
          ending !== ')' && warn(
            'format:pattern', 'missing ending parenthesis.', expr
          )
          break
        default:
          break
      }
    }
    for (var i = 0; i < pattern.length; i++) {
      var c = pattern[i]
      switch (escaping) {
        case '$':
          switch (c) {
            case '$':
              format.push('$'); escaping = ''
              break
            case '(':
              if (expr.length > 0) {
                endExpr(); format.push('(')
              } else {
                expr += '('; escaping = '('; depth = 1
              }
              break
            default:
              if (/\)|\s/.test(c)) {
                endExpr(); format.push(c)
              } else {
                expr += c; escaping = ' '
              }
              break
          }
          break
        case ' ':
          if (c === '$') {
            endExpr(); escaping = '$'
          } else if (/\(|\)|\s/.test(c)) {
            endExpr(); format.push(c)
          } else {
            expr += c
          }
          break
        case '(':
          if (c === ')') {
            if (--depth > 0) {
              expr += c
            } else {
              endExpr(')')
            }
          } else {
            if (c === '(') {
              depth += 1
            }
            expr += c
          }
          break
        default:
          c === '$' ? escaping = '$' : format.push(c)
          break
      }
    }
    endExpr()
    return [format.join('')].concat(args)
  }
}
