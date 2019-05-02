'use strict'

var os = require('os')
var proc = global.process

module.exports = function (createStdout, createLoader) {
  var $void = require('../sugly')(
    createStdout || require('./stdout'),
    createLoader || require('./loader')
  )

  $void.env('home', proc.env.PWD || proc.cwd())
  $void.env('user-home', os.homedir())
  $void.env('os', os.platform() + '/' + os.release() + ' (' + os.arch() + ')')

  return $void
}
