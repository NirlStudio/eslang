'use strict'

module.exports = function runtime ($void) {
  var $ = $void.$
  var object = $.object
  var $export = $void.export

  var runtime = $export($, '-runtime', object.of({
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

  var environment = $['-runtime']['environment']
  $export($, 'env', function (name, defaulue) {
    return typeof name === 'string' && typeof environment[name] !== 'undefined'
      ? environment[name] : typeof defaulue === 'undefined' ? null : defaulue
  })

  $void.env = function (name, value) {
    return typeof value === 'undefined'
      ? environment[name] : (environment[name] = value)
  }

  $void.runtime = function (name, value) {
    return typeof value === 'undefined'
      ? runtime[name] : (runtime[name] = value)
  }
}
