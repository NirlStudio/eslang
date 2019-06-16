'use strict'

function hyphenize (name) {
  var segments = name.split(/[_-\s]+/g)
  var converted = false
  for (var i = 0, count = segments.length; i < count; i++) {
    var segment = escapeCamel(segments[i])
    if (segment !== segments[i]) {
      segments[i] = segment
      converted = true
    }
  }
  return segments.length > 1 || converted ? segments.join('-') : name
}

function escapeCamel (segment) {
  var words = []
  var word = ''
  var lastIsCapital = false
  for (var i = 0, len = segment.length; i < len; i++) {
    var c = segment.charAt(i)
    if (c === c.toLocaleLowerCase()) {
      word += c
      lastIsCapital = false
    } else {
      if (word && !lastIsCapital) {
        words.push(word.toLocaleLowerCase())
        word = ''
      }
      var next = ++i < len ? segment[i] : ''
      if (!next) { // ending
        if (lastIsCapital) {
          words.push((word + c).toLocaleLowerCase())
        } else {
          words.push(c.toLocaleLowerCase())
        }
        word = ''
      } else if (next !== next.toLocaleLowerCase()) {
        // several continuous upper-cased chars, except the last one,
        // are counted in a single word.
        word += c; i--
        lastIsCapital = true
      } else {
        word && words.push(word.toLocaleLowerCase())
        word = c + next
        lastIsCapital = false
      }
    }
  }
  word && words.push(word.toLocaleLowerCase())
  return words.join('-')
}

function setter (key, value) {
  if (!key || typeof key !== 'string') {
    return null
  }
  if (typeof value !== 'undefined') {
    return (this[key] = value)
  }
  delete this[key]
  return null
}

module.exports = function ($void) {
  var $ = $void.$
  var $Class = $.class
  var $Object = $.object
  var $Function = $.function
  var typeOf = $void.typeOf
  var $export = $void.export
  var ownsProperty = $void.ownsProperty
  var safelyAssign = $void.safelyAssign

  var objectOfGenericFunc = $Function.proto.generic

  $export($void, '$suglify', function (src) {
    // suglify only returns null, a string or an object.
    if (typeof src === 'string') {
      return hyphenize(src)
    }
    // accepts a generic function so that an expression like:
    //   (suglify (func generic))
    // can be simplified to:
    //   (suglify func)
    var proxy
    var srcType = typeOf(src)
    if (srcType === $Function) {
      proxy = objectOfGenericFunc.call(src)
      srcType = proxy ? $Object : null
      if (src.bound) {
        src = src.bound
      }
    }
    // ignore common proto members.
    var proto
    if (srcType === $Object) {
      proto = $Object.proto
    } else if (typeOf(srcType) === $Class) {
      proto = $Class.proto.proto
    } else {
      return null
    }
    if (!proxy) { // make sure all methods are bound to the original object
      proxy = safelyAssign($Object.empty(), src, true)
    }
    // copy and supplement setters.
    var target = $Object.empty()
    target['set-'] = setter.bind(src) // common setter
    for (var key in proxy) {
      if (typeof proto[key] === 'undefined' || ownsProperty(src, key)) {
        var newKey = hyphenize(key)
        target[newKey] = proxy[key]
        if (ownsProperty(src, key)) {
          // a dedicated setter is only supplemented for a real field.
          target['set-' + newKey] = setter.bind(src, key)
        }
      }
    }
    return target || src
  })
}
