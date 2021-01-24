'use strict'

var packageInfo = require('../../package.json')

module.exports = function runtime ($void) {
  var $ = $void.$
  var $export = $void.export
  var emptyObject = $.object.empty

  var environment = Object.assign(Object.create(null), {
    'runtime-core': 'js',
    'runtime-host': $void.isNativeHost ? 'native' : 'browser',
    'runtime-version': packageInfo.version,
    'is-debugging': true,
    'logging-level': 3
  })

  // this will be put into app space only.
  $void.$env = $export($void.$app, 'env', function (name, defaulue) {
    return typeof name === 'undefined' || name === null
      ? Object.assign(emptyObject(), environment)
      : typeof name !== 'string' ? null
        : typeof environment[name] !== 'undefined' ? environment[name]
          : typeof defaulue !== 'undefined' ? defaulue : null
  })

  // allow runtime to update environment.
  $void.env = function (name, value) {
    return typeof value === 'undefined' ? environment[name]
      : (environment[name] = value)
  }
}
