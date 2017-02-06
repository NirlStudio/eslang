'use strict'

function createObject ($void) {
  var isPrototypeOf = $void.isPrototypeOf
  var $Object = $void.$.Object

  return function Object$create () {
    var parent = this === $Object || (isPrototypeOf($Object, this) &&
      isPrototypeOf($Object.proto, this.proto)) ? this : $Object

    var obj = Object.create(parent.proto)
    if (arguments.length > 0) {
      var args = [obj]
      Array.prototype.push.apply(args, arguments)
      Object.assign.apply(Object, args)
    }
    return obj
  }
}

function removeField ($void) {
  var ownsProperty = $void.ownsProperty

  return function object$removeField (name) {
    if (typeof name !== 'string') {
      return null
    }
    var value
    if (ownsProperty(this, name)) {
      value = this[name]
      delete this[name]
    } else {
      value = null
    }
    return value
  }
}

function setProperty () {
  return function object$setProperty (name, value) {
    if (typeof name !== 'string') {
      return null
    }
    return (this[name] = (typeof value === 'undefined' ? null : value))
  }
}

function combine (create) {
  return function object$combine () {
    var objs = [this]
    Array.prototype.push.apply(objs, arguments)
    return create.apply(null, objs)
  }
}

function merge () {
  return function object$merge () {
    if (typeof this === 'object' && this !== null) {
      for (var i = 0; i < arguments.length; i++) {
        Object.assign(this, arguments[i])
      }
    }
    return this
  }
}

function objectCopy () {
  return function object$copy () {
    if (typeof this === 'object' && this !== null) {
      var obj = Object.create(Object.getPrototypeOf(this))
      Object.assign(obj, this)
      return obj
    }
    return null
  }
}

function toCodeAsRoot (obj, ctx) {
  analyzeObject(obj, ctx)
  ctx.analyzed = true

  // update status for this object.
  var status = ctx.generating(obj)
  var code = objectToCode(obj, ctx)
  if (ctx.count() > 0) { // use ctx result
    if (status.key) {
      return ctx.end('(' + status.key + ' += ' + code + ')') // update
    } else {
      return ctx.end(code)
    }
  } else {
    return code // no nested object, return code directly
  }
}

function toCodeAsChild (obj, ctx) {
  if (!ctx.analyzed) { // in analyzing
    switch (ctx.analyze(obj)) {
      case 0: // not repeated yet.
        return analyzeObject(obj, ctx)
      case 1: // repeated once
        return ctx.create(obj, '(@:)')
      default: // more than once
        return // do nothing
    }
  }

  // generating code
  var status = ctx.generating(obj)
  if (!status.key) { // single occurrence
    return objectToCode(obj, ctx)
  }
  if (status.stage === 1) { // repeated first time.
    ctx.update('(' + status.key + ' += ' + objectToCode(obj, ctx) + ')')
  }
  // generated before, so here returns variable name only.
  return status.key
}

function analyzeObject (obj, ctx) {
  Object.getOwnPropertyNames(obj).forEach(function analyzeField (name) {
    var value = obj[name]
    if (value !== null && (typeof value === 'object' ||
      typeof value === 'function')) {
      ctx.toCode(value)
    }
  })
}

function objectToCode (obj, ctx) {
  var type = ctx.toCode(obj.type, '') || 'Object'
  var begin, end
  if (type && type !== 'Object' && type !== 'Class') {
    begin = '(' + type + ' create (@'
    end = '))'
  } else {
    begin = '(@'
    end = ')'
  }
  var code = [begin]
  Object.getOwnPropertyNames(obj).forEach(function printField (name) {
    code.push(name + ': ' + ctx.toCode(obj[name], '()'))
  })
  code.push(end)
  return code.join(ctx.asCompat ? ' ' : '\n')
}

