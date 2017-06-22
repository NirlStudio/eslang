'use strict'

module.exports = function iterate ($void) {
  var $ = $void.$
  var $export = $void.export
  var thisCall = $void.thisCall

  // wrap an iterator or iterable entity with a filter function.
  $export($, 'iterate', function (source, filter, subject) {
    var next
    if (typeof source === 'function') {
      next = source
      if (typeof subject === 'undefined') {
        subject = null // no default filter subject.
      }
    } else {
      next = thisCall(source, 'iterate')
      if (typeof subject === 'undefined' || subject === null) {
        subject = source // the source as default filter subject.
      }
    }
    if (typeof next !== 'function') {
      return null // no iterator function
    }
    if (typeof filter !== 'function') {
      return next // no filter
    }
    if (typeof subject === 'undefined') {
      subject = null
    }
    return function () {
      var item = next()
      if (typeof item === 'undefined' || item === null) {
        return null
      }
      return Array.isArray(item)
        ? filter.apply(subject, item) : filter.call(subject, item)
    }
  })
  // to exhaust an iterator function.
  $export($, 'to', function (next) {
    if (typeof next !== 'function') {
      return 0
    }
    var counter = 0
    var item = next()
    while (typeof item !== 'undefined' && item !== null) {
      counter++
      item = next()
    }
    return counter
  })
  // collect the primary output from an iterator or iterable entity.
  $export($, 'collect', function (source) {
    var next
    if (typeof source === 'function') {
      next = source
    } else {
      next = thisCall(source, 'iterate')
      if (typeof next !== 'function') {
        return null
      }
    }
    var result = []
    var item = next()
    while (typeof item !== 'undefined' && item !== null) {
      if (Array.isArray(item)) {
        if (item.length > 0) {
          result.push(item[0])
        }
      } else {
        result.push(item)
      }
      item = next()
    }
  })
}
