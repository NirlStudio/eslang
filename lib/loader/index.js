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
    load: function (uri) {
      return http.isUrl(uri) ? http.load(uri) : fs.load(uri)
    },
    fetch: function (uri) {
      return http.fetch(uri)
    }
  }
}
