'use strict'

// TODO: the dependency on axios can be replaced to reduce dependencies.
var axios = require('axios')
var cache = require('./loader-http-cache')

function isResolved (url) {
  return /^(http[s]?:\/\/)/i.test(url)
}

function join (base, path) {
  return base.charAt(base.length - 1) === '/' || path.charAt(0) === '/'
    ? base + path : base + '/' + path
}

function getHostUrl (moduleUri) {
  var offset = moduleUri ? moduleUri.indexOf('://') : 0
  return offset > 0
    ? moduleUri.substring(0, moduleUri.indexOf('/', offset + 3))
    : typeof window === 'undefined' ? 'http://localhost'
      : window.location.origin
}

function getBaseUrl (moduleUri) {
  var offset = moduleUri ? moduleUri.indexOf('://') : 0
  return offset > 0
    ? moduleUri.substring(0, moduleUri.lastIndexOf('/'))
    : typeof window === 'undefined' ? 'http://localhost'
      : window.location.origin + window.location.pathname
}

function allowNotModified (status) {
  return (status >= 200 && status < 300) || status === 304
}

function generateConfig (version) {
  return !version || cache.isTimestamp(version) ? {
    responseType: 'text'
  } : {
    responseType: 'text',
    validateStatus: allowNotModified,
    headers: {
      'If-None-Match': version
    }
  }
}

function notCached (url) {
  return [404, 'Not Cached', [url]]
}

function responseError (url, response) {
  return [response.status, response.statusText, [url]]
}

function responseUnavailable (url, error) {
  return [503, 'Response Unavailable', [url, error]]
}

module.exports = function ($void) {
  var Promise$ = $void.Promise

  return {
    dir: function (url) {
      var offset = url.lastIndexOf('/')
      return offset === 0 ? '/'
        : offset > 0 ? url.substring(0, offset) : ''
    },
    isResolved: isResolved,
    resolve: function (source, dirs) {
      return isResolved(source) ? source
        : join(source.startsWith('/')
          ? getHostUrl(dirs && dirs[0]) : getBaseUrl(dirs && dirs[0]), source)
    },
    read: function (url) {
      var data = cache.get(url)
      return data ? [data, cache.ver(url)] : [null, notCached(url)]
    },
    load: function (url) {
      return new Promise$(function (resolve, reject) {
        axios.get(url,
          generateConfig(cache.ver(url))
        ).then(function (response) {
          if (response.status === 304) {
            resolve([cache.get(url), cache.ver(url)])
          } else {
            resolve([response.data,
              cache.set(url, response.data, response.headers['ETag'])
            ])
          }
        }).catch(function (error) {
          reject(error.response
            ? responseError(url, error.response)
            : responseUnavailable(url, error)
          )
        })
      })
    }
  }
}
