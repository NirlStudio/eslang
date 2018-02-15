'use strict'

module.exports = function runtime ($void) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export

  var runtime = $export($, '-runtime', new Object$({
    'core': 'js',
    'version': new Object$({
      'major': 0,
      'minor': 3,
      'patch': 0
    }),
    'environment': new Object$({
      'debugging': false
    })
  }))

  var environment = runtime.environment
  $export($, 'env', function (name, defaulue) {
    return typeof name === 'string' && typeof environment[name] !== 'undefined'
      ? environment[name]
      : typeof defaulue === 'undefined' ? null : defaulue
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
