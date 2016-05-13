'use strict'

var $export = require('../export')

function isTypeOf ($) {
  var isSymbol = $.Symbol['is-type-of']
  return function Object$is_type_of (value) {
    // both native & managed objects.
    return typeof value === 'object' && value !== null && !isSymbol(value)
  }
}

function create (objectClass) {
  return function Object$create () {
    var obj = Object.create(objectClass)
    if (arguments.length > 0) {
      var args = [obj]
      Object.assign.apply(Object, Array.prototype.concat.apply(args, arguments))
    }
    return obj
  }
}

function derive (objectClass) {
  return function Object$derive (type_, class_) {
    var type = Object.create(objectClass)
    var typeClass = type.class = Object.create(objectClass)
    typeClass.static = type

    Object.assign(type, type_)
    Object.assign(typeClass, class_)
    return type
  }
}

function equals ($) {
  var isSymbol = $.Symbol['is-type-of']
  return function Object$equals (another) {
    if (typeof this !== 'object' || this === null || isSymbol(this)) {
      return false
    }
    // TODO - to compare type & fields.
    return Object.is(this, another)
  }
}

function objectSuper ($) {
  var Null = $.Null
  return function object$super () {
    var class_
    if (this.class) {
      class_ = Object.getPrototypeOf(this.class)
    } else {
      class_ = Object.getPrototypeOf(this)
      if (class_) {
        class_ = Object.getPrototypeOf(class_)
      }
    }
    return class_ && class_.static || Null
  }
}

function objectGetType (type) {
  return function object$get_type () {
    try {
      var class_ = Object.getPrototypeOf(this)
      return class_.static || type
    } catch (err) {
      console.warn('failed to get prototype of', this, 'for', err)
      return type
    }
  }
}

function objectIsTypeOf () {
  return function object$is_type_of (value) {
    return typeof this.class !== 'undefined' && Object.getPrototypeOf(value) === this.class
  }
}

function objectIsInstanceOf () {
  return function object$is_instance_of (type) {
    return typeof type !== 'undefined' && typeof type.class !== 'undefined' &&
      Object.getPrototypeOf(this) === type.class
  }
}

function toCode ($) {
  return function Object$to_code () {
    return $.encode.object(this)
  }
}

function getField ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']
  return function object$get_field (name) {
    if (typeof name !== 'string') {
      if (isSymbol(name)) {
        name = symbolKeyOf(name)
      } else {
        return null
      }
    }
    return typeof this[name] === 'undefined' ? null : this[name]
  }
}

function setField ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']
  return function object$set_field (name, value) {
    if (typeof name !== 'string') {
      if (isSymbol(name)) {
        name = symbolKeyOf(name)
      } else {
        return null
      }
    }
    return (this[name] = typeof value === 'undefined' ? null : value)
  }
}

function removeField ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']
  return function object$remove_field (name) {
    if (typeof name !== 'string') {
      if (isSymbol(name)) {
        name = symbolKeyOf(name)
      } else {
        return null
      }
    }
    var value
    if (Object.prototype.hasOwnProperty.call(this, name)) {
      value = this[name]
      delete this[name]
    } else {
      value = null
    }
    return value
  }
}

function getFields () {
  return function object$get_fields () {
    return Object.getOwnPropertyNames(this)
  }
}

function hasField ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']
  return function object$has_field (name) {
    if (typeof name !== 'string') {
      if (isSymbol(name)) {
        name = symbolKeyOf(name)
      } else {
        return null
      }
    }
    return Object.prototype.hasOwnProperty.call(this, name)
  }
}

function hasProperty ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']
  return function object$has_property (name) {
    if (typeof name !== 'string') {
      if (isSymbol(name)) {
        name = symbolKeyOf(name)
      } else {
        return null
      }
    }
    return typeof this[name] !== 'undefined'
  }
}

function combine (newObject) {
  return function () {
    var objs = [this]
    Array.prototype.push.apply(objs, arguments)
    return newObject.apply(null, objs)
  }
}

function mixin (objectClass) {
  var isObject = Object.prototype.isPrototypeOf.bind(objectClass)
  return function () {
    if (isObject(this)) {
      for (var i = 0; i < arguments.length; i++) {
        Object.assign(this, arguments[i])
      }
    }
  }
}

