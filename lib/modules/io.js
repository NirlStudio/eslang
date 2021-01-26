'use strict'

var fs = require('fs')
var path = require('path')

module.exports = function $io ($void) {
  var warn = $void.$warn
  var thisCall = $void.thisCall
  var stringOf = $void.$.string.of

  var $io = Object.create(null)

  function formatUserHome (file) {
    return file === '~' ? $void.$env('user-home')
      : !file.startsWith('~/') ? file
        : path.join($void.$env('user-home'), file.substring(1))
  }

  function formatPaths (paths) {
    var parts = []
    for (var i = 0, len = paths.length; i < len; i++) {
      var part = paths[i]
      if (typeof part !== 'string') {
        part = thisCall(part, 'to-string')
      }
      part && parts.push(paths[i])
    }
    parts[0] = formatUserHome(parts[0])
    return parts
  }

  function resolve (method, filepath) {
    var parts = formatPaths(Array.isArray(filepath) ? filepath : [filepath])
    if (parts.length > 0) {
      return path.resolve.apply(path, parts)
    }
    warn('io:' + method, 'argument filepath is invalid.', filepath)
    return null
  }

  function unify (method, encoding) {
    if (!encoding || typeof encoding === 'string') {
      return encoding || 'utf-8'
    }
    warn('io:' + method, 'argument encoding is not a string:',
      typeof encoding, encoding)
    return null
  }

  function prepare (method, file) {
    var resolved = resolve(method, file)
    if (!resolved) {
      return null
    }
    try {
      var dir = path.dirname(resolved)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }) // NodeJS >= 10.12.0
      }
      return resolved
    } catch (err) {
      warn('io:' + method,
        'error occurred in preparing:', err.code || err.message,
        '\n', [file, resolved, dir, err])
      return null
    }
  }

  $io.read = function read (file, encoding) {
    var resolved = resolve('read', file)
    var unified = unify('read', encoding)
    try {
      return resolved && unified && fs.readFileSync(resolved, unified)
    } catch (err) {
      warn('io:read', 'error occurred in reading:', err.code || err.message,
        '\n', [file, encoding, resolved, unified, err])
      return null
    }
  }

  $io.write = function write (file, value, encoding) {
    var resolved = prepare('write', file)
    var unified = unify('write', encoding)
    if (!resolved || !unified) {
      return null
    }
    var text = typeof value === 'undefined' ? stringOf() : stringOf(value)
    try {
      fs.writeFileSync(resolved, text, unified)
      return text
    } catch (err) {
      warn('io:write', 'error occurred in writing:', err.code || err.message,
        '\n', [file, value, encoding, resolved, text, unified, err])
      return null
    }
  }

  $io['to-read'] = function read_ (file, encoding) {
    var resolved = resolve('to-read', file)
    var unified = unify('to-read', encoding)
    if (!resolved || !unified) {
      return Promise.reject(warn())
    }
    return new Promise(function (resolve, reject) {
      fs.readFile(resolved, unified, function (err, text) {
        !err ? resolve(text) : reject(warn('io:to-read',
          'error occurred in reading:', err.code || err.message,
          '\n', [file, encoding, resolved, unified, err]
        ))
      })
    })
  }

  $io['to-write'] = function write_ (file, value, encoding) {
    var resolved = prepare('to-write', file)
    var unified = unify('to-write', encoding)
    if (!resolved || !unified) {
      return Promise.reject(warn())
    }
    var text = typeof value === 'undefined' ? stringOf() : stringOf(value)
    return new Promise(function (resolve, reject) {
      fs.writeFile(resolved, text, unified, function (err) {
        !err ? resolve(text) : reject(warn('io:to-write',
          'error occurred in writing:', err.code || err.message,
          '\n', [file, value, encoding, resolved, text, unified, err]
        ))
      })
    })
  }

  return $io
}
