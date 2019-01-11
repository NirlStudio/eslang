'use strict'

var records = module.exports = []
var JS = global || window

/* functions are ported from MDN */
if (typeof Object.assign !== 'function') {
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

if (typeof Object.create !== 'function') {
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

if (typeof Object.is !== 'function') {
  records.push('Object.is')

  JS.Object.is = function (x, y) {
    if (x === y) {
      return x !== 0 || 1 / x === 1 / y
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y // eslint-disable-line no-self-compare
    }
  }
}

if (typeof Object.getOwnPropertyNames !== 'function') {
  records.push('Object.getOwnPropertyNames')

  JS.Object.getOwnPropertyNames = function (obj) {
    var names = []
    for (var name in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, name)) {
        names.push(name)
      }
    }
    return names
  }
}

if (typeof Object.freeze !== 'function') {
  records.push('Object.freeze')

  JS.Object.freeze = function (obj) {
    obj && typeof obj === 'object' && (obj.__sugly_frozen = true)
    return obj
  }
}

if (typeof Object.isFrozen !== 'function') {
  records.push('Object.isFrozen')

  JS.Object.isFrozen = function (obj) {
    return obj ? obj.__sugly_frozen === true : false
  }
}

if (typeof String.prototype.startsWith !== 'function') {
  records.push('String.prototype.startsWith')

  JS.String.prototype.startsWith = function (searchString, position) {
    position = position || 0
    return this.substr(position, searchString.length) === searchString
  }
}

if (typeof String.prototype.endsWith !== 'function') {
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

if (typeof String.prototype.trim !== 'function') {
  records.push('String.prototype.trim')

  JS.String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  }
}

if (typeof String.prototype.trimLeft !== 'function') {
  records.push('String.prototype.trimLeft')

  JS.String.prototype.trimLeft = function () {
    return this.replace(/^[\s\uFEFF\xA0]+/g, '')
  }
}

if (typeof String.prototype.trimRight !== 'function') {
  records.push('String.prototype.trimRight')

  JS.String.prototype.trimRight = function () {
    return this.replace(/[\s\uFEFF\xA0]+$/g, '')
  }
}

if (typeof Array.isArray !== 'function') {
  records.push('Array.isArray')

  JS.Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

if (typeof Number.isInteger !== 'function') {
  records.push('Number.isInteger')

  JS.Number.isInteger = function (value) {
    return typeof value === 'number' &&
      isFinite(value) &&
      Math.floor(value) === value
  }
}

if (typeof Number.MAX_SAFE_INTEGER !== 'number') {
  records.push('Number.MAX_SAFE_INTEGER')

  JS.Number.MAX_SAFE_INTEGER = (Math.pow(2, 53) - 1)
}

if (typeof Number.MIN_SAFE_INTEGER !== 'number') {
  records.push('Number.MIN_SAFE_INTEGER')

  JS.Number.MIN_SAFE_INTEGER = -(Math.pow(2, 53) - 1)
}

if (typeof Number.isSafeInteger !== 'function') {
  records.push('Number.isSafeInteger')

  JS.Number.isSafeInteger = function (value) {
    return Number.isInteger(value) &&
      value >= Number.MIN_SAFE_INTEGER &&
      value <= Number.MAX_SAFE_INTEGER
  }
}

if (typeof Math.trunc !== 'function') {
  records.push('Math.trunc')

  JS.Math.trunc = function (x) {
    return isNaN(x) || Number.isInteger(x) ? x
      : x > 0 ? Math.floor(x) : Math.ceil(x)
  }
}

if (typeof Math.log2 !== 'function') {
  records.push('Math.log2')

  JS.Math.log2 = function (x) {
    return Math.log(x) * Math.LOG2E
  }
}

if (typeof Math.log10 !== 'function') {
  records.push('Math.log10')

  JS.Math.log10 = function (x) {
    return Math.log(x) * Math.LOG10E
  }
}

if (typeof console !== 'object') {
  records.push('console.log')
  records.push('console.warn')

  JS.console = {
    log: function () {},
    warn: function () {}
  }
}
