'use strict'

var fs = require('fs')

var httpLoader = require('./http')

function fileUnavailable (file, err) {
  return ['503', 'File Unavailable', [file, err]]
}

function getTimestamp (file) {
  var stats = fs.statSync(file)
  return 'mtime:' + stats.mtimeMs.toString()
}

module.exports = function loaderIn ($void) {
  var http = httpLoader($void)

  return {
    cache: http.cache,

    isRemote: function (uri) {
      return http.isRemote(uri)
    },
    load: function (uri) {
      if (http.isRemote(uri)) {
        return http.load(uri)
      }
      try {
        var version = getTimestamp(uri)
        var code = fs.readFileSync(uri, 'utf8')
        return [code, version]
      } catch (err) {
        return [null, fileUnavailable(uri, err)]
      }
    },
    fetch: function (uri) {
      return http.fetch(uri)
    }
  }
}
