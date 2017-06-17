'use strict'

module.exports = function meta ($void) {
  var $ = $void.$
  var object = $.object
  var $export = $void.export

  $export($, '-runtime', object.of({
    'core': 'js', // native implementation.
    'is-readonly': true,

    'version': object.of({
      'major': 0,
      'minor': 3,
      'patch': 0,
      'is-readonly': true
    }),

    'environment': object.of({
      'debugging': false
    })
  }))
}
