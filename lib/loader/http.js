'use strict'

var axios = require('axios')

function allowNotModified (status) {
  return (status >= 200 && status < 300) || status === 304
}

function notCached (url, dirs) {
  return [404, 'Not Cached', dirs ? [url, dirs] : [url]]
}

function responseError (url, response) {
  return [response.status, response.statusText, [url]]
}

function responseUnavailable (url, error) {
  return [503, 'Response Unavailable', [url, error]]
}

module.exports = function httpIn ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var promiseOfResolved = $Promise['of-resolved']

  var loader = Object.create(null)
  var cache = loader.cache = require('./cache')($void)

  var proxy = axios.create({
    timeout: 30000,
    transformResponse: undefined,
    responseType: 'text',
    keepAlive: 'timeout=10, max=1000'
  })

  function generateConfig (version) {
    return !version || cache.isTimestamp(version) ? null : {
      validateStatus: allowNotModified,
      headers: {
        'If-None-Match': version
      }
    }
  }

  loader.isRemote = function isRemote (url) {
    return /^(http[s]?:\/\/)/i.test(url)
  }

  loader.load = function load (url) {
    var data = cache.get(url)
    return data ? [data, cache.ver(url)] : [null, notCached(url)]
  }

  loader.fetch = function fetch (url) {
    var version = cache.ver(url)
    return !cache.isExpired(version) ? promiseOfResolved(url)
      : $Promise.of(function (async) {
        proxy.get(url,
          generateConfig(version)
        ).then(function (response) {
          if (response.status !== 304) {
            cache.set(url, response.data, response.headers['etag'])
          }
          async.resolve(url)
        }).catch(function (error) {
          async.reject(error.response
            ? responseError(url, error.response)
            : responseUnavailable(url, error)
          )
        })
      })
  }

  return loader
}
