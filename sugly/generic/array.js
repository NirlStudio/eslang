'use strict'

function createArrayOf () {
  return function (x, y, z) {
    switch (arguments.length) {
      case 0:
        return []
      case 1:
        return [x]
      case 2:
        return [x, y]
      case 3:
        return [x, y, z]
      default:
        return Array.prototype.slice.call(arguments)
    }
  }
}

function createMerge ($void) {
  var thisCall = $void.thisCall

  return function () {
    if (!Array.isArray(this)) {
      return null
    }
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (Array.isArray(source)) {
        this.push.apply(this, source)
        continue
      }
      var next = typeof source === 'function'
        ? source : thisCall(source, 'iterate')
      if (typeof next !== 'function') {
        this.push(source)
        continue
      }
      var item = next()
      while (typeof item !== 'undefined' && item !== null) {
        if (Array.isArray(item)) {
          if (item.length > 0) {
            this.push(item[0])
          }
        } else {
          this.push(item)
        }
        item = next()
      }
    }
    return this
  }
}

function iterator ($void) {
  return function () {
    if (!Array.isArray(this)) {
      return null
    }
    var list = this
    var index = 0
    return function (inSitu) {
      return (index >= list.length) ? null
        : typeof inSitu !== 'undefined' && inSitu !== false && inSitu !== null && inSitu !== 0
          ? [list[index]] : [list[index++]]
    }
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.array
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var $Object = $.object
  var boolOf = $.bool.of
  var link = $void.link
  var typeOf = $void.typeOf
  var Tuple$ = $void.Tuple
  var Integer$ = $void.Integer
  var thisCall = $void.thisCall
  var copyProto = $void.copyProto
  var ObjectType$ = $void.ObjectType
  var CodingContext$ = $void.CodingContext
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier
  var nativeIndexer = $void.nativeIndexer

  // create an empty array.
  link(Type, 'empty', function () {
    return []
  })

  // create an array with its elements
  link(Type, 'of', createArrayOf())

  // convert any iterable object to an array.
  link(Type, 'from', function () {
    return merge.apply([], arguments)
  })

  // Type Indexer
  typeIndexer(Type)

  var proto = Type.proto
  // generate a new object by comine this object and other objects.
  var merge = link(proto, '+=', createMerge($void))

  // to create a shallow copy of this instance with the same type.
  link(proto, 'copy', function () {
    return Array.isArray(this) ? this.slice(0) : null
  })

  // generate an iterator function
  link(proto, 'iterate', iterator($void))

  // forward the length property.
  link(proto, 'length', function () {
    return Array.isArray(this) ? this.length : null
  })

  // array element accessors
  link(proto, 'get', function (offset) {
    if (offset instanceof Integer$) {
      offset = offset.number
    }
    if (!Array.isArray(this) || typeof offset !== 'number') {
      return null
    }
    var value = this[offset]
    return typeof value === 'undefined' ? null : value
  })
  link(proto, 'set', function (offset, value) {
    if (offset instanceof Integer$) {
      offset = offset.number
    }
    if (!Array.isArray(this) || typeof offset !== 'number') {
      return null
    }
    var current = this[offset]
    this[offset] = typeof value === 'undefined' ? null : value
    return typeof current === 'undefined' ? null : current
  })
  link(proto, 'clear', function () {
    if (Array.isArray(this)) {
      this.splice(0)
      return this
    } else {
      return null
    }
  })
  // sawp two value by offsets.
  link(proto, 'swap', function (x, y) {
    if (!Array.isArray(this)) {
      return false
    }
    if (x instanceof Integer$) {
      x = x.number
    }
    if (typeof x !== 'number' || x < 0) {
      x = 0
    }
    if (y instanceof Integer$) {
      y = y.number
    }
    if (typeof y !== 'number' || y >= this.length) {
      y = this.length - 1
    }
    if (x === y) {
      return false
    }
    var tmp = this[x]
    this[x] = this[y]
    this[y] = tmp
    return true
  })

  // merge this tuple and argument values to create a new one.
  link(proto, 'concat', function () {
    return Array.isArray(this) ? this.concat.apply(this, arguments) : null
  })

  // generate a new object by comine this object and other objects.
  link(proto, ['merge', '+'], function () {
    return Array.isArray(this) ? merge.apply(this.slice(0), arguments) : null
  })
  link(proto, 'first', function (value) {
    if (!Array.isArray(this) || this.length < 1) {
      return null
    }
    if (typeof value === 'undefined') {
      return this[0]
    }
    for (var i = 0; i < this.length; i++) {
      var v = this[i]
      if (v === value || Object.is(v, value) || thisCall(v, 'equals', value)) {
        return i
      }
    }
    return null
  })
  link(proto, 'last', function (value) {
    if (!Array.isArray(this) || this.length < 1) {
      return null
    }
    if (typeof value === 'undefined') {
      return this[this.length - 1]
    }
    for (var i = this.length - 1; i >= 0; i--) {
      var v = this[i]
      if (v === value || Object.is(v, value) || thisCall(v, 'equals', value)) {
        return i
      }
    }
    return null
  })

  // create a slice of the original tuple
  link(proto, 'slice', function (begin, end) {
    if (!Array.isArray(this)) {
      return null
    }
    if (begin instanceof Integer$) {
      begin = begin.number
    } else if (typeof begin !== 'number') {
      begin = 0
    }
    if (end instanceof Integer$) {
      end = end.number
    }
    return typeof end === 'number' ? this.slice(begin, end) : this.slice(begin)
  })

  var verify = Array.isArray.bind(Array)
  // standard array operations to produce a new array
  copyProto(Type, Array, verify, {
    'splice': 'splice'
  })

  // use an array as a stack.
  copyProto(Type, Array, verify, {
    /* IE5.5 */
    'pop': 'pop',
    'push': 'push'
  })

  // reverse
  link(proto, 'reverse', function (copy) {
    return !Array.isArray(this) ? null
      : boolOf(copy) ? this.slice(0).reverse() : this.reverse()
  })

  // sort
  link(proto, 'sort', function (comparer, copy) {
    if (!Array.isArray(this) || this.length < 1) {
      return this
    }
    if (typeof comparer === 'boolean') {
      copy = comparer
      comparer = null
    } else if (typeof comparer !== 'function') {
      comparer = null
    }
    var comparing = comparer ? function (a, b) {
      var order = comparer(a, b)
      return order !== -1 && order !== 1 ? 0 : order
    } : function (a, b) {
      var order = thisCall(a, 'compare', b)
      return order !== -1 && order !== 1 ? 0 : order
    }
    return !Array.isArray(this) ? null
      : boolOf(copy) ? this.slice(0).sort(comparing) : this.sort(comparing)
  })

  // Type Verification
  typeVerifier(Type)

  // determine emptiness by array's length
  link(proto, 'is-empty', function () {
    return Array.isArray(this) ? this.length < 1 : null
  }, 'not-empty', function () {
    return Array.isArray(this) ? this.length > 0 : null
  })

  // default object persistency & describing logic
  var toCode = link(proto, 'to-code', function (ctx) {
    if (!Array.isArray(this)) {
      return null // illegal call.
    }
    // an empty object.
    if (this.length < 1) {
      return $Tuple.array
    }
    // not empty
    if (ctx instanceof CodingContext$) {
      var sym = ctx.touch(this, Type)
      if (sym) {
        return sym
      }
      return encode(ctx, this)
    } else { // as root
      ctx = new CodingContext$()
      ctx.touch(this, Type)
      var code = encode(ctx, this)
      return ctx.final(code)
    }
  })

  function encode (ctx, array) {
    var list = [$Symbol.object] // (@ ...
    for (var i = 0; i < array.length; i++) {
      var value = array[i]
      list.push(thisCall(value, 'to-code', ctx))
    }
    return ctx.complete(array, new Tuple$(list))
  }

  // Description
  link(proto, 'to-string', function (separator) {
    if (!Array.isArray(this)) {
      return null
    }
    var items = ['(@']
    for (var i = 0; i < this.length; i++) {
      var value = this[i]
      var valueType = typeOf(value)
      if (valueType === $Object || valueType instanceof ObjectType$) {
        // prevent recursive call.
        items.push('(@:' + valueType['to-string']() + ' ... )')
      } else {
        items.push(thisCall(value, 'to-string'))
      }
    }
    items.push(')')
    return items.join(separator || ' ')
  })

  // Indexer
  nativeIndexer(Type, Array, null, function (name, value) {
    if (!Array.isArray(this) || name === ':') {
      return null
    }
    // global static properties.
    if (name === 'type') {
      return Type
    } else if (name === 'to-code') {
      return toCode // to keep the to-code mechanisim consistent.
    }
    if (name instanceof Integer$) {
      name = name.number
    }
    return typeof name === 'string' // read properties
      ? name && typeof proto[name] !== 'undefined' ? proto[name] : null
      : typeof name !== 'number' ? null
        : typeof value === 'undefined'
          ? typeof this[name] === 'undefined' ? null : this[name]
            : (function (list, i, v) {
              var t = list[i]; list[i] = v
              return typeof t === 'undefined' ? null : t
            })(this, name, value)
  })
}
