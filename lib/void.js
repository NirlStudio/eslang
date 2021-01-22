'use strict'

var os = require('os')
var path = require('path')

var stdout = require('./stdout')
var loader = require('./loader')

module.exports = function () {
  // create the void.
  var $void = require('../es/start')(stdout)

  // set the location of the runtime
  $void.runtime('home', path.resolve(__dirname, '..'))

  // prepare app environment.
  var home = process.env.PWD || process.cwd()
  $void.env('home', home)
  $void.env('user-home', os.homedir())
  $void.env('os', os.platform() + '/' + os.release() + ' (' + os.arch() + ')')

  // create the source loader
  $void.loader = loader($void)

  // mount module loader.
  $void.module = require('./module')($void)
  // mount native module loader.
  $void.module.native = require('./module-native')($void)

  return $void
}
