'use strict'

function looksObject (subject, obj) {
  for (var prop in obj) {
    if (typeof subject[prop] === 'undefined') {
      return false
    }
  }
  return true
}

function createLooksInterface ($void) {
  var instanceOf = $void.instanceOf

  return function Object$looksInterface (subject, adj) {
    var keys = Object.getOwnPropertyNames(adj)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var value = subject[key]
      if (typeof value === 'undefined') {
        value = null
      }

      var type = adj[key]
      if (Array.isArray(type)) { // type descriptor is a type list.
        var matched = true // for empty type list
        for (var j = 0; j < type.length; j++) {
          matched = instanceOf(value, type[j])
          if (matched) {
            break // matched any
          }
        }
        if (!matched) {
          // type list is not empty and field value does not match any of them.
          return false
        }
      } else if (typeof type === 'function') { // descriptor is a checker function.
        if (type(value) !== true) {
          return false
        }
      } else { // a single type is appointed.
        if (!instanceOf(value, type)) {
          return false
        }
      }
    }
    return true
  }
}

function interfaceLooks ($void) {
  var proto = $void.$.Interface.proto
  var isPrototypeOf = $void.isPrototypeOf

  return function interface$looks () {
    if (!isPrototypeOf(proto, this)) {
      return false
    }

    for (var i = 0; i < arguments.length; i++) {
      var adj = arguments[i]
      if (!isPrototypeOf(proto, adj)) {
        return false
      }

      var keys = Object.getOwnPropertyNames(adj)
      for (var j = 0; j < keys.length; j++) {
        if (typeof this[keys[i]] === 'undefined') {
          return false
        }
      }
    }
    return true
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Interface = $.Interface
  var proto = Interface.proto
  var object = $.Object.proto
  var constant = $void.constant
  var readonly = $void.readonly
  var virtual = $void.virtual
  var isPrototypeOf = $void.isPrototypeOf

  // extend Object to support Interface logic.
  var looksInterface = createLooksInterface($void)
  virtual($.Object.proto, 'looks', function Object$looks () {
    if (typeof this !== 'object') {
      return false
    }

    for (var i = 0; i < arguments.length; i++) {
      var adj = arguments[i]
      if (isPrototypeOf(proto, adj)) {
        if (!looksInterface(this, adj)) {
          return false
        }
      } else if (typeof adj === 'object') {
        if (!looksObject(this, adj)) {
          return false
        }
      } else { // unsupported adjective entity.
        return false
      }
    }
    return true
  })

  // define a interface by one or more descriptor objects.
  readonly(Interface, 'create', function Interface$create () {
    var inf = Object.create(proto)
    for (var i = 0; i < arguments.length; i++) {
      var obj = arguments[i]
      if (isPrototypeOf(object, obj)) {
        Object.assign(inf, obj)
      }
    }
    return inf
  })

  // override looks-logic for interface itself to check keys only.
  virtual(proto, 'looks', interfaceLooks($void))

  // TODO - refactor into separate files.
  // generic interfaces
  constant($, 'iterator', Interface.create({
    next: $.Function,      // required, it must be a function
    value: [$.Type, null], // required, it may be any type of value or null.
    key: [null, $.Type]    // optional and it may be any type of value.
  }))

  constant($, 'iterable', Interface.create({
    iterate: $.Function // required, it must be a function
  }))

  var ordering = constant($, 'ordering', $.Enum.create({
    desc: 1,
    same: 0,
    asc: -1
  }))

  constant($, 'descending', ordering.desc)
  constant($, 'the-same', ordering.same)
  constant($, 'ascending', ordering.asc)

  constant($, 'comparable', Interface.create({
    compare: $.Function // required, it must be a function and return an ordering type.
  }))
}
