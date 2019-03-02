'use strict'

var fs = require('fs')
var path = require('path')

var proc = global.process

function notFound (source, dirs) {
  return ['404', 'Not Found', dirs ? [source, dirs] : [source]]
}

function fileUnavailable (file, err) {
  return ['503', 'File Unavailable', [file, err]]
}

function getTimestamp (file) {
  var stats = fs.statSync(file)
  return stats.mtimeMs.toString()
}

module.exports = function ($void) {
  var Promise$ = $void.Promise

  return {
    dir: function (file) {
      return path.dirname(file)
    },
    isResolved: function (file) {
      return path.isAbsolute(file)
    },
    // try to find the most recent matched & existing file.
    resolve: function (source, dirs) {
      if (path.isAbsolute(source)) {
        return fs.existsSync(source) ? source : notFound(source)
      }
      if (dirs.length < 1) {
        dirs = [proc.env.PWD]
      }
      for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i]
        var file = path.resolve(dir, source)
        if (fs.existsSync(file)) {
          return file
        }
      }
      return notFound(source, dirs)
    },
    read: function (file) {
      try {
        var mtime = getTimestamp(file)
        return [fs.readFileSync(file, 'utf8'), mtime]
      } catch (err) {
        return [null, fileUnavailable(file, err)]
      }
    },
    load: function (file) {
      return new Promise$(function (resolve, reject) {
        fs.readFile(file, 'utf8', function (err, code) {
          var mtime = null
          if (!err) {
            try {
              mtime = getTimestamp(file)
            } catch (e) {
              err = e
            }
          }
          mtime ? resolve([code, mtime]) : reject(fileUnavailable(file, err))
        })
      })
    }
  }
}
