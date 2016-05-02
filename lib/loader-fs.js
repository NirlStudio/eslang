'use strict'

var BaseDir = __dirname + '/..'

var fs = require('fs')
var path = require('path')

module.exports = function ($) {
  var warn = $.print.warn

  function notFound (source) {
    warn({
      from: '$/lib/loader-fs',
      message: 'File not found: ' + source
    })
    return '()'
  }

  function failedInReading (source, err) {
    warn({
      from: '$/lib/loader-fs',
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

  function load (file, cb) {
    return typeof cb === 'function' ? loadFile(file, cb) : loadFileSync(file)
  }

  load.resolve = function (dir, source) {
    if (typeof source !== 'string') {
      warn({
        from: '$/lib/loader-fs',
        message: '"source" should be a string: ' + typeof file
      })
      return null
    }

    var base = dir ? path.resolve(dir, source) : path.resolve(source)
    if (fs.existsSync(base)) {
      return base
    }

    var sys = path.resolve(BaseDir, source)
    return fs.existsSync(sys) ? sys : base
  }

  load.dir = function (file) {
    return path.dirname(file)
  }

  return load
}
