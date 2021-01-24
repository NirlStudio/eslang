'use strict'

function offsetOf (length, index) {
  index >>= 0
  return index >= 0 ? index : index + length
}

function beginOf (length, from) {
  from = offsetOf(length, from)
  return from < 0 ? 0 : from
}

function endOf (length, to) {
  return typeof to === 'undefined' ? length : beginOf(length, to)
}

function checkSpacing (s, i, last) {
  switch (i - last) {
    case 1: return
    case 2: s.push('*'); return
    case 3: s.push('*', '*'); return
    case 4: s.push('*', '*', '*'); return
    default: s.push('...')
  }
}

module.exports = function arrayIn ($void) {
  var $ = $void.$
  var Type = $.array
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var link = $void.link
  var thisCall = $void.thisCall
  var iterateOf = $void.iterateOf
  var boolValueOf = $void.boolValueOf
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var EncodingContext$ = $void.EncodingContext
  var defineProperty = $void.defineProperty

  // create an empty array.
  link(Type, 'empty', function () {
    return []
  }, true)

  // create an array of the arguments
  link(Type, 'of', function (x, y, z) {
    switch (arguments.length) {
      case 0: return []
      case 1: return [x]
      case 2: return [x, y]
      case 3: return [x, y, z]
      default: return Array.prototype.slice.call(arguments)
    }
  }, true)

  // create an array with items from iterable arguments, or the argument itself
  // if its value is not iterable.
  var ShortArray = 16
  var arrayFrom = link(Type, 'from', function () {
    var list = []
    var isSparse
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      if (Array.isArray(source)) {
        source <= ShortArray ? list.push.apply(list, source)
          : (list = list.concat(source))
        isSparse = isSparse || source.isSparse
      } else {
        var next = iterateOf(source)
        if (!next) {
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
    isSparse && asSparse.call(list)
    return list
  }, true)

  var proto = Type.proto
  // return the length of this array.
  link(proto, 'length', function () {
    return this.length
  })
  // check whether this array is a sparse one.
  link(proto, 'is-sparse', function () {
    return this.isSparse || false
  })
  link(proto, 'not-sparse', function () {
    return !this.isSparse
  })
  // mark this array as a sparse or common array.
  var asSparse = link(proto, 'as-sparse', function (flag) {
    defineProperty(this, 'isSparse',
      typeof flag === 'undefined' || boolValueOf(flag)
    )
    return this
  })
  // return the amount of elements.
  link(proto, ['count', 'for-each'], function (filter) {
    var counter = 0
    if (isApplicable(filter)) {
      this.forEach(function (v, i) {
        typeof v !== 'undefined' &&
          boolValueOf(filter.call(this, v, i)) && counter++
      })
    } else {
      this.forEach(function (v) {
        typeof v !== 'undefined' && counter++
      })
    }
    return counter
  })

  // Mutability
  link(proto, 'seal', function () {
    return Object.freeze(this)
  })
  link(proto, 'is-sealed', function () {
    return Object.isFrozen(this)
  })

  var stopSignal = new Error('tracing.stopped')
  // call a handler for each element until it returns a truthy value.
  var trace = link(proto, 'trace', function (tracer) {
    if (isApplicable(tracer)) {
      try {
        this.forEach(function (v, i, s) {
          if (typeof v !== 'undefined' && boolValueOf(tracer.call(s, v, i))) {
            throw stopSignal
          }
        }, this)
      } catch (err) {
        if (err !== stopSignal) throw err
      }
    }
    return this
  })

  // like trace, but to traverse all element from the end.
  var retrace = link(proto, 'retrace', function (tracer) {
    if (isApplicable(tracer)) {
      try {
        this.reduceRight(function (_, v, i, s) {
          if (typeof v !== 'undefined' && boolValueOf(tracer.call(s, v, i))) {
            throw stopSignal
          }
        }, this)
      } catch (err) {
        if (err !== stopSignal) throw err
      }
    }
    return this
  })

  // generate an iterator function to traverse all array items.
  link(proto, 'iterate', function (begin, end) {
    begin = beginOf(this.length, begin)
    end = endOf(this.length, end)
    var list = this
    var indices = []
    trace.call(this, function (_, i) {
      return i >= end || (
        (i >= begin && indices.push(i)) && false
      )
    })
    var current
    begin = 0; end = indices.length
    return function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      if (begin >= end) {
        return null
      }
      var index = indices[begin++]
      return (current = [list[index], index])
    }
  })

  // to create a shallow copy of this instance with all items,
  // or selected items in a range.
  link(proto, 'copy', function (begin, count) {
    begin = beginOf(this.length, begin)
    count = typeof count === 'undefined' ? this.length : count >> 0
    if (count < 0) {
      count = 0
    }
    var list = this.slice(begin, begin + count)
    return this.isSparse ? asSparse.call(list) : list
  })
  link(proto, 'slice', function (begin, end) {
    var list = this.slice(beginOf(this.length, begin), endOf(this.length, end))
    return this.isSparse ? asSparse.call(list) : list
  })

  // create a new array with items in this array and argument values.
  link(proto, 'concat', function () {
    var list = this.concat(Array.prototype.slice.call(arguments))
    return this.isSparse ? asSparse.call(list) : list
  })

  // append more items to the end of this array
  var appendFrom = link(proto, ['append', '+='], function () {
    var isSparse
    for (var i = 0; i < arguments.length; i++) {
      var src = arguments[i]
      src = Array.isArray(src) ? src : arrayFrom(src)
      this.push.apply(this, src)
      isSparse = isSparse || src.isSparse
    }
    return isSparse && !this.isSparse ? asSparse.call(this) : this
  })

  // create a new array with items in this array and argument arrays.
  link(proto, ['merge', '+'], function () {
    var copy = this.slice()
    this.isSparse && asSparse.call(copy)
    return appendFrom.apply(copy, arguments)
  })

  // getter by index
  var getter = link(proto, 'get', function (index) {
    index = offsetOf(this.length, index)
    return index >= 0 ? this[index] : null
  })
  // setter by index
  var setter = link(proto, 'set', function (index, value) {
    index = offsetOf(this.length, index);
    ((index > 16) && (index + 1) >= (this.length / 2 * 3)) &&
      !this.isSparse && asSparse.call(this, true)
    return index < 0 ? null
      : (this[index] = typeof value === 'undefined' ? null : value)
  })
  // reset one or more entries by indices
  link(proto, 'reset', function (index) {
    var length = this.length
    for (var i = 0; i < arguments.length; i++) {
      index = offsetOf(length, arguments[i]);
      (index >= 0) && (delete this[index])
    }
    return this
  })

  // remove all entries or some values from this array.
  link(proto, 'clear', function (value) {
    var argc = arguments.length
    if (argc < 1) {
      this.splice(0)
      return this
    }
    var args = Array.prototype.slice.call(arguments)
    retrace.call(this, function (v, i) {
      for (var j = 0; j < argc; j++) {
        if (thisCall(v, 'equals', args[j])) {
          this.splice(i, 1); return
        }
      }
    })
    return this
  })
  // remove one or more values to create a new array.
  link(proto, 'remove', function (value) {
    var argc = arguments.length
    if (argc < 1) {
      return this.isSparse ? asSparse.call(this.slice()) : this.slice()
    }
    var args = Array.prototype.slice.call(arguments)
    var result = this.isSparse ? asSparse.call([]) : []
    var removed = 0
    trace.call(this, function (v, i) {
      var keep = true
      for (var j = 0; j < argc; j++) {
        if (thisCall(v, 'equals', args[j])) {
          keep = false; break
        }
      }
      keep ? (result[i - removed] = v) : removed++
    })
    return result
  })

  // replace all occurrences of a value to another value or reset them.
  link(proto, 'replace', function (value, newValue) {
    if (typeof value === 'undefined') {
      return this
    }
    typeof newValue === 'undefined' ? retrace.call(this, function (v, i) {
      thisCall(v, 'equals', value) && delete this[i]
    }) : trace.call(this, function (v, i) {
      thisCall(v, 'equals', value) && (this[i] = newValue)
    })
    return this
  })

  // check the existence of an element by a filter function
  link(proto, 'has', function (filter) {
    if (!isApplicable(filter)) { // as an index number
      return typeof this[offsetOf(this.length, filter)] !== 'undefined'
    }
    var found = false
    trace.call(this, function (v, i) {
      return (found = boolValueOf(filter.call(this, v, i)))
    })
    return found
  })
  // check the existence of a value
  link(proto, 'contains', function (value) {
    if (typeof value === 'undefined') {
      return false
    }
    var found = false
    trace.call(this, function (v, i) {
      return (found = thisCall(v, 'equals', value))
    })
    return found
  })

  // swap two value by offsets.
  link(proto, 'swap', function (i, j) {
    var length = this.length
    i = offsetOf(length, i)
    j = offsetOf(length, j)
    if (i === j || i < 0 || i >= length || j < 0 || j >= length) {
      return false
    }
    var tmp = this[i]
    typeof this[j] === 'undefined' ? delete this[i] : this[i] = this[j]
    typeof tmp === 'undefined' ? delete this[j] : this[j] = tmp
    return true
  })

  // retrieve the first n element(s).
  link(proto, 'first', function (count, filter) {
    if (typeof count === 'undefined') {
      return this[0]
    }
    if (isApplicable(count)) {
      var found
      trace.call(this, function (v, i) {
        return boolValueOf(count.call(this, v, i)) ? (found = v) || true : false
      })
      return found
    }
    count >>= 0
    if (count <= 0) {
      return []
    }
    var result = []
    if (isApplicable(filter)) {
      trace.call(this, function (v, i) {
        if (boolValueOf(filter.call(this, v, i))) {
          result.push(v)
          return (--count) <= 0
        } // else return false
      })
    } else {
      trace.call(this, function (v) {
        result.push(v)
        return (--count) <= 0
      })
    }
    return result
  })
  // find the index of first occurrence of a value.
  var indexOf = link(proto, 'first-of', function (value) {
    if (typeof value === 'undefined') {
      return null
    }
    var found = null
    trace.call(this, function (v, i) {
      return v === value || thisCall(v, 'equals', value)
        ? (found = i) || true : false
    })
    return found
  })
  // retrieve the last n element(s).
  link(proto, 'last', function (count, filter) {
    if (typeof count === 'undefined') {
      return this[this.length - 1]
    }
    if (isApplicable(count)) {
      var found
      retrace.call(this, function (v, i) {
        return boolValueOf(count.call(this, v, i)) ? (found = v) || true : false
      })
      return found
    }
    count >>= 0
    if (count <= 0) {
      return []
    }
    var result = []
    if (isApplicable(filter)) {
      retrace.call(this, function (v, i) {
        if (!boolValueOf(filter.call(this, v, i))) return
        result.unshift(v); count--
        return count <= 0
      })
    } else {
      retrace.call(this, function (v) {
        result.unshift(v); count--
        return count <= 0
      })
    }
    return result
  })
  // find the index of the last occurrence of a value.
  link(proto, 'last-of', function (value) {
    if (typeof value === 'undefined') {
      return null
    }
    var found = null
    retrace.call(this, function (v, i) {
      return v === value || thisCall(v, 'equals', value)
        ? (found = i) || true : false
    })
    return found
  })

  // edit current array
  link(proto, 'insert', function (index, item) {
    index = beginOf(this.length, index)
    if (arguments.length > 2) {
      var args = Array.prototype.slice.call(arguments, 2)
      args.unshift(index, 0, item)
      this.splice.apply(this, args)
    } else {
      this.splice(index, 0, item)
    }
    return this
  })
  link(proto, 'delete', function (index, count) {
    index = offsetOf(this.length, index)
    count = typeof count === 'undefined' ? 1 : count >> 0
    index >= 0 && this.splice(index, count)
    return this
  })
  link(proto, 'splice', function (index, count) {
    if ((index >>= 0) < -this.length) {
      if (arguments.length < 3) {
        return []
      }
      var args = Array.prototype.slice.call(arguments)
      args[0] = 0; args[1] = 0
      return this.splice.apply(this, args)
    }
    switch (arguments.length) {
      case 0:
        return this.splice()
      case 1:
        return this.splice(index)
      case 2:
        return this.splice(index, count)
      default:
        return this.splice.apply(this, arguments)
    }
  })

  // stack operations.
  link(proto, 'push', function () {
    Array.prototype.push.apply(this, arguments)
    return this
  })
  link(proto, 'pop', function (count) {
    return typeof count === 'undefined' ? this.pop()
      : (count >>= 0) >= this.length ? this.splice(0)
        : count > 0 ? this.splice(this.length - count)
          : this.splice(-1)
  })

  // queue operations.
  link(proto, 'enqueue', function () {
    this.unshift.apply(this, arguments)
    return this
  })
  proto.dequeue = proto.pop // dequeue is only an alias of pop.

  // reverse the order of all elements
  link(proto, 'reverse', function () {
    return this.reverse()
  })

  // re-arrange elements in an array.
  var comparerOf = function (reversing, comparer) {
    return reversing ? function (a, b) {
      var order = comparer(a, b)
      return order > 0 ? -1 : order < 0 ? 1 : 0
    } : function (a, b) {
      var order = comparer(a, b)
      return order > 0 ? 1 : order < 0 ? -1 : 0
    }
  }
  var ascComparer = function (a, b) {
    var order = thisCall(a, 'compares-to', b)
    return order > 0 ? 1 : order < 0 ? -1 : 0
  }
  var descComparer = function (a, b) {
    var order = thisCall(a, 'compares-to', b)
    return order > 0 ? -1 : order < 0 ? 1 : 0
  }
  link(proto, 'sort', function (order, comparer) {
    var reversing = false
    if (typeof order === 'function') {
      comparer = order
    } else if ((order >> 0) > 0) {
      reversing = true
    }
    var comparing = typeof comparer === 'function'
      ? comparerOf(reversing, comparer)
      : reversing ? descComparer : ascComparer
    return this.sort(comparing)
  })

  // collection operations
  link(proto, 'find', function (filter) {
    var result = []
    if (isApplicable(filter)) {
      trace.call(this, function (v, i) {
        boolValueOf(filter.call(this, v, i)) && result.push(i)
      })
    } else { // pick all valid indices.
      trace.call(this, function (v, i) { result.push(i) })
    }
    return result
  })
  link(proto, 'select', function (filter) {
    return isApplicable(filter) ? this.filter(function (v, i) {
      return typeof v !== 'undefined' && boolValueOf(filter.call(this, v, i))
    }, this) : this.filter(function (v) {
      return typeof v !== 'undefined' // pick all valid indices.
    }, this)
  })
  link(proto, 'map', function (converter) {
    var result = isApplicable(converter)
      ? this.map(function (v, i) {
        if (typeof v !== 'undefined') {
          return converter.call(this, v, i)
        }
      }, this) : this.slice()
    this.isSparse && asSparse.call(result)
    return result
  })
  link(proto, 'reduce', function (value, reducer) {
    if (!isApplicable(reducer)) {
      if (!isApplicable(value)) {
        return value
      }
      reducer = value
      value = null
    }
    return this.reduce(function (s, v, i, t) {
      return typeof v !== 'undefined' ? reducer.call(t, s, v, i) : s
    }, value)
  })

  link(proto, 'join', function (separator) {
    var last = -1
    var strings = this.reduce(function (s, v, i, t) {
      if (typeof v !== 'undefined') {
        checkSpacing(s, i, last)
        s.push(typeof v === 'string' ? v : thisCall(v, 'to-string'))
        last = i
      }
      return s
    }, [])
    checkSpacing(strings, this.length, last)
    return strings.join(typeof separator === 'string' ? separator : ' ')
  })

  // determine emptiness by array's length
  link(proto, 'is-empty', function () {
    return !(this.length > 0)
  })
  link(proto, 'not-empty', function () {
    return this.length > 0
  })

  // default object persistency & describing logic
  var toCode = link(proto, 'to-code', function (ctx) {
    if (ctx instanceof EncodingContext$) {
      var sym = ctx.begin(this)
      if (sym) { return sym }
    } else {
      ctx = new EncodingContext$(this)
    }
    var code = [$Symbol.literal]
    var last = -1
    trace.call(this, function (v, i) {
      v = ctx.encode(v);
      (i - last) > 1 ? code.push(i, $Symbol.pairing, v) : code.push(v)
      last = i
    })
    return ctx.end(this, Type, new Tuple$(code))
  })

  // Description
  link(proto, 'to-string', function () {
    return thisCall(toCode.call(this), 'to-string')
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'number'
      ? typeof value === 'undefined' ? getter.call(this, index)
        : setter.call(this, index, value)
      : typeof index === 'string' ? protoValueOf(this, proto, index)
        : index instanceof Symbol$ ? protoValueOf(this, proto, index.key)
          : indexOf.call(this, index)
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
