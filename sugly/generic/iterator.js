'use strict'

module.exports = function iterate ($void) {
  var $ = $void.$
  var Type = $.iterator
  var $Symbol = $.symbol
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var Iterator$ = $void.Iterator
  var numberOf = $.number.of
  var link = $void.link
  var $export = $void.export
  var thisCall = $void.thisCall
  var boolValueOf = $void.boolValueOf
  var isApplicable = $void.isApplicable
  var sharedSymbolOf = $void.sharedSymbolOf

  // try to get an iterator function for an entity
  var iterateOf = $export($void, 'iterateOf', function (source) {
    return isApplicable(source) ? source
      : isApplicable(source = thisCall(source, 'iterate')) ? source : null
  })

  // create an empty iterator.
  var empty = link(Type, 'empty', new Iterator$(null))

  // create an iterator object for an iterable entity.
  link(Type, 'of', function (iterable) {
    if (iterable instanceof Iterator$) {
      return iterable
    }
    var next = iterateOf(iterable)
    return next ? new Iterator$(next) : empty
  })

  // create an iterator object for an unsafe iterable entity.
  var unsafe = function (next) {
    var last
    return function (inSitu) {
      if (typeof last !== 'undefined' && boolValueOf(inSitu)) {
        return last
      }
      if (next === null) {
        return null
      }
      var current = next()
      return current === last || Object.is(current, last)
        ? (next = null) // each iteration must vary.
        : (last = current)
    }
  }
  link(Type, 'of-unsafe', function (iterable) {
    var next = iterateOf(iterable)
    return next ? new Iterator$(unsafe(next)) : empty
  })

  var proto = Type.proto
  // an iterator objecct is also iterable.
  link(proto, 'iterate', function () {
    return this.next
  })

  // an iterator objecct is also iterable.
  link(proto, 'skip', function (count) {
    count >>= 0
    if (!this.next || count <= 0) {
      return this
    }

    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      var value
      while (count > 0) {
        value = next(); count--
        if (typeof value === 'undefined' || value === null) {
          next = null; break
        }
      }
      value = next && next()
      return typeof value === 'undefined' || value === null ? null
        : (current = value)
    }
    return this
  })

  // an iterator objecct is also iterable.
  link(proto, 'keep', function (count) {
    if (!this.next) {
      return this
    }
    count >>= 0
    if (count <= 0) {
      this.next = null
      return this
    }
    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      if (count <= 0) {
        return null
      }
      var value = next()
      if (--count <= 0) {
        next = null
      }
      return typeof value === 'undefined' || value === null ? null
        : (current = value)
    }
    return this
  })

  // select a subset of all items.
  link(proto, 'select', function (filter) {
    if (!this.next) {
      return this
    }
    if (!isApplicable(filter)) {
      if (!boolValueOf(filter)) {
        this.next = null
      }
      return this
    }
    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      var value = next && next()
      while (typeof value !== 'undefined' && value !== null) {
        if (boolValueOf(Array.isArray(value)
          ? filter.apply(this, value) : filter.call(this, value))
        ) {
          return (current = value)
        }
        value = next()
      }
      return (next = null)
    }
    return this
  })

  // map each item to a new value.
  link(proto, 'map', function (converter) {
    if (!this.next) {
      return this
    }
    var convert = isApplicable(converter) ? converter : function () {
      return converter
    }
    var current
    var next = this.next
    this.next = function (inSitu) {
      if (typeof current !== 'undefined' &&
        typeof inSitu !== 'undefined' && boolValueOf(inSitu)) {
        return current
      }
      var value = next && next()
      if (typeof value === 'undefined' || value === null) {
        return (next = null)
      }
      current = Array.isArray(value)
        ? convert.apply(this, value) : convert.call(this, value)
      return Array.isArray(current) ? current : (current = [current])
    }
    return this
  })

  // accumulate all items to produce a value.
  link(proto, 'reduce', function (value, reducer) {
    if (!isApplicable(reducer)) {
      if (!isApplicable(value)) {
        return typeof value === 'undefined'
          ? count.call(this)
          : finish.call(this, value)
      } else {
        reducer = value
        value = null
      }
    }
    var args
    var item = this.next && this.next()
    while (typeof item !== 'undefined' && item !== null) {
      if (Array.isArray(item)) {
        args = item.slice()
        args.unshift(value)
      } else {
        args = [value, item]
      }
      value = reducer.apply(this, args)
      item = this.next()
    }
    this.next = null
    return value
  })

  // count the number of iterations.
  var count = link(proto, 'count', function (filter) {
    var counter = 0
    var value = this.next && this.next()
    if (isApplicable(filter)) {
      while (typeof value !== 'undefined' && value != null) {
        (boolValueOf(Array.isArray(value)
          ? filter.apply(this, value) : filter.call(this, value))
        ) && counter++
        value = this.next()
      }
    } else {
      while (typeof value !== 'undefined' && value != null) {
        counter++
        value = this.next()
      }
    }
    this.next = null
    return counter
  })

  // sum the values of all iterations.
  link(proto, 'sum', function (base) {
    var sum = typeof base === 'number' ? base : numberOf(base)
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      if (Array.isArray(value)) {
        value = value.length > 0 ? value[0] : 0
      }
      sum += typeof value === 'number' ? value : numberOf(value)
      value = this.next()
    }
    this.next = null
    return sum
  })

  // calculate the average value of all iterations.
  link(proto, 'average', function (defaultValue) {
    var counter = 0
    var sum = 0
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      counter++
      if (Array.isArray(value)) {
        value = value.length > 0 ? value[0] : 0
      }
      sum += typeof value === 'number' ? value : numberOf(value)
      value = this.next()
    }
    this.next = null
    return (counter > 0) && !isNaN(sum /= counter) ? sum
      : typeof defaultValue === 'number' ? defaultValue : 0
  })

  // determine emptiness by its inner iterator function.
  link(proto, 'is-empty', function () {
    return !this.next
  })
  link(proto, 'not-empty', function () {
    return !!this.next
  })

  // concatenate the values of all iterations.
  link(proto, 'join', function (separator) {
    var str = ''
    if (typeof separator !== 'string') {
      separator = ' '
    }
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      if (Array.isArray(value)) {
        value = value.length > 0 ? value[0] : ''
      }
      if (str.length > 0) { str += separator }
      str += typeof value === 'string' ? value : thisCall(value, 'to-string')
      value = this.next()
    }
    this.next = null
    return str
  })

  // collect the main value of all iterations.
  link(proto, 'collect', function (list) {
    if (!Array.isArray(list)) {
      list = []
    }
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      list.push(!Array.isArray(value) ? value
        : value = value.length > 0 ? value[0] : null)
      value = this.next()
    }
    this.next = null
    return list
  })

  // finish all iterations.
  var finish = link(proto, 'finish', function (nil) {
    nil = [nil]
    var value = this.next && this.next()
    while (typeof value !== 'undefined' && value != null) {
      nil = value
      value = this.next()
    }
    this.next = null
    return !Array.isArray(nil) ? nil
      : nil.length > 0 ? nil[0] : null
  })

  // all interators will be encoded to an empty iterator.
  var code = new Tuple$([
    sharedSymbolOf('iterator'), sharedSymbolOf('of'), $Symbol.etc
  ])
  var emptyCode = new Tuple$([
    sharedSymbolOf('iterator'), sharedSymbolOf('empty')
  ])
  link(proto, 'to-code', function () {
    return this.next ? code : emptyCode
  })

  // Description
  var codeStr = thisCall(code, 'to-string')
  var emptyCodeStr = thisCall(emptyCode, 'to-string')
  link(proto, 'to-string', function (separator) {
    // TODO: show more details (action layers)?
    return this.next ? codeStr : emptyCodeStr
  })

  // Indexer
  var indexer = link(proto, ':', function (index) {
    return typeof index === 'string' ? proto[index]
      : index instanceof Symbol$ ? proto[index.key] : null
  })

  // export type indexer.
  link(Type, 'indexer', indexer)
}
