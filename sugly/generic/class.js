'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.class
  var $Type = $.type
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Object = $.object
  var link = $void.link
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Object$ = $void.Object
  var typeOf = $void.typeOf
  var ClassType$ = $void.ClassType
  var InstanceType$ = $void.InstanceType$
  var createClass = $void.createClass
  var ownsProperty = $void.ownsProperty
  var typeIndexer = $void.typeIndexer
  var sharedSymbolOf = $void.sharedSymbolOf
  var initializeType = $void.initializeType
  var EncodingContext$ = $void.EncodingContext

  // initialize the meta class.
  initializeType(Type, createClass)

  // define a class by classes and/or class descriptors.
  link(Type, 'of', function () {
    return as.apply(createClass(), arguments)
  })

  // copy fields from source objects to the target class instance or an object.
  link(Type, 'attach', function (target) {
    if (target instanceof Object$) {
      for (var i = 1; i < arguments.length; i++) {
        $Object.assign(target, arguments[i])
        activate.call(target, arguments[i])
      }
    }
    return target
  })

  // get the value of a field.
  link(Type, 'get', function (obj, name, value) {
    return obj instanceof ClassType$ && typeof name === 'string'
      ? typeof value === 'undefined' ? obj[name]
        : typeof obj[name] === 'undefined' ? value : obj[name]
      : null
  })
  // set the value of a field.
  link(Type, 'set', function (obj, name, value) {
    return obj instanceof ClassType$ && typeof name === 'string'
      ? (obj[name] = (typeof value !== 'undefined' ? value : null))
      : null
  })
  // remove a field.
  link(Type, 'unset', function (obj, name) {
    if (obj instanceof ClassType$ && typeof name === 'string' && ownsProperty(obj, name)) {
      var value = obj[name]
      delete obj[name]
      return value
    }
  })

  // check the existence of a property
  link(Type, 'has', function (obj, name) {
    return obj instanceof ClassType$ && typeof name === 'string'
      ? typeof obj[name] !== 'undefined' : null
  })
  // check the existence of a field
  link(Type, 'owns', function (obj, name) {
    return obj instanceof ClassType$ && typeof name === 'string'
      ? ownsProperty(obj, name) : null
  })
  // retrieve field names.
  link(Type, 'fields-of', function (obj) {
    return obj instanceof ClassType$ ? Object.getOwnPropertyNames(obj) : null
  })

  // the prototype of classes
  var proto = Type.proto

  // generate an empty instance.
  link(proto, 'empty', function () {
    return this instanceof ClassType$ ? Object.create(this.proto) : null
  })

  // make this class to act as other classes and/or class descriptors.
  var as = link(proto, 'as', function () {
    if (this instanceof ClassType$) {
      for (var i = 0; i < arguments.length; i++) {
        var parent = arguments[i]
        if (parent instanceof ClassType$) {
          Object.assign(this, parent)
          Object.assign(this.proto, parent.proto)
        } else if (parent instanceof Object$ || typeOf(parent) === $Object) {
          Object.assign(this, parent)
          if (parent.proto instanceof Object$ || typeOf(parent.proto) === $Object) {
            Object.assign(this.proto, parent.proto)
          }
        }
      }
    }
    return this
  })

  // static construction: create an instance by arguments.
  link(proto, 'of', function () {
    return this instanceof ClassType$
      ? construct.apply(Object.create(this.proto), arguments) : null
  })

  // static activation: restore an instance by one or more property set.
  link(proto, 'with', function () {
    if (this instanceof ClassType$) {
      var inst = Object.create(this.proto)
      for (var i = 0; i < arguments.length; i++) {
        $Object.assign(inst, arguments[i])
        activate.call(inst, arguments[i])
      }
      return inst
    }
  })

  // Type Verification: a class is a class and a type.
  link(proto, 'is-a', function (type) {
    return type === Type || type === $Type
  })
  link(proto, 'is-not-a', function (type) {
    return type !== Type && type !== $Type
  })

  // Emptiness: shared by all classes.
  link(proto, 'is-empty', function () {
    return this instanceof ClassType$
      ? Object.getOwnPropertyNames(this.proto).length < 1 : null
  })
  link(proto, 'not-empty', function () {
    return this instanceof ClassType$
      ? Object.getOwnPropertyNames(this.proto).length > 0 : null
  })

  // convert a class (type) to a common object (data).
  link(proto, 'to-object', function () {
    if (this instanceof ClassType$) {
      var obj = Object.assign($Object.empty(), this)
      obj.proto = Object.assign($Object.empty(), obj.proto)
      return obj
    }
  })

  // Encoding
  link(proto, 'to-code', function () {
    return typeof this.name === 'string' ? sharedSymbolOf(this.name) : $Symbol.empty
  })

  // Description
  link(proto, 'to-string', function () {
    return typeof this.name === 'string' ? this.name : '?class'
  })

  typeIndexer(proto)

  // the prototype of class instances
  var instance = proto.proto

  // root instance constructor
  var construct = link(instance, 'constructor', function () {
    if (this instanceof InstanceType$) {
      if (typeof this.constructor === 'function' && this.constructor !== construct) {
        // apply constructor
        this.constructor.apply(this, arguments)
      } else { // behave like (object assign this ...)
        var args = [this]
        Array.prototype.push.apply(args, arguments)
        $Object.assign.apply($Object, args)
      }
    }
    return this
  })

  // root instance activator: accept a plain object and apply the activator logic too.
  var activate = link(instance, 'activator', function (source) {
    if (typeof this.activator === 'function' && this.activator !== activate) {
      this.activator(source)
    }
    return this
  })

  // Enable the customization of Identity.
  var is = link(instance, 'is', function (another) {
    return this.is !== is ? this.is(another) === true : Object.is(this, another)
  })
  link(instance, '===', function (another) {
    return is.call(this, another)
  })
  link(instance, ['is-not', '!=='], function (another) {
    return !is.call(this, another)
  })

  // Enable the customization of Ordering.
  var compare = link(instance, 'compare', function (another) {
    if (this.compare === compare) {
      return Object.is(this, another) ? 0 : null
    }
    switch (this.compare(another)) {
      case 0:
        return 0
      case 1:
        return 1
      case -1:
        return -1
      default:
        return null
    }
  })

  // Enable the customization of Equivalence.
  var equals = link(instance, 'equals', function (another) {
    return this.equals === equals
      ? Object.is(this, another) : this.equals(another) === true
  })
  link(instance, '==', function (another) {
    return equals.call(this, another)
  })
  link(instance, ['not-equals', '!='], function (another) {
    return !equals.call(this, another)
  })

  // Emptiness: allow customization.
  var isEmpty = link(instance, 'is-empty', function () {
    var overriding = this['is-empty']
    return overriding === isEmpty
      ? Object.getOwnPropertyNames(this).length < 1
      : overriding.call(this) === true
  })
  link(instance, 'not-empty', function () {
    return !isEmpty.call(this)
  })

  // Type Verification
  var isA = link(instance, 'is-a', function (t) {
    var overriding = this['is-a']
    return overriding === isA ? this.type === t : overriding.call(this, t) === true
  })
  link(instance, 'is-not-a', function (t) {
    return !isA.call(this, t)
  })

  // Enable the customization of Encoding.
  var toCode = link(instance, 'to-code', function (ctx) {
    var overriding = this['to-code']
    if (overriding === toCode) {
      return $Object.proto['to-code'].call(this, ctx)
    }
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) {
        return sym
      }
    } else {
      ctx = new EncodingContext$(this)
    }
    var code = overriding.call(this)
    return ctx.end(this, typeOf(this),
      code instanceof Tuple$ ? code : $Tuple.object)
  })

  // Enable the customization of Description.
  var toString = link(instance, 'to-string', function () {
    var overriding = this['to-string']
    return overriding === toString
      ? toCode.call(this)['to-string']()
      : overriding.apply(this, arguments)
  })

  var indexer = link(instance, ':', function (name, value) {
    if (this === instance) { // common class instance
      if (name instanceof Symbol$) {
        name = name.key
      }
      return typeof name !== 'string' ? null
        : typeof value === 'undefined'
          ? instance[name] // getting
          : typeof proto[name] !== 'undefined' ? proto[name] // no overriding
            : (proto[name] = value) // extending is allowed
    }
    // class instance proto & class instances
    var overriding = this[':']
    if (overriding === indexer || typeof overriding !== 'function') {
      overriding = null
    }
    if (typeof value === 'undefined') { // getting
      if (typeof name !== 'string') {
        return overriding ? overriding.call(this, name) : null
      }
      value = instance[name] // common class instance proto.
      return typeof value !== 'undefined' ? value
        : overriding ? overriding.call(this, name) : this[name]
    }
    // setting or customized indexer
    return overriding ? overriding.apply(this, arguments)
      : typeof name === 'string' ? (this[name] = value) : null
  })
}
