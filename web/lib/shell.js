'use strict'

var term = require('./term')
var $void = require('../index')

var next = typeof window.onload === 'function' ? window.onload : null
window.onload = function () {
  next && next()

  // generate and expose a default runner function.
  var sugly = $void(term()/*, stdin, stdout, loader */)

  // start shell and expose the shell's reader function.
  var init = sugly(/* context, app (to run) or args (for shell) */)
  if (!(init instanceof Promise)) {
    console.info('shell is ready.')
    return
  }

  console.info('waiting shell to be ready ...')
  init.then(function () {
    console.info('shell is ready now.')
  }, function (err) {
    console.info('shell failed to be initialized for', err)
  })
}
