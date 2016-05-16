'use strict'

var $export = require('../export')

module.exports = function iterate ($void) {
  var $ = $void.$

  // generate a global iterate method which will safely generate an iterator.
  $export($, 'iterate', function iterate (target) {
    if (Array.isArray(target)) {
      return $.Array.proto.iterate.call(target)
    }

    if (typeof target === 'number') {
      return $.Range.create(target).iterate()
    }

    return typeof target === 'object' && typeof target.iterate === 'function'
      ? target.iterate() : $.Class.create({
        value: null,
        next: function () {
          return false
        }
      })
  })
}
