'use strict'

function exportTo (container, name, obj) {
  /*if (Object.prototype.hasOwnProperty.call(obj, 'identityName') &&
      (typeof obj === 'object' || typeof obj === 'function')) {
    var parent = container.identityName || '$'
    if (parent.startsWith('$') || name.startsWith('$')) {
      obj.identityName = name
    } else if (typeof obj === 'object') {
      obj.identityName = '(' + parent + ' ' + name + ')'
    } else {
      obj.identityName = '(' + parent + ' "' + name + '")'
    }
  } */

  container[name] = obj
  return obj
}

function wrapFunction (container, name, owner, func) {
  exportTo(container, name, function () {
    return func.apply(owner, arguments)
  })
}

function wrapMethod (container, name, func) {
  exportTo(container, name, function () {
    return func.apply(this, arguments)
  })
}

function mapAll (obj) {
  var mapping = Object.create(null)
  var keys = Object.getOwnPropertyNames(obj)
  for (var i in keys) {
    var key = keys[i]
    mapping[key] = key
  }
  return mapping
}

function copyObject (target, src, mapping) {
  if (!mapping) {
    mapping = mapAll(src)
  }

  var keys = Object.getOwnPropertyNames(mapping)
  var isPrototype = typeof src.constructor === 'function'
  for (var i in keys) {
    var key = keys[i]
    var value = src[key]
    if (typeof value === 'undefined') {
      console.warn(src, 'missing required member:', i, key, keys)
    } else if (typeof value === 'function') {
      if (isPrototype) {
        wrapMethod(target, mapping[key], value)
      } else {
        wrapFunction(target, mapping[key], src, value)
      }
    } else {
      target[mapping[key]] = value
    }
  }
  return target
}

function dumpType (type) {
  var i, k, v

  var utils = Object.create(null)
  var constants = Object.create(null)
  var keys = Object.getOwnPropertyNames(type)
  for (i in keys) {
    k = keys[i]
    v = type[k]
    if (typeof v === 'function') {
      utils[k] = v.toString()
    } else {
      constants[k] = typeof v
    }
  }

  var pt = type.prototype
  if (!pt) {
    return {
      props: constants,
      methods: utils
    }
  }

  var methods = Object.create(null)
  var props = Object.create(null)
  var inst = new (pt.constructor)()
  keys = Object.getOwnPropertyNames(pt)
  for (i in keys) {
    k = keys[i]
    v = type[i]
    if (typeof v === 'undefined') {
      v = inst[k]
    }
    if (typeof v === 'function') {
      methods[k] = v.toString()
    } else {
      props[k] = typeof v
    }
  }

  return {
    constants: constants,
    utils: utils,
    props: props,
    methods: methods
  }
}

function printObject (obj) {
  console.log('---- dumping', obj, '----')
  console.log(dumpType(obj))
}

exportTo.copy = copyObject
exportTo.print = printObject

module.exports = exportTo
