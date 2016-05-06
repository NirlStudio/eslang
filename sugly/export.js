'use strict'

function exportTo (container, name, obj) {
  if (typeof obj === 'object' || typeof obj === 'function') {
    var parent = container.identityName
    if (parent === '$') {
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
  exportTo(container, name, function () {
    return func.apply(owner, arguments)
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
  for (var i in keys) {
    var key = keys[i]
    var value = src[key]
    if (typeof value === 'undefined') {
      console.warn(name, 'missing required member:', key)
    } else if (typeof value === 'function') {
      wrapFunction(target, mapping[key], src, value)
    } else {
      target[mapping[key]] = value
    }
  }
  return target
}

var reserved = Object.create(null)
reserved.name = true
reserved.length = true
reserved.arguments = true
reserved.caller = true
reserved.prototype = true

var ptReserved = Object.create(null)
ptReserved.arguments = true
ptReserved.caller = true
ptReserved.toString = true
ptReserved.constructor = true

function dumpObject (obj) {
  var i, k, v

  var utils = {}
  var constants = {}
  var keys = Object.getOwnPropertyNames(obj)
  for (i in keys) {
    k = keys[i]
    if (reserved[k]) {
      continue
    }

    v = obj[k]
    if (typeof v === 'function') {
      utils[k] = v
    } else {
      constants[k] = v
    }
  }

  var methods = {}
  var props = {}
  var pt = obj.prototype
  keys = Object.getOwnPropertyNames(pt)
  for (i in keys) {
    k = keys[i]
    if (ptReserved[k]) {
      continue
    }

    v = pt[k]
    if (typeof v === 'function') {
      methods[k] = v
    } else {
      props[k] = v
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
  console.log(dumpObject(obj))
}

exportTo.wrap = wrapFunction
exportTo.copy = copyObject
exportTo.dump = dumpObject
exportTo.print = printObject

module.exports = exportTo
