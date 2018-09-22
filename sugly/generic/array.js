'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.array
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var EncodingContext$ = $void.EncodingContext

  // create an empty array.
  link(Type, 'empty', function () {
    return []
  })

  // create an array of the arguments
  link(Type, 'of', function (x, y, z) {
    switch (arguments.length) {
      case 0: return []
      case 1: return [x]
      case 2: return [x, y]
      case 3: return [x, y, z]
      default: return Array.prototype.slice.call(arguments)
    }
  })

  // create an array with items from iterable arguments, or the argument itself
  // if its value is not iterable.
  var arrayFrom = link(Type, 'from', function () {
    var list = []
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (Array.isArray(source)) {
        list.push.apply(list, source)
      } else {
        var next = thisCall(source, 'iterate')
        if (typeof next !== 'function') {
          list.push(source)
        } else {
          var item = next()
          while (typeof item !== 'undefined' && item !== null) {
            list.push(Array.isArray(item) ? item.length > 0 ? item[0] : null : item)
            item = next()
          }
        }
      }
    }
    return list
  })

  var proto = Type.proto
  // return the length of this array.
  link(proto, 'length', function () {
    return this.length
  })
  // return the amount of elements.
  link(proto, 'count', function () {
    var count = 0
    for (var i = 0; i < this.length; i++) {
      if (typeof this[i] !== 'undefined') {
        count++
      }
    }
    return count
  })

  // generate an iterator function to traverse all array items.
  link(proto, 'iterate', function () {
    var list = this
    var current = null
    var next = 0
    return function (inSitu) {
      return current !== null && inSitu === true ? current
        : next >= list.length ? null : (current = [list[next], next++])
    }
  })

  // to create a shallow copy of this instance with all items,
  // or selected items in a range.
  link(proto, 'copy', function (begin, count) {
    begin = begin >> 0
    count = typeof count === 'undefined' ? this.length : count >> 0
    if (count < 0) {
      begin += count
      count = -count
    }
    if (begin < 0) {
      begin += this.length
    }
    return this.slice(begin, begin + count)
  })
  var slice = link(proto, 'slice', function (begin, end) {
    begin = begin >> 0
    if (begin < 0) {
      begin += this.length
    }
    end = typeof end === 'undefined' ? this.length : end >> 0
    if (end < 0) {
      end += this.length
    }
    return this.slice(begin, end)
  })

  // append more items to the end of this array
  var appendFrom = link(proto, ['append', '+='], function () {
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      this.push.apply(this, Array.isArray(src) ? src : arrayFrom(src))
    }
    return this
  })

  // create a new array with items in this array and argument values.
  link(proto, 'concat', function () {
    return this.concat.apply(this, arguments)
  })

  // create a new array with items in this array and argument arrays.
  link(proto, ['merge', '+'], function () {
    return appendFrom.apply(this.slice(0), arguments)
  })

  // getter by index
  link(proto, 'get', function (offset) {
    offset = offset >> 0
    return this[offset < 0 ? offset + this.length : offset]
  })
  // setter by index
  link(proto, 'set', function (offset, value) {
    offset = offset >> 0
    return (this[offset] = typeof value === 'undefined' ? null : value)
  })
  // reset one or more entries by index
  link(proto, 'reset', function (offset, more) {
    if (typeof more === 'undefined') {
      return delete this[offset >> 0] ? 1 : 0
    }
    var counter = delete this[offset >> 0] ? 1 : 0
    for (var i = 1; i < arguments.length; i++) {
      if (delete this[arguments[i] >> 0]) {
        counter++
      }
    }
    return counter
  })
  // remove one or more values to create a new array.
  link(proto, 'remove', function (value) {
    var argc = arguments.length
    var result = []
    for (var i = 0; i < this.length; i++) {
      var keep = true
      for (var j = 0; j < argc; j++) {
        if (thisCall(this[i], 'equals', arguments[j])) {
          keep = false
          break
        }
      }
      keep && result.push(this[i])
    }
    return result
  })

  // remove all entries or some values from this array.
  link(proto, 'clear', function (value) {
    if (typeof value === 'undefined') {
      this.splice(0)
      return this
    }

    var argc = arguments.length
    var indices = []
    var i = 0
    for (; i < this.length; i++) {
      for (var j = 0; j < argc; j++) {
        if (thisCall(this[i], 'equals', arguments[j])) {
          indices.push(i)
          break
        }
      }
    }
    for (i = indices.length - 1; i >= 0; i--) {
      this.splice(indices[i], 1)
    }
    return this
  })

  // check the existence of an entry
  link(proto, 'has', function (offset) {
    return typeof this[offset >> 0] !== 'undefined'
  })

  // sawp two value by offsets.
  link(proto, 'swap', function (x, y) {
    x = x >> 0
    if (x < 0) {
      x += this.length
    }
    y = y >> 0
    if (y < 0) {
      y += this.length
    }
    if (x === y) {
      return false
    }
    var tmp = this[x]
    this[x] = this[y]
    this[y] = tmp
    return true
  })

  link(proto, 'first', function (count) {
    return typeof count === 'undefined' ? this[0]
      : this.slice(0, count < 0 ? 0 : (count >>= 0))
  })
  link(proto, 'first-of', function (value) {
    if (typeof value === 'undefined') {
      return null
    }
    for (var i = 0; i < this.length; i++) {
      var v = this[i]
      if (v === value || Object.is(v, value) || thisCall(v, 'equals', value)) {
        return i
      }
    }
    return null
  })
  link(proto, 'last', function (count) {
    if (typeof count === 'undefined') {
      return this[this.length - 1]
    }
    count >>= 0
    return count >= this.length ? this.slice()
      : this.slice(this.length - count, this.length)
  })
  link(proto, 'last-of', function (value) {
    if (typeof value === 'undefined') {
      return null
    }
    for (var i = this.length - 1; i >= 0; i--) {
      var v = this[i]
      if (v === value || Object.is(v, value) || thisCall(v, 'equals', value)) {
        return i
      }
    }
    return null
  })

  // edit current array
  link(proto, 'splice', function () {
    Array.prototype.splice.apply(this, arguments)
    return this
  })

  // stack operations.
  link(proto, 'push', function () {
    Array.prototype.push.apply(this, arguments)
    return this
  })
  proto.pop = Array.prototype.pop

  // queue operations.
  proto.enqueue = proto.push
  link(proto, 'dequeue', function () {
    var value = this[0]
    this.splice(0, 1)
    return value
  })

  // reverse
  link(proto, 'reverse', function (copy) {
    return copy === true ? this.slice(0).reverse() : this.reverse()
  })

  // sort
  link(proto, 'sort', function (comparer, copy) {
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
    return copy === true ? this.slice(0).sort(comparing) : this.sort(comparing)
  })

  // determine emptiness by array's length
  link(proto, 'is-empty', function () {
    return this.length < 1
  })
  link(proto, 'not-empty', function () {
    return !(this.length < 1)
  })

  // default object persistency & describing logic
  link(proto, 'to-code', function (ctx) {
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) {
        return sym
      }
    } else {
      ctx = new EncodingContext$(this)
    }
    var code = [$Symbol.object]
    for (var i = 0; i < this.length; i++) {
      code.push(thisCall(this[i], 'to-code', ctx))
    }
    return ctx.end(this, Type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function (separator) {
    return thisCall(thisCall(this, 'to-code'), 'to-string')
  })

  link(proto, 'join', function (separator) {
    var items = []
    for (var i = 0; i < this.length; i++) {
      var value = this[i]
      items.push(typeof value === 'string' ? value : thisCall(value, 'to-string'))
    }
    return items.join(typeof separator === 'string' ? separator : ' ')
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'number'
      ? typeof value === 'undefined' ? this[index] // getting item
        : (this[index] = value) // setting item
      : typeof index === 'string' ? proto[index]
        : index instanceof Symbol$ ? proto[index.key]
          : slice.apply(this, arguments)
  })

  // export type indexer.
  link(Type, 'indexer', indexer)

  // inject type
  Array.prototype.type = Type // eslint-disable-line no-extend-native
}
