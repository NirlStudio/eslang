'use strict'

var path = require('path')

module.exports = function $path ($void) {
  var safelyAssign = $void.safelyAssign

  var $path = Object.create(null)
  $path.http = require('./path-http')($void)
  safelyAssign($path, path)

  return $path
}
