'use strict'

var $export = require('../export')

module.exports = function iterate ($) {
  var type = $.Iterator
  type.abstract = true // abstract

  var class_ = type.class
  class_.next = $.Function // required, it must be a function
  class_.value = $.Null    // required, it can be any type
  class_.key = null        // optional

  // generate a global iterate method which will always generate an empty iterator.
  $export($, 'iterate', function (target) {
    if (Array.isArray(target)) {
      return $.Array.class.iterate.call(target)
    }

    if (typeof target === 'number') {
      return $.Range.create(target).iterate()
    }

    return typeof target === 'object' && typeof target.iterate === 'function'
      ? target.iterate() : {
        value: null,
        next: function () {
          return false
        },
        'is-empty': function () {
          return true
        },
        'not-empty': function () {
          return false
        }
      }
  })
}
