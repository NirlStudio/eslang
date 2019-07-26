'use strict'

var $void = require('../index')
var term = require('./term')

var sugly = $void(term()/*, stdin, stdout, loader */)
// start shell and expose the shell's reader function.
var initializing = sugly.shell(/* context, args, profile */)
if (!(initializing instanceof Promise)) {
  console.info('shell is ready.')
} else {
  console.info('initializing shell ...')
  initializing.then(function () {
    console.info('shell is ready now.')
  }, function (err) {
    console.error('shell failed to be initialized for', err)
  })
}
