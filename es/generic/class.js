'use strict'

module.exports = function classIn ($void) {
  var $ = $void.$
  var Type = $.class
  var $Type = $.type
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Object = $.object
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var ClassType$ = $void.ClassType
  var ClassInst$ = $void.ClassInst
  var link = $void.link
  var typeOf = $void.typeOf
  var bindThis = $void.bindThis
  var isObject = $void.isObject
  var thisCall = $void.thisCall
  var boolValueOf = $void.boolValueOf
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable
  var ownsProperty = $void.ownsProperty
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf
  var EncodingContext$ = $void.EncodingContext

  // initialize the meta class.
  link(Type, 'empty', createClass, true)

  // define a class by classes and/or class descriptors.
  link(Type, 'of', function () {
    return as.apply(createClass(), arguments)
  }, true)

  // copy fields from source objects to the target class instance or an object.
  var objectAssign = $Object.assign
  link(Type, 'attach', function (target) {
    if (target instanceof ClassInst$) {
      for (var i = 1; i < arguments.length; i++) {
        var src = arguments[i]
        if (isObject(src)) {
          Object.assign(target, src)
          activate.call(target, src)
        }
      }
      return target
    }
    // fallback to object assign for the class may not exist on target context.
    return objectAssign.apply($Object, arguments)
  }, true)

  // the prototype of classes
  var proto = Type.proto

  // generate an empty instance.
  link(proto, 'empty', function () {
    return Object.create(this.proto)
  })

  // generate an instance without arguments.
  link(proto, 'default', function () {
    return construct.call(Object.create(this.proto))
  })

  // static construction: create an instance by arguments.
  link(proto, 'of', function () {
    return construct.apply(Object.create(this.proto), arguments)
  })

  // static activation: restore an instance by one or more property set.
  link(proto, 'from', function () {
    var inst = Object.create(this.proto)
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      if (isObject(src)) {
        Object.assign(inst, src)
        activate.call(inst, src)
      }
    }
    return inst
  })

  // make this class to act as other classes and/or class descriptors.
  var isAtom = $Tuple.accepts
  var as = link(proto, 'as', function () {
    if (Object.isFrozen(this)) {
      return this
    }
    var type_ = Object.create(null)
    var proto_ = Object.create(null)
    var args = Array.prototype.slice.call(arguments)
    for (var i = 0; i < args.length; i++) {
      var src = args[i]
      var t, p
      if (src instanceof ClassType$) {
        t = src
        p = src.proto
      } else if (isObject(src)) {
        p = src
        if (isObject(src.type)) {
          t = src.type
        } else {
          if (src.type instanceof ClassType$) {
            args.splice(i + 1, 0, src.type)
          }
          t = {}
        }
      } else {
        t = {}; p = {}
      }
      var j, key
      var names = Object.getOwnPropertyNames(t)
      for (j = 0; j < names.length; j++) {
        key = names[j]
        if (key === 'indexer') {
          // allow customized indexer for class
          !ownsProperty(proto_, ':') && isApplicable(t.indexer) && (
            proto_[':'] = t.indexer
          )
        } else if ((typeof this[key] === 'undefined') &&
          !ownsProperty(type_, key)
        ) {
          if (key !== 'name' || !(t instanceof ClassType$)) {
            // not to copy a type's name, but copy a definition name field
            type_[key] = t[key]
          }
        }
      }
      names = Object.getOwnPropertyNames(p)
      var value
      for (j = 0; j < names.length; j++) {
        key = names[j]
        if (key !== 'type' && !ownsProperty(this.proto, key) && !ownsProperty(proto_, key)) {
          value = p[key]
          proto_[key] = isAtom(value) || (typeof value === 'function') ? value : null
        }
      }
    }
    Object.assign(this, type_)
    Object.assign(this.proto, proto_)
    return this
  })

  // Convert this class's definition to a type descriptor object.
  var toObject = link(proto, 'to-object', function () {
    var typeDef = $Object.empty()
    var names = Object.getOwnPropertyNames(this.proto)
    var i, name, value, thisEmpty
    for (i = 0; i < names.length; i++) {
      name = names[i]
      if (name !== 'type') {
        value = this.proto[name]
        typeDef[name] = !isApplicable(value) ? value
          : thisCall(value, 'bind', typeof thisEmpty !== 'undefined'
            ? thisEmpty : (thisEmpty = this.empty())
          )
      }
    }
    var typeStatic = $Object.empty()
    var hasStatic = false
    names = Object.getOwnPropertyNames(this)
    for (i = 0; i < names.length; i++) {
      name = names[i]
      if (name !== 'proto') {
        value = this[name]
        typeStatic[name] = !isApplicable(value) ? value
          : thisCall(value, 'bind', this)
        hasStatic = true
      }
    }
    hasStatic && (typeDef.type = typeStatic)
    return typeDef
  })

  // Mutability
  link(proto, 'seal', function () {
    return Object.freeze(this)
  })
  link(proto, 'is-sealed', function () {
    return Object.isFrozen(this)
  })

  // Type Verification: a class is a class and a type.
  link(proto, ['is-a', 'is-an'], function (type) {
    return type === Type || type === $Type
  })
  link(proto, ['is-not-a', 'is-not-an'], function (type) {
    return type !== Type && type !== $Type
  })

  // Emptiness: shared by all classes.
  link(proto, 'is-empty', function () {
    return !(Object.getOwnPropertyNames(this.proto).length > 1) && !(
      Object.getOwnPropertyNames(this).length > (
        ownsProperty(this, 'name') ? 2 : 1
      )
    )
  })
  link(proto, 'not-empty', function () {
    return Object.getOwnPropertyNames(this.proto).length > 1 || (
      Object.getOwnPropertyNames(this).length > (
        ownsProperty(this, 'name') ? 2 : 1
      )
    )
  })

  // Encoding
  var protoToCode = link(proto, 'to-code', function () {
    return typeof this.name === 'string' && this.name
      ? sharedSymbolOf(this.name.trim()) : $Symbol.empty
  })

  // Description
  var symbolClass = sharedSymbolOf('class')
  var symbolOf = sharedSymbolOf('of')
  var objectToCode = $Object.proto['to-code']
  var tupleToString = $Tuple.proto['to-string']
  link(proto, 'to-string', function () {
    var code = protoToCode.call(this)
    if (code !== $Symbol.empty) {
      return thisCall(code, 'to-string')
    }
    code = objectToCode.call(toObject.call(this))
    if (code.$[0] === $Symbol.literal) {
      code.$[1] === $Symbol.pairing ? code.$.splice(2, 0, symbolClass)
        : code.$.splice(1, 0, $Symbol.pairing, symbolClass)
    } else {
      code = new Tuple$([symbolClass, symbolOf, code])
    }
    return tupleToString.call(code)
  })

  // the prototype of class instances
  var instance = proto.proto

  // root instance constructor
  var construct = link(instance, 'constructor', function () {
    if (this.constructor !== construct) {
      this.constructor.apply(this, arguments)
    } else { // behave like (object assign this ...)
      var args = [this]
      args.push.apply(args, arguments)
      $Object.assign.apply($Object, args)
    }
    return this
  })

  // root instance activator: accept a plain object and apply the activator logic too.
  var activate = link(instance, 'activator', function (source) {
    if (this.activator !== activate) {
      this.activator(source)
    }
    return this
  })

  // Generate a persona to act like another class.
  link(instance, 'as', function (cls, member) {
    if (!(cls instanceof ClassType$)) {
      return null
    }
    if (member instanceof Symbol$) {
      member = member.key
    } else if (typeof member !== 'string' || !member) {
      member = null
    }

    var value
    if (member) {
      value = cls.proto[member]
      return isApplicable(value) ? bindThis(this, value) : value
    }

    var names = Object.getOwnPropertyNames(cls.proto)
    var persona = Object.create($Object.proto)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      value = cls.proto[name]
      persona[name] = isApplicable(value) ? bindThis(this, value) : value
    }
    return persona
  })

  // Enable the customization of Identity.
  var is = link(instance, ['is', '==='], function (another) {
    return (this === another) || (
      this.is !== is && isApplicable(this.is) && boolValueOf(this.is(another))
    )
  })
  link(instance, ['is-not', '!=='], function (another) {
    return !is.call(this, another)
  })

  // Enable the customization of Equivalence.
  var equals = link(instance, ['equals', '=='], function (another) {
    return this === another || is.call(this, another) || (
      this.equals !== equals && isApplicable(this.equals) &&
        boolValueOf(this.equals(another))
    )
  })
  link(instance, ['not-equals', '!='], function (another) {
    return !equals.call(this, another)
  })

  // Enable the customization of Ordering.
  var comparesTo = link(instance, 'compares-to', function (another) {
    if (this === another || equals.call(this, another)) {
      return 0
    }
    var thisComparesTo = this['compares-to']
    if (thisComparesTo === comparesTo || !isApplicable(thisComparesTo)) {
      return null
    }
    var ordering = this['compares-to'](another)
    return ordering > 0 ? 1
      : ordering < 0 ? -1
        : ordering === 0 ? 0 : null
  })

  // Emptiness: allow customization.
  var isEmpty = link(instance, 'is-empty', function () {
    var overriding = this['is-empty']
    return overriding !== isEmpty && isApplicable(overriding)
      ? boolValueOf(overriding.call(this))
      : Object.getOwnPropertyNames(this).length < 1
  })
  link(instance, 'not-empty', function () {
    return !isEmpty.call(this)
  })

  // Type Verification
  var isA = link(instance, ['is-a', 'is-an'], function (t) {
    if (t === $Object || (this.type instanceof ClassType$ && t === this.type)) {
      return true
    }
    var overriding = this['is-a']
    if (overriding !== isA && isApplicable(overriding)) {
      return boolValueOf(overriding.call(this, t))
    }
    if (!(t instanceof ClassType$) || !t.proto) {
      return false
    }
    var members = Object.getOwnPropertyNames(t.proto)
    for (var i = 0; i < members.length; i++) {
      if (typeof this[members[i]] === 'undefined') {
        return false
      }
    }
    return true
  })
  link(instance, ['is-not-a', 'is-not-an'], function (t) {
    return !isA.call(this, t)
  })

  // Enable the customization of Encoding.
  var toCode = link(instance, 'to-code', function (ctx) {
    var overriding = this['to-code']
    if (overriding === toCode || typeof overriding !== 'function') {
      return objectToCode.call(this, ctx) // not overridden
    }
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this)
    }
    var code = overriding.call(this)
    return typeOf(code) === $Object
      ? ctx.end(this, this.type, objectToCode.call(code))
      : code instanceof Tuple$ && code.plain !== true
        ? ctx.end(this, $Object, code) // app handle its type information.
        : ctx.end(this, this.type, objectToCode.call(this))
  })

  // Enable the customization of Description.
  var toString = link(instance, 'to-string', function () {
    var overriding = this['to-string']
    return overriding === toString || typeof overriding !== 'function'
      ? thisCall(toCode.call(this), 'to-string')
      : overriding.apply(this, arguments)
  })

  var indexer = link(instance, ':', function (index, value) {
    var overriding
    if (typeof index === 'string') {
      overriding = indexer
    } else if (index instanceof Symbol$) {
      index = index.key
      overriding = indexer
    } else {
      overriding = this[':']
    }
    // setter
    if (typeof value !== 'undefined') {
      return typeof index === 'string' ? (this[index] = value)
        : overriding === indexer ? null
          : overriding.apply(this, arguments)
    }
    // getting
    if (typeof index !== 'string') {
      return overriding === indexer ? null : overriding.call(this, index)
    }
    value = protoValueOf(this, typeOf(this).proto || instance, index)
    return typeof value === 'function' ? value : this[index]
  })
  indexer.get = function (key) {
    var value = instance[key]
    return typeof value === 'function' ? value : this[key]
  }

  // export type indexer.
  link(proto, 'indexer', indexer)
}
