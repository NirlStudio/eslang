'use strict'

var delimiter = ':'
var separator = '/'

module.exports = function pathIn ($void) {
  var warn = $void.$warn

  function dir (path) {
    if (typeof path === 'undefined') {
      return '.'
    }

    if (typeof path !== 'string') {
      warn('path:dir', 'a path should be a string.', [path, typeof path])
      return null
    }

    var offset = path.length
    while (path[offset - 1] === separator) {
      offset--
    }
    if (offset < path.length) {
      path = path.substring(0, offset)
    }

    offset = path.lastIndexOf(separator)
    switch (offset) {
      case -1:
        return '.'
      case 0:
        return separator
      default:
        return path.substring(0, offset)
    }
  }

  function isResolved (path) {
    if (typeof path === 'string') {
      return path.startsWith('/')
    }
    warn('path:is-resolved', 'a path should be a string.', [path, typeof path])
    return null
  }

  function joinOf (method) {
    var warn_ = warn.bind($void, 'path:' + method)

    return function join (base) {
      if (arguments.length < 1) {
        return '.'
      }

      var parts = []
      var i = 0
      for (; i < arguments.length; i++) {
        var path = arguments[i]
        if (typeof path !== 'string') {
          warn_('a path should be a string', [
            path, typeof path, i, Array.prototype.slice.call(arguments)
          ])
          return null
        }
        if (path) { // ignore empty argument.
          Array.prototype.push.apply(parts, path.split(separator))
        }
      }

      for (i = 1; i < parts.length; i++) {
        if (parts[i] === '') parts[i] = '.' // '/' works like '/./.'
      }

      for (i = 0; i < parts.length;) {
        var part = parts[i]
        switch (part) {
          case '.':
            parts.splice(i, 1)
            break

          case '..':
            if (i < 1) {
              i++ // a leading '..' is always reserved.
            } else {
              switch (parts[i - 1]) {
                case '': parts.splice(i, 1); break
                case '..': i++; break
                default: parts.splice(--i, 2)
              }
            }
            break

          default:
            i++
        }
      }

      return parts.length === 1 && parts[0] === '' ? '/'
        : parts.join(separator) || '.'
    }
  }

  var resolving = joinOf('resolve')
  function resolve (appHome, userHome, base) {
    try {
      var args = Array.prototype.slice.call(arguments, 2)
      if (typeof base === 'undefined' || base === null) {
        base = args[0] = ''
      }

      if (isResolved(base)) {
        return resolving.apply(null, args)
      }

      if (base === '~' || base.startsWith('~/')) {
        args[0] = base.substring(1)
        args.unshift(userHome)
        return resolving.apply(null, args)
      }

      args.unshift(appHome)
      return resolving.apply(null, args)
    } catch (err) {
      warn('path:resolve', err.message, [
        appHome, userHome, Array.prototype.slice.call(arguments, 1), err
      ])
      return null
    }
  }

  function split (paths) {
    if (typeof paths === 'string') {
      return paths.split(delimiter)
    }
    warn('path:split', 'the paths argument should be a string.', [
      paths, typeof paths
    ])
    return null
  }

  function separate (path) {
    if (typeof path === 'string') {
      return path.split(separator)
    }
    warn('path:separate', 'a path should be a string.', [path, typeof path])
    return null
  }

  function $export (scope, space) {
    scope.export('delimiter', delimiter)
    scope.export('separator', separator)

    scope.export('dir', dir.bind(scope.context))
    scope.export('is-resolved', isResolved.bind(scope.context))
    scope.export('join', joinOf('join').bind(scope.context))
    scope.export('resolve', resolve.bind(scope.context,
      space.app['-app-home'],
      $void.$env('user-home')
    ))

    scope.export('split', split.bind(scope.context))
    scope.export('separate', separate.bind(scope.context))
  }
  // expose for global usages.
  $export.delimiter = delimiter
  $export.separator = separator

  $export.dir = dir
  $export.isResolved = isResolved
  $export.join = joinOf('$join')
  $export.resolve = resolve

  $export.split = split
  $export.separate = separate

  return $export
}
