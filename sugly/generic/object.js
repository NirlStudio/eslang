'use strict'

function createObjectOf ($void) {
  var Object$ = $void.Object
  var thisCall = $void.thisCall
  var staticObjectFields = $void.staticObjectFields

  return function () {
    var obj = new Object$()
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      var next = typeof source === 'function'
        ? source : thisCall(source, 'iterate')
      if (typeof next === 'function') {
        var item = next()
        while (typeof item !== 'undefined' && item !== null) {
          if (Array.isArray(item) && item.length > 0) {
            var key = item[0]
            var value
            if (item.length > 1) {
              value = item[1]
            } else if (Array.isArray(key) && key.length > 1) {
              value = key[1]
              key = key[0]
            } else {
              key = null
            }
            if (typeof key === 'string' && !staticObjectFields[key]) {
              obj[key] = value // only accept string keys.
            }
          }
          item = next()
        }
      }
    }
    return obj
  }
}

function iterator ($void) {
  var Object$ = $void.Object

  return function () {
    if (!(this instanceof Object$)) {
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

function removeField ($void) {
  var Object$ = $void.Object
  var ownsProperty = $void.ownsProperty

  return function (name) {
    if (name && typeof name === 'string' && this instanceof Object$ &&
        this['is-readonly'] !== true && ownsProperty(this, name)) {
      var value = this[name]
      delete this[name]
      return typeof value === 'undefined' ? null : value
    }
    return null
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.object
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var link = $void.link
  var typeOf = $void.typeOf
  var Type$ = $void.Type
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
  var isPrototypeOf = $void.isPrototypeOf
  var encodingTypeOf = $void.encodingTypeOf

  // create an empty object.
  link(Type, 'empty', function object$empty () {
    return new Object$()
  })

  // create a new object with the name/value pairs from iterable arguments.
  link(Type, 'of', createObjectOf($void))

  // set the value of a field.
  link(Type, 'set', function (obj, name, value) {
    return obj instanceof Object$ && typeof name === 'string'
      ? (obj[name] = (typeof value !== 'undefined' ? value : null)) : null
  })
  // remove a field.
  link(Type, 'unset', function (obj, name) {
    if (obj instanceof Object$ && typeof name === 'string' && typeof obj[name] !== 'undefined') {
      var value = obj[name]
      delete obj[name]
      return value
    }
  })
  // get the value of a field.
  link(Type, 'get', function (obj, name, value) {
    return obj instanceof Object$ && typeof name === 'string' ? obj[name] : null
  })

  // TODO - move all instance methods to static, keep object is empty

  // to-code & to-string
  typeEncoder(Type)

  // override type indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate an iterator function to traverse all fields as [name, value].
  link(proto, 'iterate', iterator($void))

  // restore this object with the fields from the source object.
  var copyFrom = link(proto, [
    'copy-from', '='
  ], function (source, names, excluding) {
    if (!(this instanceof Object$)) {
      return null
    }
    if (!(source instanceof Object$)) {
      return this
    }
    // by default, copy all fields.
    if (!Array.isArray(names)) {
      Object.assign(this, source)
    } else { // or, copy selected fields or nothing.
      for (var i = 0; i < names.length; i++) {
        var name = names[i]
        if (typeof name === 'string' && ownsProperty(source, name)) {
          this[name] = source[name]
        }
      }
    }
    // remove excluded fields.
    if (Array.isArray(excluding) && excluding.length > 0) {
      for (i = 0; i < excluding.length; i++) {
        name = excluding[i]
        if (typeof name === 'string') {
          delete this[name]
        }
      }
    }
    // trigger copied event.
    if (typeof this.copied === 'function') {
      this.copied(source)
    }
    return this
  })

  // to create a shallow copy of this instance of all or selected fields.
  var makeCopy = link(proto, 'copy', function (names, excluding) {
    if (this instanceof Object$) {
      // keep the same type
      return copyFrom.apply(Object.create(Object.getPrototypeOf(this)),
        [this, names, excluding])
    }
    return null
  })

  // copy fields from argument objects to this object.
  var includeFrom = link(proto, '+=', function () {
    if (this instanceof Object$) {
      for (var i = 0; i < arguments.length; i++) {
        var src = arguments[i]
        if (src instanceof Object$) {
          Object.assign(this, src)
        }
      }
      return this
    }
    return null
  })

  // generate a new object by combine of this object and argument objects.
  link(proto, '+', function () {
    // copy this object.
    var copy = makeCopy.call(this)
    // include fields from argument objects.
    return copy ? includeFrom.apply(copy, arguments) : null
  })

  // object property & field (owned property) manipulation
  // retrieve field names
  link(proto, 'get-fields', function () {
    return this instanceof Object$ ? Object.getOwnPropertyNames(this) : []
  })
  // test the existence by a field name
  link(proto, 'has-field', function (name) {
    return this instanceof Object$ && typeof name === 'string' && name !== ':'
      ? ownsProperty(this, name) : false
  })
  // retrieve the value of a field
  link(proto, 'get-field', function (name) {
    return this instanceof Object$ && typeof name === 'string' && name !== ':' &&
      typeof this[name] !== 'undefined' && ownsProperty(this, name)
        ? this[name] : null
  })
  // set the value of a field
  link(proto, 'set-field', function (name, value) {
    return this instanceof Object$ && typeof name === 'string' &&
        name && name !== ':' && name !== 'type' && name !== 'to-code' && this['is-readonly'] !== true
      ? (this[name] = (typeof value === 'undefined' ? null : value))
      : null
  })
  // remove a field from an object
  link(proto, 'remove-field', removeField($void))

  // test if a property (either owned or inherited) exists
  link(proto, 'has-property', function (name) {
    return (this instanceof Object$ || typeOf(this) instanceof ObjectType$) &&
        typeof name === 'string' && name !== ':'
      ? typeof this[name] !== 'undefined' : false
  })
  // retrieve the value of a property
  link(proto, 'get-property', function (name) {
    return (this instanceof Object$ || typeOf(this) instanceof ObjectType$) &&
        typeof name === 'string' && name !== ':' &&
      typeof this[name] !== 'undefined' ? this[name] : null
  })

  // test if a property exists and is an operation
  link(proto, 'has-operation', function (name) {
    return (this instanceof Object$ || typeOf(this) instanceof ObjectType$) &&
        typeof name === 'string' && name !== ':'
      ? typeof this[name] === 'function'
      : false
  })
  // retrieve a property if it's an operation.
  link(proto, 'get-operation', function (name) {
    return (this instanceof Object$ || typeOf(this) instanceof ObjectType$) &&
        typeof name === 'string' && name !== ':' &&
      typeof this[name] === 'function' ? this[name] : null
  })

  // Identity: override the negative logic to use current positive one.
  link(proto, 'is-not', function (another) {
    return this && typeof this.is === 'function'
      ? this.is(another) : !Object.is(this, another)
  })
  // Equivalence: override the operator to use current equals function.
  link(proto, '==', function (another) {
    return this && typeof this.equals === 'function'
      ? this.equals(another) : Object.is(this, another)
  })
  // orverride the negative testing to use the positive one.
  link(proto, ['not-equals', '!='], function (another) {
    return this && typeof this.equals === 'function'
      ? this.equals(another) : !Object.is(this, another)
  })

  // Type Verification
  link(proto, 'is-a', function (t) {
    var type = typeOf(this)
    return t === type || t === Type ||
      (t instanceof Type$ && isPrototypeOf(t, type))
  }, 'is-not-a')

  // check if this object complys to a template object.
  link(proto, 'as', function (template) {
    if (!(this instanceof Object$) || !(template instanceof Object$)) {
      return false
    }
    var fields = Object.getOwnPropertyNames(template)
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i]
      var value = this[field]
      if (typeof value === 'undefined' || value === null) {
        return false
      }
      var tvalue = template[field]
      if (tvalue !== null) {
        var type = typeOf(value)
        if (!thisCall(type, 'is-of', tvalue) &&
          !thisCall(type, 'is-of', typeOf(tvalue))) {
          return false
        }
      }
    }
    return true
  })

  // default object emptiness logic
  link(proto, 'is-empty', function () {
    return this instanceof Object$
      ? Object.getOwnPropertyNames(this).length < 1 : null
  }, 'not-empty', function () { // use the positive function if it does exist.
    return this && typeof this['is-empty'] === 'function' ? this['is-empty']()
      : this instanceof Object$
        ? Object.getOwnPropertyNames(this).length > 0 : null
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
