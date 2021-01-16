'use strict'

var axios = require('axios')
var cache = require('./loader-cache')(true)

function isResolved (url) {
  return /^(http[s]?:\/\/)/i.test(url)
}

function join (base, path) {
  while (base.charAt(base.length - 1) === '/') {
    base = base.substring(0, base.length - 1)
  }
  while (path.charAt(0) === '/') {
    base = base.substring(1)
  }
  var origin = base.indexOf('://');
  (origin > 0) && (origin += 3)
  while (path.startsWith('./') || path.startsWith('../')) {
    if (path.charAt(1) === '/') {
      path = path.substring(2) // skipping leading ./
    } else {
      path = path.substring(3)
      var offset = base.lastIndexOf('/')
      while (base.charAt(offset - 1) === '/') {
        offset--
      }
      if (offset > origin) {
        base = base.substring(0, offset)
      }
    }
  }
  return base + '/' + path
}

function getHostUrl (moduleUri) {
  var offset = moduleUri ? moduleUri.indexOf('://') : 0
  return offset > 0
    ? moduleUri.substring(0, moduleUri.indexOf('/', offset + 3))
    : typeof window === 'undefined' ? 'http://localhost'
      : window.location.origin
}

function getBaseUrl (moduleUri) {
  return moduleUri && moduleUri.indexOf('://') > 0 ? moduleUri
    : typeof window === 'undefined' ? 'http://localhost'
      : window.location.origin + window.location.pathname
}

function allowNotModified (status) {
  return (status >= 200 && status < 300) || status === 304
}

function generateConfig (version) {
  return !version || cache.isTimestamp(version) ? null : {
    validateStatus: allowNotModified,
    headers: {
      'If-None-Match': version
    }
  }
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

module.exports = function ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var promiseOfResolved = $Promise['of-resolved']

  var proxy = axios.create({
    timeout: 30000,
    transformResponse: undefined,
    responseType: 'text',
    keepAlive: 'timeout=10, max=1000'
  })

  return {
    cache: cache, // for management purpose only.

    dir: function (url) {
      var offset = url.lastIndexOf('/')
      return offset === 0 ? '/'
        : offset > 0 ? url.substring(0, offset) : ''
    },
    isResolved: isResolved,
    resolve: function (source, dirs) {
      if (isResolved(source)) {
        return source
      }
      if (dirs.length <= 0) {
        dirs = [source.startsWith('/') ? getHostUrl() : getBaseUrl()]
      }
      if (dirs.length === 1) {
        return join(dirs[0], source)
      }
      for (var i = 0; i < dirs.length; i++) {
        var url = join(dirs[i], source)
        if (cache.ver(url)) {
          return url
        }
      }
      return notCached(source, dirs)
    },
    load: function (url) {
      var data = cache.get(url)
      return data ? [data, cache.ver(url)] : [null, notCached(url)]
    },
    fetch: function (url) {
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
  }
}
