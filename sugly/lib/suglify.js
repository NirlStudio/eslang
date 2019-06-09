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

module.exports = function ($void) {
  var $ = $void.$
  var $Class = $.class
  var $Object = $.object
  var $Function = $.function
  var typeOf = $void.typeOf
  var $export = $void.export
  var safelyAssign = $void.safelyAssign

  var objectOfGenericFunc = $Function.proto.generic

  $export($, 'suglify', function (src) {
    if (typeof src === 'string') {
      return hyphenize(src)
    }
    // accepts a generic function so that an expression like:
    //   (suglify (func generic))
    // can be simplified to:
    //   (suglify func)
    var bound = false
    var srcType = typeOf(src)
    if (srcType === $Function) {
      bound = true
      src = objectOfGenericFunc.call(src)
      srcType = src ? $Object : null
    }
    // suglify only returns null, a string or an object.
    if (srcType !== $Object && typeOf(srcType) !== $Class) {
      return null
    }
    // make a copy, which may be discarded if no conversion really happens.
    var target = null
    var keys = Object.getOwnPropertyNames(src)
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i]
      var newKey = hyphenize(key)
      if (newKey !== key) {
        if (!target) {
          target = bound ? Object.assign($Object.empty(), src)
            : safelyAssign($Object.empty(), src, true)
        }
        target[newKey] = target[key]
        delete target[key]
      }
    }
    return target || src
  })
}
