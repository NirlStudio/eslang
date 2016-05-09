'use strict'

var fs = require('fs')
var path = require('path')

var BaseDir = path.join(__dirname, '..')

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

  load.resolve = function load$resolve (dirs, source) {
    // explicit path
    if (typeof dirs === 'string') {
      return path.resolve(dirs, source)
    } else if (!Array.isArray(dirs) || dirs.length < 1) {
      return path.resolve(source)
    }

    // default base dir.
    var base = dirs[0] ? path.resolve(dirs[0], source) : path.resolve(source)
    if (fs.existsSync(base)) {
      return base
    }
    // other base dirs.
    for (var i = 1; i < dirs.length; i++) {
      var file = dirs[i] ? path.resolve(dirs[i], source) : path.resolve(source)
      if (fs.existsSync(file)) {
        return file
      }
    }
    // try system dir.
    var sys = path.resolve(BaseDir, source)
    return fs.existsSync(sys) ? sys : base
  }

  load.dir = function load$dir (file) {
    return path.dirname(file)
  }

  return load
}
