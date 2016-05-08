'use strict'

var JS = global || window
var forcePolyfill = false // ordinarily for testing purpose

var records = []

/* functions are ported from MDN */
if (forcePolyfill || typeof Object.assign !== 'function') {
  records.push('Object.assign')

  JS.Object.assign = function (target) {
    if (typeof target === 'undefined' || target === null) {
      return null
    }
    var output = Object(target)
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index]
      if (typeof source !== 'undefined' && source !== null) {
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            output[key] = source[key]
          }
        }
      }
    }
    return output
  }
}

if (forcePolyfill || typeof Object.create !== 'function') {
  records.push('Object.create')

  JS.Object.create = (function () {
    var Temp = function () {}
    return function (prototype) {
      if (prototype === null) {
        prototype = {}
      } else if (prototype !== Object(prototype)) {
        return null
      }
      Temp.prototype = prototype
      var result = new Temp()
      Temp.prototype = null
      return result
    }
  })()
}

if (forcePolyfill || typeof Object.is !== 'function') {
  records.push('Object.is')

  JS.Object.is = function (x, y) {
    // SameValue algorithm
    if (x === y) { // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y
    }
  }
}

if (forcePolyfill || typeof String.prototype.startsWith !== 'function') {
  records.push('String.prototype.startsWith')

  JS.String.prototype.startsWith = function (searchString, position) {
    position = position || 0
    return this.substr(position, searchString.length) === searchString
  }
}

if (forcePolyfill || typeof String.prototype.endsWith !== 'function') {
  records.push('String.prototype.endsWith')

  JS.String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString()
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length
    }
    position -= searchString.length
    var lastIndex = subjectString.indexOf(searchString, position)
    return lastIndex !== -1 && lastIndex === position
  }
}
if (forcePolyfill || typeof String.prototype.trim !== 'function') {
  records.push('String.prototype.trim')

  JS.String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (forcePolyfill || typeof Array.isArray !== 'function') {
  records.push('Array.isArray')

  JS.Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

if (forcePolyfill || typeof Number.isInteger !== 'function') {
  records.push('Number.isInteger')

  JS.Number.isInteger = function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  }
}

module.exports = {
  functions: records
}
