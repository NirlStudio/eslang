'use strict'

module.exports = function runtime ($void) {
  var $ = $void.$
  var $export = $void.export

  var runtime = Object.assign(Object.create(null), {
    'runtime-core': 'js',
    'runtime-version': '0.4.1'
  })

  var environment = Object.assign(Object.create(runtime), {
    'is-debugging': false
  })

  $export($, 'env', function (name, defaulue) {
    return typeof name === 'string' && typeof environment[name] !== 'undefined'
      ? environment[name]
      : typeof defaulue !== 'undefined' ? defaulue : null
  })

  $void.env = function (name, value) {
    return typeof value === 'undefined' ? environment[name]
      : typeof runtime[name] !== 'undefined' ? runtime[name]
        : (environment[name] = value)
  }

  $void.runtime = function (name, value) {
    name = 'runtime-' + name
    return typeof value === 'undefined'
      ? runtime[name] : (runtime[name] = value)
  }
}
