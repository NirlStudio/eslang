'use strict'

var fileLoader = require('./fs')
var httpLoader = require('./http')

module.exports = function loaderIn ($void) {
  var fs = fileLoader($void)
  var http = httpLoader($void)

  return {
    cache: http.cache,

    isUrl: function (uri) {
      return http.isUrl(uri)
    },
    resolve: function (path, dirs) {
      return http.isUrl(path) || fs.isResolved(path) ? path
        : dirs && dirs.length > 0 && http.isUrl(dirs[0])
          ? http.resolve(path, dirs)
          : fs.resolve(path, dirs)
    },
    load: function (uri) {
      return http.isUrl(uri) ? http.load(uri) : fs.load(uri)
    },
    fetch: function (uri) {
      return http.fetch(uri)
    }
  }
}
