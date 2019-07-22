'use strict'

var fs = require('fs')
var path = require('path')

module.exports = function ($void) {
  var warn = $void.$warn
  var stringOf = $void.$.string.of

  var $io = $void.$io = {}

  function checkArguments (method, file, encoding) {
    if (!file || typeof file !== 'string') {
      warn('io:' + method, 'argument file(path) is not a string.',
        [file, encoding])
      return false
    }
    if (encoding && typeof file !== 'string') {
      warn('io:' + method, 'argument encoding is not a string.',
        [file, encoding])
      return false
    }
    return true
  }

  function resolve (file) {
    return file === '~' ? $void.env('user-home')
      : file.startsWith('~/')
        ? path.join($void.env('user-home'), file.substring(1))
        : path.resolve(file)
  }

  $io.read = function read (file, encoding) {
    if (!checkArguments('read', file, encoding)) {
      return null
    }
    try {
      var fullPath = resolve(file)
      return fs.readFileSync(fullPath, encoding || 'utf-8')
    } catch (err) {
      warn('io:read', 'error occurred in reading for ' + err.message,
        [file, encoding, fullPath, err])
      return null
    }
  }

  function prepareFor (method, file, value, encoding) {
    if (!checkArguments(method, file, encoding)) {
      return null
    }
    try {
      var fullPath = resolve(file)
      var dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true }) // NodeJS >= 10.12.0
      }
      return fullPath
    } catch (err) {
      warn('io:' + method,
        'error occurred in preparation for' + err.message,
        [file, value, encoding, err]
      )
      return null
    }
  }

  $io.write = function write (file, value, encoding) {
    var fullPath = prepareFor('write', file, value, encoding)
    if (!fullPath) {
      return null
    }
    var text = typeof value === 'undefined' ? stringOf() : stringOf(value)
    try {
      fs.writeFileSync(fullPath, text, encoding || 'utf-8')
      return text
    } catch (err) {
      warn('io:write', 'error occurred in writing for ' + err.message,
        [file, value, encoding, fullPath, text, err])
      return null
    }
  }

  $io['to-read'] = function read_ (file, encoding) {
    if (!checkArguments('to-read', file, encoding)) {
      return Promise.reject(warn())
    }
    var fullPath = resolve(file)
    return new Promise(function (resolve, reject) {
      fs.readFile(fullPath, encoding || 'utf-8', function (err, text) {
        err ? reject(warn('io:to-read',
          'error occurred in reading for ' + err.message,
          [file, encoding, fullPath, err]
        )) : resolve(text)
      })
    })
  }

  $io['to-write'] = function write_ (file, value, encoding) {
    var fullPath = prepareFor('to-write', file, value, encoding)
    if (!fullPath) {
      return Promise.reject(warn())
    }
    var text = typeof value === 'undefined' ? stringOf() : stringOf(value)
    return new Promise(function (resolve, reject) {
      fs.writeFile(fullPath, text, encoding || 'utf-8', function (err) {
        err ? reject(warn('io:to-write',
          'error occurred in writing for ' + err.message,
          [file, value, encoding, fullPath, text, err]
        )) : resolve(text)
      })
    })
  }
}
