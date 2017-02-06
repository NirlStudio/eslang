'use strict'

module.exports = function iterate ($void) {
  var $ = $void.$
  var constant = $void.constant

  // generate a global iterate method which will safely generate an iterator.
  constant($, 'iterate', function iterate (target) {
    if (Array.isArray(target)) {
      return $.Array.proto.iterate.call(target)
    }

    if (typeof target === 'number') {
      return $.Range.create(target).iterate()
    }

    return target && typeof target === 'object' && typeof target.iterate === 'function'
      ? target.iterate() : $.Class.create({
        // an empty iterator
        value: null,
        next: function () {
          return false
        },
        'is-empty': function () {
          return true
        }
      })
  })
}
