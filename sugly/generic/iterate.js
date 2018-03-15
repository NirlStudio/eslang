'use strict'

function accumulator (value, sum) {
  if (!Array.isArray(sum)) {
    sum = []
  }
  return sum.push(Array.isArray(value) ? value.length > 0 ? value[0] : null : value)
}

module.exports = function iterate ($void) {
  var $ = $void.$
  var $export = $void.export
  var thisCall = $void.thisCall

  // iterate with an optional converting or mapping function.
  var iterate = $export($, 'iterate', function (source, convert, subject) {
    var next
    if (typeof source === 'function') {
      next = source
      if (typeof subject === 'undefined') {
        subject = null // no default conversion subject.
      }
    } else {
      next = thisCall(source, 'iterate')
      if (typeof subject === 'undefined' || subject === null) {
        subject = source // use the source as default conversion subject.
      }
    }
    if (typeof next !== 'function') {
      return null // no iterator
    }
    if (typeof convert !== 'function') {
      return next // no convesion
    }
    var item, value
    return function (inSitu) {
      if (item !== null && inSitu) {
        return value
      }
      item = next()
      if (typeof item === 'undefined' || item === null) {
        return null
      }
      return (value = Array.isArray(item)
        ? convert.apply(subject, item) : convert.call(subject, item))
    }
  })

  // generate an iterator from a coverter
  $export($, 'iterator', function (convert, subject) {
    return function (source) {
      return iterate(source, convert, subject)
    }
  })

  // extract some elements from an iterable entity with a filter function.
  var select = $export($, 'select', function (source, filter, subject) {
    var next
    if (typeof source === 'function') {
      next = source
      if (typeof subject === 'undefined') {
        subject = null // no default conversion subject.
      }
    } else {
      next = thisCall(source, 'iterate')
      if (typeof subject === 'undefined' || subject === null) {
        subject = source // use the source as default conversion subject.
      }
    }
    if (typeof next !== 'function') {
      return null // no iterator
    }
    if (typeof filter !== 'function') {
      return next // no filter
    }
    var item
    return function (inSitu) {
      if (item !== null && inSitu) {
        return item
      }
      item = next()
      while (typeof item !== 'undefined' && item !== null) {
        if (Array.isArray(item)
          ? filter.apply(subject, item) : filter.call(subject, item)) {
          return item
        }
        item = next()
      }
      return null
    }
  })

  // generate an iterator from a filter
  $export($, 'selector', function (filter, subject) {
    return function (source) {
      return select(source, filter, subject)
    }
  })

  // accumulate iteration output to a value from an iterator or iterable entity.
  var collect = $export($, 'collect', function (source, accumulate, subject) {
    var next
    if (typeof source === 'function') {
      next = source
      if (typeof subject === 'undefined') {
        subject = null // no default conversion subject.
      }
    } else {
      next = thisCall(source, 'iterate')
      if (typeof subject === 'undefined' || subject === null) {
        subject = source // use the source as default conversion subject.
      }
    }
    if (typeof next !== 'function') {
      return null // no iterator
    }
    if (typeof accumulate !== 'function') {
      accumulate = accumulator
    }
    var sum = null
    var item = next()
    while (typeof item !== 'undefined' && item !== null) {
      var args
      if (Array.isArray(item)) {
        args = [sum]
        args.push.apply(args, item)
      } else {
        args = [sum, item]
      }
      sum = accumulate.apply(subject, args)
      item = next()
    }
    return sum
  })

  // generate an iterator from a coverter
  $export($, 'collector', function (accumulate, subject) {
    return function (source) {
      return collect(source, accumulate, subject)
    }
  })

  // generate an iterator from a coverter
  var reduce = $export($, 'reduce', function (source) {
    var next = typeof source === 'function' ? source : thisCall(source, 'iterate')
    if (typeof next !== 'function') {
      return null
    }
    for (var i = 1; i < arguments.length; i++) {
      var processor = arguments[i]
      if (typeof processor === 'function') {
        next = processor(next)
      } else {
        next = processor
      }
    }
    return next
  })

  // generate a reducer from a series of processors of iterator, selector and accumulator.
  $export($, 'reducer', function () {
    var args = [null]
    args.push.apply(args, arguments)
    return function (source) {
      var args = [source]
      return reduce.apply(null, args)
    }
  })
}
