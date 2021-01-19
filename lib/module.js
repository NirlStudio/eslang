'use strict'

module.exports = function ($void) {
  var env = $void.env

  var $module = Object.create(null)
  var $package = require('./package')($void)

  $module.resolve = function $resolve () {

  }

  $module.load = function $load () {

  }

  return $module
}
