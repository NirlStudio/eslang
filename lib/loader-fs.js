'use strict'

var fs = require('fs')
var path = require('path')

module.exports = function createLoader () {
  return {
    dir: function (file) {
      return path.dirname(file)
    },
    join: function () {
      // always use path.resolve to unify the path or uri.
      return path.resolve.apply(path, arguments)
    },
    isAbsolute: function (file) {
      return path.isAbsolute(file)
    },
    // try to find the most recent matched & existing file.
    resolve: function (source, dirs) {
      if (path.isAbsolute(source)) {
        return fs.existsSync(source) ? source : notFound(source)
      }
      if (dirs.length < 1) {
        return missingDirectory(source)
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
    read: function (file, cb) {
      return cb ? readFile(file, cb) : readFileSync(file)
    }
  }
}

// make errors as array.
function missingDirectory (source) {
  return ['400', 'missing directory', [source]]
}

function notFound (source, dirs) {
  return ['404', 'file not found', dirs ? [source, dirs] : [source]]
}

function failedInReading (file, err) {
  return ['500', 'failed in reading', [file, err]]
}

function readFile (file, cb) {
  fs.readFile(file, 'utf8', function (err, code) {
    if (err) {
      cb(failedInReading(file, err))
    } else {
      cb(code)
    }
  })
}

function readFileSync (file) {
  try {
    return fs.readFileSync(file, 'utf8')
  } catch (err) {
    return failedInReading(file, err)
  }
}
