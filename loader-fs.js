'use strict'

var fs = require('fs')
var path = require('path')

module.exports = function ($) {
  var warn = $.print.warn

  function notFound (source) {
    warn({
      from: '$/loader-fs',
      message: 'File not found: ' + source
    })
    return '()'
  }

  function failedInReading (source, err) {
    warn({
      from: '$/loader-fs',
      message: 'Failed to read file: ' + source,
      inner: err.toString()
    })
    return '()'
  }

  function loadFile (source, cb) {
    fs.exists(source, function (exists) {
      if (!exists) {
        return cb(notFound(source))
      }

      fs.readFile(source, 'utf8', function (err, code) {
        if (err) {
          return cb(failedInReading(source, err))
        } else {
          return cb(code)
        }
      })
    })
  }

  function loadFileSync (source) {
    if (!fs.existsSync(source)) {
      return notFound(source)
    }
    try {
      return fs.readFileSync(source, 'utf8')
    } catch (err) {
      return failedInReading(source, err)
    }
  }

  function load (source, cb) {
    if (typeof source !== 'string') {
      warn({
        from: '$/loader-fs',
        message: '"source" should be a string: ' + typeof source
      })
      return typeof cb === 'function' ? cb(null) : null
    }
    source = path.resolve(source) // to absolute path.
    return typeof cb === 'function' ? loadFile(source, cb) : loadFileSync(source)
  }

  load.normalize = function (source) {
    return 'file://' + (source ? path.resolve(source) : '') // to FQDN
  }

  return load
}
