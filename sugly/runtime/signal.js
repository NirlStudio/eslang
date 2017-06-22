'use strict'

module.exports = function ($void) {
  // the signal object to be used in control flow.
  $void.Signal = function Signal$ (id, value, count) {
    this.id = id
    this.value = value
    this.count = count
  }
}