module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.Object
  var proto = $Object.proto
  var readonly = $void.readonly
  var virtual = $void.virtual
  var ownsProperty = $void.ownsProperty

  // create a new object and copy properties from source objects.
  readonly($Object, 'create', createObject($void))

  // orverride helper functions to test equivalency.
  virtual(proto, 'not-equals', function object$notEquals (another) {
    if (typeof this.equals === 'function') {
      return this.equals(another) !== true
    }
    return this !== (typeof another === 'undefined' ? null : another)
  })
  virtual(proto, '==', function object$oprEquals (another) {
    if (typeof this.equals === 'function') {
      return this.equals(another) === true
    }
    return this === (typeof another === 'undefined' ? null : another)
  })
  virtual(proto, '!=', function object$oprNotEquals (another) {
    if (typeof this.equals === 'function') {
      return this.equals(another) !== true
    }
    return this !== (typeof another === 'undefined' ? null : another)
  })

  // object property & field (owned property) manipulation
  // retrieve field names
  virtual(proto, 'get-fields', function object$getFields () {
    return Object.getOwnPropertyNames(this)
  })
  // test the existence by a field name
  virtual(proto, 'has-field', function object$hasField (name) {
    return typeof name !== 'string' ? null : ownsProperty(this, name)
  })
  // remove a field from an object
  virtual(proto, 'remove-field', removeField($void))
  // test a property (either owned or inherited) name
  virtual(proto, 'has-property', function object$hasProperty (name) {
    return typeof name !== 'string' ? false : typeof this[name] !== 'undefined'
  })
  // retrieve the value of a property
  virtual(proto, 'get-property', function object$getProperty (name) {
    return typeof name !== 'string' ? null
      : typeof this[name] !== 'undefined' ? this[name] : null
  })
  // set the value of a field
  virtual(proto, 'set-property', setProperty())

  // to create a shallow copy of this instance with the same type.
  virtual(proto, 'copy', objectCopy())

  // support general operators
  // generate a new object by comine this object and other objects.
  virtual(proto, '+', combine($Object.create))
  // shallowly copy fields from other objects to this object.
  virtual(proto, '+=', merge(proto))

  // default object emptiness logic
  virtual(proto, 'is-empty', function object$isEmpty () {
    return Object.getOwnPropertyNames(this).length > 0
  })
  virtual(proto, 'not-empty', function object$notEmpty () {
    if (typeof this['is-empty'] === 'function') {
      return this['is-empty']() !== true
    }
    return Object.getOwnPropertyNames(this).length < 1
  })

  // default object persistency & describing logic
  var coding = $void.coding
  readonly(proto, 'to-code', function object$toCode (asCompat) {
    if (this === null || typeof this !== 'object') {
      return '(@:)'
    }
    return coding.is(asCompat) ? toCodeAsChild(this, asCompat)
      : toCodeAsRoot(this, coding.start(this, asCompat))
  })

  virtual(proto, 'to-string', function object$toString () {
    if (!this || typeof this !== 'object') {
      return '()'
    }
    var fields = ['(@']
    Object.getOwnPropertyNames(this).forEach(function printField (name) {
      var value = this[name]
      if (value === null) {
        fields.push('  ' + name + ': null')
      } else if (typeof value !== 'object' || value instanceof Date) {
        fields.push('  ' + name + ': ' + coding.toString(value))
      } else {
        if (value.type && value.type.name) {
          fields.push('  ' + name + ': (' + value.type.name.toLowerCase() + ' )')
        } else {
          fields.push('  ' + name + ': (@:)')
        }
      }
    }, this)
    fields.push(')')
    return fields.join('\n')
  })

  // indexer: override to implement setter.
  readonly(proto, ':', function object$indexer (name, value) {
    if (typeof name !== 'string') {
      return null
    }
    switch (arguments.length) {
      case 1:
        value = this[name]
        return typeof value !== 'undefined' ? value
          : typeof proto[name] === 'undefined' ? null : proto[name]
      case 2:
        return (this[name] = (typeof value === 'undefined' ? null : value))
      default:
        return null
    }
  })

  // override to boost - an object is always true
  virtual(proto, '?', function object$boolTest (a, b) {
    return typeof a === 'undefined' ? true : a
  })

  // export to system's prototype
  $void.injectTo(Object, 'type', $Object)
  $void.injectTo(Object, ':', proto[':'])
}
