'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.object
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var link = $void.link
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var thisCall = $void.thisCall
  var EncodingContext$ = $void.EncodingContext
  var ownsProperty = $void.ownsProperty

  // create an empty object.
  var createObject = link(Type, 'empty', Object.create.bind(Object, Type.proto))

  // create a new object and copy fields from source objects.
  link(Type, 'of', function () {
    var obj = createObject()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (source instanceof Object$ || (source && source.type === Type)) {
        Object.assign(obj, source)
      }
    }
    return obj
  })

  // copy fields from source objects to the target object
  link(Type, 'assign', function (target) {
    if (target instanceof Object$ || (target && target.type === Type)) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        if (source instanceof Object$) {
          Object.assign(target, source)
        }
      }
    }
    return target
  })

  // get the value of a field.
  link(Type, 'get', function (obj, name, value) {
    return (obj instanceof Object$ || (obj && obj.type === Type)) && typeof name === 'string'
      ? typeof obj[name] === 'undefined' ? value : obj[name]
      : value
  })
  // set the value of a field.
  link(Type, 'set', function (obj, name, value) {
    return (obj instanceof Object$ || (obj && obj.type === Type)) && typeof name === 'string'
      ? (obj[name] = (typeof value !== 'undefined' ? value : null))
      : null
  })
  // remove a field.
  link(Type, 'reset', function (obj, name, more) {
    if (!(obj instanceof Object$) && (!obj || obj.type !== Type)) {
      return 0
    }
    if (typeof more === 'undefined') {
      if (typeof name === 'string') {
        return delete obj[name] ? 1 : 0
      }
      return 0
    }
    var i = 1
    var counter = 0
    do {
      if (typeof name === 'string' && (delete this[name])) {
        counter++
      }
      name = arguments[i++]
    } while (i < arguments.length)
    return counter
  })
  // remove all fields.
  link(Type, 'clear', function (obj) {
    if (obj instanceof Object$ || (obj && obj.type === Type)) {
      var names = Object.getOwnPropertyNames(obj)
      for (var i = 0; i < names.length; i++) {
        delete obj[names[i]]
      }
    }
    return obj
  })

  // check the existence of a property
  link(Type, 'has', function (obj, name) {
    return obj instanceof Object$ && typeof name === 'string'
      ? typeof obj[name] !== 'undefined'
      : false
  })
  // check the existence of a field
  link(Type, 'owns', function (obj, name) {
    return obj instanceof Object$ && typeof name === 'string'
      ? ownsProperty(obj, name)
      : false
  })
  // retrieve field names.
  link(Type, 'fields-of', function (obj) {
    return obj instanceof Object$ ? Object.getOwnPropertyNames(obj) : []
  })

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
  link(proto, 'to-code', function (ctx) {
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) {
        return sym
      }
    } else {
      ctx = new EncodingContext$(this)
    }
    var props = Object.getOwnPropertyNames(this)
    var code = [$Symbol.object]
    for (var i = 0; i < props.length; i++) {
      code.push($Symbol.of(props[i]), $Symbol.pairing, thisCall(this[props[i]], 'to-code', ctx))
    }
    if (code.length < 2) {
      code.push($Symbol.pairing)
    }
    return ctx.end(this, Type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return thisCall(thisCall(this, 'to-code'), 'to-string')
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
      ? typeof proto[index] === 'undefined' ? this[index] : proto[index] // getting
      : (this[index] = value) // setting
  })

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  Object.prototype.type = Type // eslint-disable-line no-extend-native
}
