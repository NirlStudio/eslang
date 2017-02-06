'use strict'

function constructInstance ($void) {
  var isPrototypeOf = $void.isPrototypeOf
  var Class = $void.$.Class

  return function Class$construct () {
    var class_ = this === Class || (isPrototypeOf(Class, this) &&
      isPrototypeOf(Class.proto, this.proto)) ? this : Class
    if (!class_ || class_['abstract']) {
      return null
    }

    var obj = Object.create(class_.proto)
    var constructor = class_.proto.constructor
    if (typeof constructor === 'function') {
      constructor.apply(obj, arguments)
    }
    return obj
  }
}

function deriveClass ($void) {
  var createUserType = $void.createUserType
  var isPrototypeOf = $void.isPrototypeOf
  var Class = $void.$.Class

  return function Class$of (proto) {
    var parent = this === Class || (isPrototypeOf(Class, this) &&
      isPrototypeOf(Class.proto, this.proto)) ? this : Class
    if (!parent || parent['finalized']) {
      return null
    }

    var class_ = createUserType(parent)
    if (typeof proto !== 'object') {
      return class_
    }

    if (typeof proto.constructor === 'function') {
      proto.upper = parent.proto.constructor
    } else {
      delete proto.constructor
    }

    Object.assign(class_.proto, proto)
    return class_
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Class = $.Class
  var readonly = $void.readonly
  var virtual = $void.virtual

  // derive from this class to create a new class with its static & instance properties.
  readonly(Class, 'define', deriveClass($void))

  // construct a new object by calling constructor with some arguments.
  readonly(Class, 'construct', constructInstance($void))

  // default constructor
  virtual(Class.proto, 'constructor', function Class$constructor () {})
}
