'use strict'

module.exports = function signal ($void) {
  $void.Signal = function $Signal (id, value) {
    this.id = id
    this.value = value
  }
}