function objectCreate (objectClass) {
  var isObject = Object.prototype.isPrototypeOf.bind(objectClass)
  return function object$create () {
    // only a type can create instance
    if (isObject(this) && isObject(this.class) && !this.abstract) {
      var obj = Object.create(this.class)
      if (arguments.length > 0) {
        var args = [obj]
        Object.assign.apply(Object, Array.prototype.concat.apply(args, arguments))
      }
      // constructor logic
      return obj
    }
    return null
  }
}

function objectDerive (objectClass) {
  var isObject = Object.prototype.isPrototypeOf.bind(objectClass)
  return function object$derive (type_, class_) {
    // only a type can derive child types
    if (isObject(this) && isObject(this.class)) {
      var type = Object.create(this)
      type.abstract = false

      var typeClass = type.class = Object.create(this.class)
      typeClass.static = type

      Object.assign(type, type_)
      Object.assign(typeClass, class_)
      return type
    }
    return null
  }
}

function objectClone (objectClass) {
  var isObject = Object.prototype.isPrototypeOf.bind(objectClass)
  return function object$clone () {
    // only an instance is clonable
    if (isObject(this) && !this.class) {
      var obj = Object.create(Object.getPrototypeOf(this))
      Object.assign(obj, this)
      return obj
    }
    return null
  }
}

function objectIndexer ($) {
  var isSymbol = $.Symbol['is-type-of']
  var symbolKeyOf = $.Symbol['key-of']
  return function object$indexer (name, value) {
    if (typeof name !== 'string') {
      if (isSymbol(name)) {
        name = symbolKeyOf(name)
      } else {
        return null
      }
    }
    switch (arguments.length) {
      case 1:
        return typeof this[name] === 'undefined' ? null : this[name]
      case 2:
        return (this[name] = value)
      default:
        return null
    }
  }
}

module.exports = function ($) {
  var type = $.Object
  var class_ = type.class

  // test a native or managed object.
  $export(type, 'is-type-of', isTypeOf($))

  // to create an object instance by copying properties from source objects.
  var newObject = $export(type, 'create', create(class_))

  // to create a managed type by its static & instance properties.
  $export(type, 'derive', derive(class_))

  // default equivalence logic for all objects.
  $export(class_, 'equals', equals($))

  // the default object class_-relationship logic
  // get the super type of this type or instance
  $export(class_, 'super', objectSuper($))
  // get the type object for an instance or super type for a type.
  $export(class_, 'get-type', objectGetType(type))
  // test an object with this type.
  $export(class_, 'is-type-of', objectIsTypeOf())
  // test an type for this instance
  $export(class_, 'is-instance-of', objectIsInstanceOf())

  // default object persistency & describing logic
  $export(class_, 'to-code', toCode($))
  $export(class_, 'to-string', toCode($))

  // default object emptiness logic
  $export(class_, 'is-empty', function () {
    return Object.getOwnPropertyNames(this).length > 0
  })
  $export(class_, 'not-empty', function () {
    return Object.getOwnPropertyNames(this).length < 1
  })

  // property & field (owned property) manipulation
  // retrieve the value of a field
  $export(class_, 'get-field', getField($))
  // set the value of a field
  $export(class_, 'set-field', setField($))
  // remove a field from an object
  $export(class_, 'remove-field', removeField($))
  // retrieve field names
  $export(class_, 'get-fields', getFields())
  // test the existence by a field name
  $export(class_, 'has-field', hasField($))
  // test a property (either owned or inherited) name
  $export(class_, 'has-property', hasProperty($))
  // generate a new object by comine this object and other objects.
  $export(class_, 'combine', combine(newObject))
  // shallowly copy fiels from other objects to this object.
  $export(class_, 'mixin', mixin(class_))

  // default type hierarchy system
  // to create an instance for this type.
  $export(class_, 'create', objectCreate(class_))
  // to derive an inherited type for this one.
  $export(class_, 'derive', objectDerive(class_))
  // to create a shallow copy of this instance with the same type.
  $export(class_, 'clone', objectClone(class_))

  // default operations for a container.
  // A general object is the container of all its fields
  // indexer: get/set field value
  $export(class_, ':', objectIndexer($))
  // iterator: iterate all field names and values
  require('./object-iterator')($)

  // support general operators
  $export(class_, '+', combine(newObject))
  $export(class_, '+=', mixin(class_))

  return type
}
