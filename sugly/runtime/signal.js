'use strict'

module.exports = function signal ($void) {
  $void.Signal = function $Signal (type, value) {
    this.type = type
    this.value = value
  }
}
