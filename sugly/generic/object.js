'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.object
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var link = $void.link
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var isObject = $void.isObject
  var thisCall = $void.thisCall
  var ClassType$ = $void.ClassType
  var ownsProperty = $void.ownsProperty
  var protoValueOf = $void.protoValueOf
  var encodeFieldName = $void.encodeFieldName
  var EncodingContext$ = $void.EncodingContext
  var defineTypeProperty = $void.defineTypeProperty

  // create an empty object.
  var createObject = link(Type, 'empty', Object.create.bind(Object, Type.proto))

  // create a new object and copy fields from source objects.
  link(Type, 'of', function () {
    var obj = createObject()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (isObject(source)) {
        Object.assign(obj, source)
      }
    }
    return obj
  }, true)

  // copy fields from source objects to the target object
  link(Type, 'assign', function (target) {
    if (isObject(target)) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        if (source instanceof Object$) {
          Object.assign(target, source)
        }
      }
      return target
    }
    return null
  }, true)

  // get the value of a field.
  link(Type, 'get', function (obj, name, value) {
    if (name instanceof Symbol$) {
      name = name.key
    } else if (typeof name !== 'string') {
      return value
    }
    var pValue
    return !isObject(obj) ? value
      : ownsProperty(obj, name)
        ? typeof obj[name] === 'undefined' ? value : obj[name]
        : typeof (pValue = protoValueOf(obj, obj, name)) === 'undefined'
          ? value : pValue
  }, true)
  // set the value of a field.
  link(Type, 'set', function (obj, name, value) {
    if (name instanceof Symbol$) {
      name = name.key
    } else if (typeof name !== 'string') {
      return null
    }
    return !isObject(obj) ? null
      : (obj[name] = (typeof value !== 'undefined' ? value : null))
  }, true)
  // remove a field.
  link(Type, 'reset', function (obj, name, more) {
    if (!isObject(obj)) {
      return 0
    }
    if (typeof more === 'undefined') {
      if (name instanceof Symbol$) {
        name = name.key
      }
      return typeof name !== 'string' ? 0
        : delete obj[name] ? 1 : 0
    }
    var i = 1
    var counter = 0
    do {
      if (typeof name === 'string') {
        (delete obj[name]) && counter++
      } else if (name instanceof Symbol$) {
        (delete obj[name.key]) && counter++
      }
      name = arguments[++i]
    } while (i < arguments.length)
    return counter
  }, true)

  // make a copy with selected or all fields.
  link(Type, 'copy', function (src, fields) {
    if (!isObject(src)) {
      return null
    }
    var obj = Object.create(src.type.proto)
    var names = arguments.length > 1
      ? Array.prototype.slice.call(arguments, 1)
      : Object.getOwnPropertyNames(src)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (name instanceof Symbol$) {
        name = name.key
      }
      if (typeof name === 'string') {
        obj[name] = src[name]
      }
    }
    var activator = src.type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }, true)
  // remove given or all fields.
  link(Type, 'clear', function (obj, fields) {
    if (!isObject(obj)) {
      return null
    }
    var names = arguments.length > 1
      ? Array.prototype.slice.call(arguments, 1)
      : Object.getOwnPropertyNames(obj)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof name === 'string') {
        delete obj[name]
      } else if (name instanceof Symbol$) {
        delete obj[name.key]
      }
    }
    return obj
  }, true)
  // remove one or more values to create a new array.
  link(Type, 'remove', function (src, fields) {
    // TODO: fields can be another object
    if (!isObject(src)) {
      return null
    }
    var obj = Object.assign(Object.create(src.type.proto), src)
    var names = arguments.length <= 1 ? []
      : Array.prototype.slice.call(arguments, 1)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (typeof name === 'string') {
        delete obj[name]
      } else if (name instanceof Symbol$) {
        delete obj[name.key]
      }
    }
    var activator = src.type.proto.activator
    if (typeof activator === 'function') {
      activator.call(obj, obj)
    }
    return obj
  }, true)

  // check the existence of a property
  link(Type, 'has', function (obj, name) {
    if (typeof name !== 'string') {
      if (name instanceof Symbol$) {
        name = name.key
      } else {
        return false
      }
    }
    return isObject(obj) && typeof obj[name] !== 'undefined'
  }, true)
  // check the existence of a field
  link(Type, 'owns', function (obj, name) {
    if (typeof name !== 'string') {
      if (name instanceof Symbol$) {
        name = name.key
      } else {
        return false
      }
    }
    return isObject(obj) && ownsProperty(obj, name)
  }, true)
  // retrieve field names.
  link(Type, 'fields-of', function (obj) {
    return isObject(obj) ? Object.getOwnPropertyNames(obj) : []
  }, true)

  var proto = Type.proto
  // generate an iterator function to traverse all fields as [name, value].
  link(proto, 'iterate', function () {
    var fields = Object.getOwnPropertyNames(this)
    var obj = this
    var current = null
    var next = 0
    var field
    return function (inSitu) {
      return current !== null && inSitu === true ? current // cached current value
        : next >= fields.length ? null // no more
          : (current = [(field = fields[next++]), obj[field]])
    }
  })

  // Type Verification
  link(proto, 'is-a', function (t) {
    return t === Type
  })
  link(proto, 'is-not-a', function (t) {
    return t !== Type
  })

  // default object emptiness logic
  link(proto, 'is-empty', function () {
    return !(Object.getOwnPropertyNames(this).length > 0)
  })
  link(proto, 'not-empty', function () {
    return Object.getOwnPropertyNames(this).length > 0
  })

  // Encoding
  // encoding logic for all object instances.
  var typeOf = $.type.of
  var toCode = link(proto, 'to-code', function (ctx) {
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this)
    }
    var props = Object.getOwnPropertyNames(this)
    var code = [$Symbol.object]
    for (var i = 0; i < props.length; i++) {
      var name = props[i]
      code.push(encodeFieldName(name), $Symbol.pairing, ctx.encode(this[name]))
    }
    if (code.length < 2) {
      code.push($Symbol.pairing) // (@:) for empty object
    }
    var type = this.type instanceof ClassType$ ? this.type : typeOf(this)
    return ctx.end(this, type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return thisCall(toCode.call(this), 'to-string')
  })

  // Indexer:
  var indexer = link(proto, ':', function (index, value) {
    if (typeof index !== 'string') {
      if (index instanceof Symbol$) {
        index = index.key // use the key of a symbol
      } else {
        return null // unsupported property key.
      }
    }
    return typeof value === 'undefined'
      ? typeof proto[index] === 'undefined' || index === 'type'
        ? this[index] : protoValueOf(this, proto, index) // getting
      : (this[index] = value) // setting
  })
  indexer.get = function (key) {
    return typeof proto[key] === 'undefined' || key === 'type'
      ? this[key] : proto[key] // getting
  }

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  defineTypeProperty(Object.prototype, Type)
}
