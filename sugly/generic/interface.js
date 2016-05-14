'use strict'

// iterable & iterator, ordering & comparable, collection, indexed-collection?
module.exports = function ($) {
  var type = $.Interface
  type.abstract = true // abstract
  type.derive = null

  var class_ = type.class
  class_.derive = function () {
    // TODO - override to ensure the direct invocation of 'create'.
  }
  class_.implement = function () {
    // TODO - override to create an object implementing this interface.
  }
}
