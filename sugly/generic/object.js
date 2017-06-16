'use strict'

function createObjectOf ($void) {
  var Type = $void.$.object
  var Object$ = $void.Object
  var ObjectType$ = $void.ObjectType

  return function () {
    var type = this === Type || this instanceof ObjectType$ ? this : Type
    var obj = Object.create(type.proto)
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      if (src instanceof Object$) {
        Object.assign(obj, src)
      }
    }
    return obj
  }
}

function removeField ($void) {
  var Object$ = $void.Object
  var ownsProperty = $void.ownsProperty

  return function (name) {
    if (name && typeof name === 'string' &&
        this instanceof Object$ && ownsProperty(this, name)) {
      var value = this[name]
      delete this[name]
      return typeof value === 'undefined' ? null : value
    }
    return null
  }
}

function combine (objectOf) {
  return function () {
    var objs = [this]
    Array.prototype.push.apply(objs, arguments)
    return objectOf.apply(null, objs)
  }
}

function merge ($void) {
  var Object$ = $void.Object

  return function () {
    if (this instanceof Object$) {
      for (var i = 0; i < arguments.length; i++) {
        var obj = arguments[i]
        if (obj instanceof Object$) {
          Object.assign(this, obj)
        }
      }
      return this
    }
    return null
  }
}

function copy ($void) {
  var Object$ = $void.Object

  return function () {
    if (this instanceof Object$) {
      var obj = Object.create(Object.getPrototypeOf(this))
      Object.assign(obj, this)
      return obj
    }
    return null
  }
}

function iterator ($void) {
  var Object$ = $void.Object

  return function () {
    if (!(this instanceof Object$)) {
      return null
    }
    var fields = Object.getOwnPropertyNames(this)
    var index = 0
    return function (inSitu) {
      if (index >= fields.length) {
        return null
      }
      return typeof inSitu !== 'undefined' && inSitu !== false && inSitu !== null && inSitu !== 0
        ? fields[index] : fields[index++]
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
  var Tuple$ = $void.Tuple
  var Object$ = $void.Object
  var thisCall = $void.thisCall
  var ObjectType$ = $void.ObjectType
  var CodingContext$ = $void.CodingContext
  var typeIndexer = $void.typeIndexer
  var ownsProperty = $void.ownsProperty
  var nativeIndexer = $void.nativeIndexer
  var encodingTypeOf = $void.encodingTypeOf

  // create an empty object.
  link(Type, 'empty', function () {
    return new Object$()
  })

  // create a new object and copy properties from source objects.
  var objectOf = link(Type, 'of', createObjectOf($void))

  // Indexer for object type itself.
  typeIndexer(Type)

  var proto = Type.proto
  // to create a shallow copy of this instance with the same type.
  link(proto, 'copy', copy($void))

  // generate an iterator function
  link(proto, 'iterate', iterator($void))

  // generate a new object by comine this object and other objects.
  link(proto, '+', combine(objectOf))

  // shallowly copy fields from other objects to this object.
  link(proto, '+=', merge($void))

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
  var setField = link(proto, 'set-field', function (name, value) {
    return this instanceof Object$ && typeof name === 'string' &&
        name && name !== ':' && name !== 'type' && name !== 'to-code'
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
  var getProperty = link(proto, 'get-property', function (name) {
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
  link(proto, '==', function object$oprEquals (another) {
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
    return t === type || t === Type || (isPrototypeOf(Type, t) &&
      isPrototypeOf(t, type) && ownsProperty(t, 'proto'))
  }, 'is-not-a', function (t) {
    var type = typeOf(this)
    return t !== type && t !== Type && (!isPrototypeOf(Type, t) ||
      !isPrototypeOf(t, type) || ownsProperty(t, 'proto'))
  })
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
  // an overriable method to report the expected encoding type.
  link(proto, 'encoding-type', null)
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
    // customized objects can replace its type in encoding.
    var type = encodingTypeOf(
      typeof this['encoding-type'] === 'function'
        ? this['encoding-type']() : this.type
    )
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
    var list = [$Symbol.object, $Symbol.pairing] // (@: ...
    if (type !== Type) { // a special object
      list.push(type['to-code']()) // (@:type)
    }
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i]
      var value = obj[name]
      var vtype = typeOf(value)
      var code = vtype === Type || vtype instanceof ObjectType$
        ? thisCall(value, 'to-code', ctx) : thisCall(value, 'to-code')
      list.push($Symbol.of(name), $Symbol.pairing, code)
    }
    return ctx.complete(obj, new Tuple$(list))
  }

  // Description
  link(proto, 'to-string', function () {
    if (!(this instanceof Object$)) {
      return this && typeof this === 'object' ? '(@:genric)' : null
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
    })
    fields.push(')')
    return fields.join('\n')
  })

  // Indexer:
  // an object can provide a customized indexer.
  link(proto, 'indexer', null)
  nativeIndexer(Type, Object, Object$, function (name, value) {
    if (!(this instanceof Object$) || name === ':') {
      return null
    }
    // global static properties.
    if (name === 'type') {
      return this.type
    } else if (name === 'to-code') {
      return this.type.proto['to-code'] // to keep the to-code mechanisim consistent.
    }
    // try to forward to user's indexer
    if (typeof this.indexer === 'function') {
      return this.indexer(name, value)
    }
    // default read/write behaviour
    return !name || typeof name !== 'string' ? null
      : typeof value === 'undefined'
        ? getProperty.call(this, name, value)
        : setField.call(this, name, value)
  })
}
