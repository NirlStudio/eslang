'use strict'

var os = require('os')

var stdout = require('./stdout')
var loader = require('./loader')

module.exports = function () {
  var $void = require('../es')(stdout, loader)

  // load native Espresso module extension.
  require('./module-native')($void)
  // load native io provider.
  require('./io')($void)

  // prepare app environment.
  $void.env('home', process.env.PWD || process.cwd())
  $void.env('user-home', os.homedir())
  $void.env('os', os.platform() + '/' + os.release() + ' (' + os.arch() + ')')

  return $void
}
