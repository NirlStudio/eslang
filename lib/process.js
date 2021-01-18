'use strict'

module.exports = function ($void) {
  return {
    env: function (name) {
      var value = process.env[name]
      return typeof value === 'string' ? value : null
    },
    exit: function (code) {
      process.exit(typeof code === 'number' ? code >> 0 : 1)
    }
  }
}
