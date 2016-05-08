'use strict'

module.exports = function signal ($) {
  $.$Signal = function $Signal (type, value) {
    this.type = type
    this.value = value
  }
}
