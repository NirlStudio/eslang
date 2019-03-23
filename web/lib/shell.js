'use strict'

// expose the creator function by default.
window.$void = require('../index')

window.onload = function () {
  // generate and expose a default runner function.
  window.$sugly = window.$void(/* term, stdout, loader */)

  // start shell and expose the shell's reader function.
  var shell = window.$sugly(/* context, app (to run) or args (for shell) */)
  shell instanceof Promise ? shell.then(function (sh) {
    window.$shell = sh
    console.info('shell is ready now.')
  }) : (window.$shell = shell)

  if (!window.$shell) {
    console.info('waiting shell to be ready ...')
  } else {
    console.info('shell is ready.')
  }
}
