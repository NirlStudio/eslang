'use strict'

var proc = global.process

module.exports = function ($void) {
  return {
    env: function (name) {
      var value = proc.env[name]
      return typeof value === 'string' ? value : null
    },
    exit: function (code) {
      proc.exit(typeof code === 'number' ? code >> 0 : 1)
      // never reaching here, but if it does, indicating not-exiting.
      return true
    }
  }
}
