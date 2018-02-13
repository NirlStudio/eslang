'use strict'

function iterator ($void) {
  var typeOf = $void.typeOf
  var Object$ = $void.Object
  var $Object = $void.$.object

  return function () {
    if (!(this instanceof Object$) && typeOf(this) !== $Object) {
      return null
    }
    var fields = Object.getOwnPropertyNames(this)
    var obj = this
    var current = null
    var next = 0
    return function (inSitu) {
      if (current !== null && typeof inSitu !== 'undefined' && inSitu !== false &&
          inSitu !== null && inSitu !== 0) {
        return current // cached current value
      }
      if (next >= fields.length) {
        return null // no more
      }
      var field = fields[next++]
      return (current = [field, obj[field]])
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.object
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var link = $void.link
  var typeOf = $void.typeOf
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var thisCall = $void.thisCall
  var EncodingContext$ = $void.EncodingContext
  var typeIndexer = $void.typeIndexer
  var ownsProperty = $void.ownsProperty
  var typeEncoder = $void.typeEncoder
  var protoIndexer = $void.protoIndexer

  // create an empty object.
  var createObject = link(Type, 'empty', Object.create.bind(Object, Type.proto))

  // create a new object and copy fields from source objects.
  link(Type, 'of', function () {
    var obj = createObject()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (source instanceof Object$ || typeOf(source) === Type) {
        Object.assign(obj, source)
      }
    }
    return obj
  })

  // copy fields from source objects to the target object
  link(Type, 'assign', function (target) {
    if (target instanceof Object$ || typeOf(target) === Type) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]
        if (source instanceof Object$ || typeOf(source) === Type) {
          Object.assign(target, source)
        }
      }
    }
    return target
  })

  // get the value of a field.
  link(Type, 'get', function (obj, name, value) {
    return (obj instanceof Object$ || typeOf(obj) === Type) && typeof name === 'string'
      ? typeof value === 'undefined' ? obj[name]
        : typeof obj[name] === 'undefined' ? value : obj[name]
      : null
  })
  // set the value of a field.
  link(Type, 'set', function (obj, name, value) {
    return (obj instanceof Object$ || typeOf(obj) === Type) && typeof name === 'string'
      ? (obj[name] = (typeof value !== 'undefined' ? value : null))
      : null
  })
  // remove a field.
  link(Type, 'unset', function (obj, name) {
    if ((obj instanceof Object$ || typeOf(obj) === Type) &&
        typeof name === 'string' && ownsProperty(obj, name)
    ) {
      var value = obj[name]
      delete obj[name]
      return value
    }
  })

  // check the existence of a property
  link(Type, 'has', function (obj, name) {
    return (obj instanceof Object$ || typeOf(obj) === Type) && typeof name === 'string'
      ? typeof obj[name] !== 'undefined'
      : null
  })
  // check the existence of a field
  link(Type, 'owns', function (obj, name) {
    return (obj instanceof Object$ || typeOf(obj) === Type) && typeof name === 'string'
      ? ownsProperty(obj, name)
      : null
  })
  // retrieve field names.
  link(Type, 'fields-of', function (obj) {
    return obj instanceof Object$ || typeOf(obj) === Type
      ? Object.getOwnPropertyNames(obj)
      : null
  })

  // to-code & to-string
  typeEncoder(Type)

  // override type indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate an iterator function to traverse all fields as [name, value].
  link(proto, 'iterate', iterator($void))

  // Type Verification
  link(proto, 'is-a', function (t) {
    return t === Type
  }, 'is-not-a', function (t) {
    return t !== Type
  })

  // default object emptiness logic
  link(proto, 'is-empty', function () {
    return this instanceof Object$ || typeOf(this) === Type
      ? !(Object.getOwnPropertyNames(this).length > 0) : null
  }, 'not-empty', function () {
    return this instanceof Object$ || typeOf(this) === Type
      ? Object.getOwnPropertyNames(this).length > 0 : null
  })

  // Encoding
  // encoding logic for all object instances.
  link(proto, 'to-code', function (ctx) {
    if (this === proto) {
      return null
    }
    console.log('to-code', this)
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
      code.push($Symbol.of(props[i]), thisCall(this[props[i]], 'to-code', ctx))
    }
    if (code.length < 2) {
      code.push($Symbol.pairing)
    }
    return ctx.end(this, typeOf(this), new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return this === proto ? '(object proto)'
      : thisCall(thisCall(this, 'to-code'), 'to-string')
  })

  // Indexer:
  // an object can provide a customized indexer.
  protoIndexer(Type, function (name, value) {
    if (!(this instanceof Object$) && typeOf(this) !== Type) {
      return null
    }
    // try to forward to user's indexer
    if (ownsProperty(this, ':') && typeof this[':'] === 'function') {
      return this[':'].apply(this, arguments)
    }
    // default read/write behaviour
    if (typeof name !== 'string') {
      if (name instanceof Symbol$) {
        name = name.key // use the key of a symbol
      }
      return null // invalid property key.
    }
    return typeof value === 'undefined'
      ? this[name] // getting
      : (this[name] = value) // setting
  })

  // inject type
  Object.prototype.type = Type // eslint-disable-line no-extend-native
}
