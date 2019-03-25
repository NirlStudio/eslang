'use strict'

var fs = require('fs')
var path = require('path')
var cache = require('./loader-cache')()

var proc = global.process
var PWD = proc.env.PWD || proc.cwd()

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

module.exports = function ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var promiseOfResolved = $Promise['of-resolved']

  return {
    cache: cache, // for mgmt. purpose only.

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
        if (cache.ver(file) === version) {
          return [cache.get(file), version]
        }
        var code = fs.readFileSync(file, 'utf8')
        cache.set(file, code, version)
        return [code, version]
      } catch (err) {
        return [null, fileUnavailable(file, err)]
      }
    },
    fetch: function (file) {
      return cache.ver(file) ? promiseOfResolved(file)
        : $Promise.of(function (async) {
          fs.readFile(file, 'utf8', function (err, code) {
            var version = null
            if (!err) {
              try {
                version = getTimestamp(file)
              } catch (e) {
                err = e
              }
            }
            if (version) {
              cache.set(file, code, version)
              async.resolve(file)
            } else {
              async.reject(fileUnavailable(file, err))
            }
          })
        })
    }
  }
}
