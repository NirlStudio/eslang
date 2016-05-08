'use strict'

function exportTo (container, name, obj) {
  if (!obj) {
    obj = Object.create(null)
  } else if (!name) {
    name = obj.identityName
  }

  if (Object.prototype.hasOwnProperty.call(obj, 'identityName') &&
      (typeof obj === 'object' || typeof obj === 'function')) {
    var parent = container.identityName
    if (parent === '$' || name === '$') {
      obj.identityName = name
    } else if (typeof obj === 'object') {
      obj.identityName = '(' + parent + ' ' + name + ')'
    } else {
      obj.identityName = '(' + parent + ' "' + name + '")'
    }
  }

  container[name] = obj
  return obj
}

function wrapFunction (container, name, owner, func) {
  if (arguments.length < 4) {
    exportTo(container, name, function () {
      return owner.apply(this, arguments)
    })
  } else {
    exportTo(container, name, function () {
      return func.apply(owner, arguments)
    })
  }
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

function copyObject (name, src, mapping, target) {
  if (!src) {
    src = Object.create(null)
    src.identityName = name
    return src
  }

  if (!mapping) {
    mapping = mapAll(src)
  }

  if (!target) {
    target = Object.create(null)
    target.identityName = name
  }

  var keys = Object.getOwnPropertyNames(mapping)
  var isPrototype = typeof src.constructor === 'function'
  for (var i in keys) {
    var key = keys[i]
    var value = src[key]
    if (typeof value === 'undefined') {
      console.warn(name, 'missing required member:', key)
    } else if (typeof value === 'function') {
      if (isPrototype) {
        wrapFunction(target, mapping[key], value)
      } else {
        wrapFunction(target, mapping[key], src, value)
      }
    } else {
      target[mapping[key]] = value
    }
  }
  return target
}

function _dumpType (type) {
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
  console.log(_dumpType(obj))
}

exportTo.wrap = wrapFunction
exportTo.copy = copyObject
exportTo.print = printObject

module.exports = exportTo
