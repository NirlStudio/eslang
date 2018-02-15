'use strict'

module.exports = function timer ($void) {
  var $ = $void.$
  var $Emitter = $.emitter
  var $export = $void.export
  var createClass = $void.createClass

  var timer = $export($, 'timer', createClass())
  timer.as($Emitter)

  timer.timeout = function (milliseconds, listener) {
    var events = $Emitter.empty()
    events.on('timeout', listener)
    var id = setTimeout(function () {
      events.emit('timeout')
    }, milliseconds)
    return clearTimeout.bind(null, id)
  }

  timer.proto.constructor = function (interval, listener) {
    this.interval = interval
    this.on('timeout', listener)
  }

  timer.proto.start = function () {
    var events = this
    var id = setInterval(function () {
      events.emit('timeout')
    }, this.interval)
    this.stop = clearInterval.bind(null, id)
  }

  var stop = timer.proto.stop = function () {
    if (this.stop !== stop) {
      this.stop()
      delete this.stop
    }
  }
}
