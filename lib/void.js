'use strict'

var os = require('os')
var proc = global.process

module.exports = function (createStdout, createLoader) {
  var $void = require('../es')(
    createStdout || require('./stdout'),
    createLoader || require('./loader')
  )

  // load native Espresso module extension.
  require('./modules')($void)
  // load native io provider.
  require('./io')($void)

  // prepare app environment.
  $void.env('home', proc.env.PWD || proc.cwd())
  $void.env('user-home', os.homedir())
  $void.env('os', os.platform() + '/' + os.release() + ' (' + os.arch() + ')')

  return $void
}
