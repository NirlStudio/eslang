'use strict'

var httpLoader = require('./loader-http')

function localLoader ($, http) {
  var fileLoader = require('./loader-fs')
  var fs = fileLoader($)

  return {
    dir: fs.dir,
    isResolved: function (uri) {
      return fs.isResolved(uri) || http.isResolved(uri)
    },
    resolve: function (path, dirs) {
      return http.isResolved(path) || fs.isResolved(path) ? path
        : dirs && dirs.length > 0 && http.isResolved(dirs[0])
          ? http.resolve(path, dirs)
          : fs.resolve(path, dirs)
    },
    read: function (uri) {
      return http.isResolved(uri) ? http.read(uri) : fs.read(uri)
    },
    load: function (uri) {
      return http.isResolved(uri) ? http.load(uri) : fs.load(uri)
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var http = httpLoader($)
  return typeof window === 'undefined' ? localLoader($, http) : http
}
