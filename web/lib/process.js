'use strict'

function safePathname (pathname) {
  var offset = pathname.indexOf('?')
  if (offset >= 0) {
    pathname = pathname.substring(0, offset)
  }
  return pathname || ''
}

function safeDirname (pathname) {
  var offset = pathname.lastIndexOf('/')
  return offset <= 0 ? ''
    : offset === (pathname.length - 1) ? pathname
      : pathname.substring(0, offset) || ''
}

function reload (print) {
  var counter = 3
  setInterval(function () {
    if (counter > 0) {
      print(counter--)
    } else {
      window.location.reload()
    }
  }, 500)
  return 'reloading ...'
}

module.exports = function ($void, environ, exit) {
  environ = Object.assign(Object.create(null), environ)

  var location = window.location
  environ['_'] = location.href

  var origin = location.origin || (location.protocol + '://' + location.host)
  environ['HOME'] = origin

  var pathname = safePathname(location.pathname)
  environ['PATH'] = origin + pathname
  environ['PWD'] = origin + safeDirname(pathname)

  return {
    env: function (name) {
      if (typeof name !== 'string') {
        return null
      }
      var value = environ[name]
      return typeof value === 'string' ? value : null
    },
    exit: function (code) {
      code = typeof code === 'number' ? code >> 0 : 1
      return typeof exit === 'function' ? exit(code) : reload(function (counter) {
        switch (counter) {
          case 1:
            return $void.$printf('.' + counter, 'red')
          case 2:
            return $void.$printf('..' + counter, 'yellow')
          default:
            return $void.$printf('...' + counter, 'blue')
        }
      })
    }
  }
}
