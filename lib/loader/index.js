'use strict'

var fileLoader = require('./fs')
var httpLoader = require('./http')

module.exports = function ($void) {
  var fs = fileLoader($void)
  var http = httpLoader($void)

  return {
    cache: http.cache,
    fsCache: fs.cache,

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
    load: function (uri) {
      return http.isResolved(uri) ? http.load(uri) : fs.load(uri)
    },
    fetch: function (uri) {
      return http.isResolved(uri) ? http.fetch(uri) : fs.fetch(uri)
    }
  }
}