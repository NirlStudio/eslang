'use strict'

var Delimiter = ':'
var Separator = '/'

var RegexUrl = /^(\w+:\/\/)/i

function invalidType (arg, value, type) {
  var err = new TypeError(
    'The "' + arg + '" argument must be of type ' + (type || 'string') +
    '. Received ' + (typeof value)
  )
  err.code = 'ERR_INVALID_ARG_TYPE'
  return err
}

function parseUrl (path) {
  try {
    return new URL(path)
  } catch (err) {
    return null
  }
}

module.exports = function pathIn ($void) {
  var BaseUrl = $void.$env('home')

  var $path = {} // use the same type as it's in nodejs.
  $path.delimiter = Delimiter
  $path.sep = Separator

  $path.basename = function basename (path, ext) {
    if (typeof path !== 'string') {
      throw invalidType('path', path)
    }
    if (typeof ext !== 'string' && typeof ext !== 'undefined') {
      throw invalidType('ext', ext)
    }

    if (RegexUrl.test(path)) {
      var url = parseUrl(path)
      if (!url) return ''
      path = new URL(path).pathname
    }

    var offset = path.lastIndexOf(Separator)
    if (offset >= 0) {
      path = path.substring(offset + 1)
    }

    if (ext && path.endsWith(ext) && path.length > ext.length) {
      return path.substring(0, path.length - ext.length)
    }
    return path
  }

  $path.dirname = function dirname (path) {
    if (typeof path !== 'string') {
      throw invalidType('path', path)
    }

    var origin
    if (RegexUrl.test(path)) {
      var url = parseUrl(path)
      if (!url) return path

      origin = url.protocol + '//' + url.host
      path = url.pathname
    }

    var offset = path.length
    while (offset > 0 && path[offset - 1] === Separator) {
      offset--
    }
    if (offset < path.length) {
      path = path.substring(0, offset)
    }

    offset = path.lastIndexOf(Separator)
    switch (offset) {
      case -1:
        return origin || '.'
      case 0:
        return origin || Separator
      default:
        return origin ? origin + path.substring(0, offset) : path.substring(0, offset)
    }
  }

  $path.extname = function extname (path) {
    if (typeof path !== 'string') {
      throw invalidType('path', path)
    }

    if (RegexUrl.test(path)) {
      var url = parseUrl(path)
      if (!url) return ''
      path = new URL(path).pathname
    }

    var offset = path.lastIndexOf('.')
    if (offset <= 0) {
      return ''
    }

    var sep = path.lastIndexOf(Separator) + 1
    if (sep >= offset) {
      return ''
    }

    offset += 1
    return offset >= path.length ? '.' : path.substring(offset)
  }

  var PathObjectKeys = ['dir', 'root', 'base', 'name', 'ext']
  $path.format = function format (pathObject) {
    if (typeof pathObject !== 'object') {
      throw invalidType('pathObject', pathObject, 'object')
    }
    PathObjectKeys.forEach(function (key) {
      var value = pathObject[key]
      if (typeof value !== 'string' && typeof value !== 'undefined' && value !== null) {
        throw invalidType('pathObject.' + key, value)
      }
    })

    var paths = []
    if (pathObject.dir && RegexUrl.test(pathObject.dir)) {
      paths.push(pathObject.dir)
    } else {
      pathObject.root && paths.push(pathObject.root)
      pathObject.dir && paths.push(pathObject.dir)
    }

    if (pathObject.base) {
      paths.push(pathObject.base)
    } else {
      pathObject.name && paths.push(pathObject.name)
      pathObject.ext && paths.push(pathObject.ext)
    }

    return $path.join.apply($path, paths)
  }

  $path.isAbsolute = function isAbsolute (path) {
    if (typeof path !== 'string') {
      throw invalidType('path', path)
    }
    return RegexUrl.test(path)
  }

  $path.join = function join (paths) {
    paths = Array.prototype.slice.call(arguments)
    paths.forEach(function (path) {
      if (typeof path !== 'string') {
        throw invalidType('path', path)
      }
    })
    return $path.normalize(paths.join(Separator)) || '.'
  }

  function reduce (root, segments) {
    for (var i = 0; i < segments.length;) {
      if (!segments[i]) {
        segments.splice(i, 1); continue
      }
      if (segments[i] === '.' && (i > 0 || root)) {
        segments.splice(i, 1); continue
      }
      if (segments[i] !== '..') {
        i += 1; continue
      }
      if (i === 0) {
        root ? segments.splice(i, 1) : (i += 1)
        continue
      }
      if (segments[i - 1] === '..') {
        i += 1; continue
      }
      if (segments[i - 1] === '.') {
        segments.splice(i - 1, 1)
      } else {
        segments.splice(i - 1, 2)
        i -= 1
      }
    }
    return segments
  }

  $path.normalize = function normalize (path) {
    if (typeof path !== 'string') {
      throw invalidType('path', path)
    }

    var root
    if (RegexUrl.test(path)) {
      var url = parseUrl(path)
      if (!url) return path

      root = url.protocol + '//' + url.host
      path = url.pathname
    } else if (path.startsWith(Separator)) {
      root = Separator
    }

    var segments = reduce(root, path.split(Separator))
    var pathname = segments.join(Separator)
    return !root ? pathname
      : root === Separator || !pathname ? root + pathname
        : root + Separator + pathname
  }

  $path.parse = function normalize (path) {
    if (typeof path !== 'string') {
      throw invalidType('path', path)
    }

    var pathObject = { base: '', name: '', ext: '' }
    pathObject.dir = $path.dirname(path)

    if (RegexUrl.test(path)) {
      var offset = path.indexOf('://') + 3
      offset = path.indexOf(Separator, offset)
      if (offset < 0) {
        pathObject.root = path
        return pathObject
      }
      pathObject.root = path.substring(0, offset)
    } else {
      pathObject.root = ''
    }

    pathObject.base = $path.basename(path)
    pathObject.ext = $path.extname(path)
    pathObject.name = pathObject.ext
      ? $path.basename(path, pathObject.ext)
      : pathObject.base

    return pathObject
  }

  $path.relative = function relative (from, to) {
    if (typeof from !== 'string') {
      throw invalidType('from', from)
    }
    if (typeof to !== 'string') {
      throw invalidType('to', from)
    }

    var fromSegments = $path.normalize(from).split(Separator)
    var toSegments = $path.normalize(to).split(Separator)
    if (fromSegments[0] !== toSegments[0]) {
      return from
    }
    var i = 1
    for (; i < fromSegments.length && i < toSegments.length; i++) {
      if (fromSegments[i] !== toSegments[i]) {
        break
      }
    }
    var segments = []
    for (var j = i; j < fromSegments.length; j++) {
      segments.push('..')
    }
    for (var k = i; k < toSegments.length; k++) {
      segments.push(toSegments[k])
    }
    return segments.join(Separator)
  }

  $path.resolve = function resolve (base) {
    var paths = Array.prototype.slice.call(arguments)
    var rootOffset = -1
    paths.forEach(function (path, i) {
      if (typeof path !== 'string') {
        throw invalidType('path', path)
      }
      if (RegexUrl.test(path)) {
        rootOffset = i
      }
    })
    if (rootOffset < 0) {
      paths.unshift(BaseUrl)
    } else if (rootOffset > 0) {
      paths = paths.slice(rootOffset)
    }
    return $path.join.apply($path, paths)
  }

  return $path
}
