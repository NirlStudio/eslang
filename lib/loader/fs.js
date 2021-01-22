'use strict'

var fs = require('fs')
var path = require('path')

var PWD = process.env.PWD || process.cwd()

function notFound (source, dirs) {
  return ['404', 'Not Found', dirs ? [source, dirs] : [source]]
}

function fileUnavailable (file, err) {
  return ['503', 'File Unavailable', [file, err]]
}

function getTimestamp (file) {
  var stats = fs.statSync(file)
  return 'mtime:' + stats.mtimeMs.toString()
}

module.exports = function fsIn ($void) {
  var cache = require('./cache')($void)

  return {
    isResolved: function (file) {
      return path.isAbsolute(file)
    },
    // try to find the most recent matched & existing file.
    resolve: function (source, dirs) {
      if (path.isAbsolute(source)) {
        return fs.existsSync(source) ? source : notFound(source)
      }
      if (dirs.length <= 0) {
        dirs = [PWD]
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
    load: function (file) {
      try {
        var version = getTimestamp(file)
        var code = fs.readFileSync(file, 'utf8')
        return [code, version]
      } catch (err) {
        return [null, fileUnavailable(file, err)]
      }
    }
  }
}
