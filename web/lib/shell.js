'use strict'

var term = require('./term')
var $void = require('../index')

var next = typeof window.onload === 'function' ? window.onload : null
window.onload = function () {
  next && next()
  var sugly = $void(term()/*, stdin, stdout, loader */)

  // start shell and expose the shell's reader function.
  var initializing = sugly.shell(/* context, app (to run) or args (for shell) */)
  if (!(initializing instanceof Promise)) {
    console.info('shell is ready.')
    return
  }

  console.info('initializing shell ...')
  initializing.then(function () {
    console.info('shell is ready now.')
  }, function (err) {
    console.info('shell failed to be initialized for', err)
  })
}
