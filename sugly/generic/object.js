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
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var link = $void.link
  var typeOf = $void.typeOf
  var Symbol$ = $void.Symbol
  var Tuple$ = $void.Tuple
  var Object$ = $void.Object
  var thisCall = $void.thisCall
  var ObjectType$ = $void.ObjectType
  var CodingContext$ = $void.CodingContext
  var typeIndexer = $void.typeIndexer
  var ownsProperty = $void.ownsProperty
  var typeEncoder = $void.typeEncoder
  var protoIndexer = $void.protoIndexer
  var encodingTypeOf = $void.encodingTypeOf

  // create an empty object.
  link(Type, 'empty', function () {
    return new Object$()
  })

  // create a new object and copy fields from source objects.
  link(Type, 'of', function () {
    var obj = new Object$()
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
      return target
    }
    return null
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
  // check the existence of a field
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

  // Identity: override the operator and negative logic to use the primary one.
  link(proto, '===', function (another) {
    return thisCall(this, 'is', another) === true
  })
  link(proto, ['is-not', '!=='], function (another) {
    return thisCall(this, 'is', another) !== true
  })
  // Equivalence: override the operator and negative logic to use the primary one.
  link(proto, '==', function (another) {
    return thisCall(this, 'equals', another) === true
  })
  // orverride the negative testing to use the positive one.
  link(proto, ['not-equals', '!='], function (another) {
    return thisCall(this, 'equals', another) !== true
  })

  // Type Verification
  link(proto, 'is-a', function (t) {
    return t === Type || t === typeOf(this)
  }, 'is-not-a', function (t) {
    return thisCall(this, 'is-a', t) !== true
  })

  // default object emptiness logic
  link(proto, 'is-empty', function () {
    return this instanceof Object$ || typeOf(this) === Type
      ? Object.getOwnPropertyNames(this).length < 1 : null
  }, 'not-empty', function () {
    return thisCall(this, 'is-empty') !== true
  })

  // Encoding
  // add an overridable method to report persistent fields.
  // null: to be encoded to as null.
  //   []: an empty arrry indicates to be encoded to an empty object.
  link(proto, 'resolve', null)
  // encoding logic for all object instances.
  link(proto, 'to-code', function (ctx) {
    if (!(this instanceof Object$)) {
      return null // illegal call.
    }
    // customized objects can hide some or all fields.
    var fields = typeof this.resolve === 'function'
      ? this.resolve() : Object.getOwnPropertyNames(this)
    if (!Array.isArray(fields)) {
      return null // this is an volatile entity.
    }
    var type = encodingTypeOf(this.type)
    // an empty object.
    if (fields.length < 1) {
      return type === Type ? $Tuple.object
        : $Tuple.of($Symbol.object, $Symbol.pairing, type['to-code']())
    }
    // this is a compound object.
    if (ctx instanceof CodingContext$) {
      var sym = ctx.touch(this, type)
      if (sym) {
        return sym
      }
      return encodeObject(ctx, this, type, fields)
    } else { // as root
      ctx = new CodingContext$()
      ctx.touch(this, type)
      var code = encodeObject(ctx, this, type, fields)
      return ctx.final(code)
    }
  })

  function encodeObject (ctx, obj, type, fields) {
    var list = [$Symbol.object] // (@ ...
    var typed = false
    if (type !== Type) { // a special object
      typed = true
      list.push($Symbol.pairing, type['to-code']()) // (@:type ...)
    }
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i]
      var value = obj[name]
      var code = thisCall(value, 'to-code', ctx)
      list.push($Symbol.of(name), $Symbol.pairing, code)
    }
    if (typed && ctx.isReferred(obj)) { // nested reference.
      list.splice(1, 2) // downgrade to a common data object.
    }
    return ctx.complete(obj, new Tuple$(list))
  }

  // Description
  link(proto, 'to-string', function () {
    if (!(this instanceof Object$)) {
      return this === proto ? '(object proto)' : null
    }
    // type
    var fields = ['(@']
    if (this.type !== Type) {
      fields.push(':' + this.type['to-string']())
    }
    // fields
    Object.getOwnPropertyNames(this).forEach(function (name) {
      var value = this[name]
      var valueType = typeOf(value)
      if (valueType === Type || valueType instanceof ObjectType$) {
        // prevent recursive call.
        fields.push('  ' + name + ': (@:' + valueType['to-string']() + ' ... )')
      } else {
        fields.push('  ' + name + ': ' + thisCall(value, 'to-string'))
      }
    }, this)
    if (fields.length < 2) {
      fields[0] = '(@:'
    }
    fields.push(')')
    return fields.length > 2 ? fields.join('\n') : fields.join(' ')
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
