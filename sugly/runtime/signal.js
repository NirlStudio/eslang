'use strict'

module.exports = function ($void) {
  // the signal object to be used in control flow.
  $void.Signal = function Signal$ (id, count, value) {
    this.id = id
    this.count = count
    this.value = value
  }
}
