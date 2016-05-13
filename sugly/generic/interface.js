'use strict'

module.exports = function ($) {
  var type = $.Interface
  type.abstract = true // abstract
  type.derive = null

  var class_ = type.class
  class_.derive = function () {
    // TODO
  }
  class_.implement = function () {
    // TODO
  }

  return type
}
