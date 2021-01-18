'use strict'

module.exports = function ($void) {
  $void.$symbols = require('../../../lib/modules/symbols')($void)
  $void.$restful = require('../../../lib/modules/restful')($void)

  function loadDefault (moduleUri) {
    switch (moduleUri) {
      case 'io':
        return $void.$io

      case 'restful':
        return $void.$restful

      case 'shell':
        return $void.$shell

      case 'symbols':
        return $void.$symbols

      case 'global':
        return window

      default:
        return null
    }
  }

  function $require (moduleUri, baseUri) {
    return loadDefault(moduleUri) || null
  }

  return $require
}
