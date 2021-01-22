'use strict'

var term = require('./term')()
var $void = require('../index')(
  term /*, - use web page based terminal
  stdout,  - use default [term + console (as tracer)] based stdout
  loader   - use default axios-based http loader */
)

// start shell and expose the shell's reader function.
var initializing = $void.web.shell(/*
  context, - fetch from the default url: page-home/@.es
  stdin,   - use default term-based stdin
  exit     - use reloading page to mimic an exit */
)

if (!(initializing instanceof Promise)) {
  console.info('shell is ready.')
} else {
  console.info('initializing shell ...')
  initializing.then(function () {
    console.info('shell is ready now.')
  }, function (err) {
    console.error('shell failed to initialize for', err)
  })
}
