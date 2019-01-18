'use strict'

var Timeout = 'timeout'
var Cancelled = 'cancelled'

var Started = 'started'
var Elapsed = 'elapsed'
var Stopped = 'stopped'
var DefaultInterval = 1000

module.exports = function timer ($void) {
  var $ = $void.$
  var $Emitter = $.emitter
  var link = $void.link
  var $export = $void.export
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable
  var ownsProperty = $void.ownsProperty

  // a timer is an emitter.
  var timer = createClass().as($Emitter)

  link(timer, 'timeout', function (milliseconds, listener) {
    // an invalid timespan value will be replaced to 0.
    if (typeof milliseconds !== 'number' || (milliseconds >>= 0) < 0) {
      milliseconds = 0
    }
    // use a default emitter to manage events
    var emitter = $Emitter.of(Timeout, Cancelled)
    emitter.on(Timeout, listener)
    emitter.on(Cancelled, listener)
    // create inner timeout.
    var id = setTimeout(function () {
      emitter.emit(Timeout, milliseconds)
    }, milliseconds)
    // construct and return the canceling function
    return function () {
      if (id !== null) {
        clearTimeout(id)
        id = null
        emitter.emit(Cancelled, milliseconds)
      }
    }
  })

  var proto = timer.proto
  link(proto, 'constructor', function (interval, listener) {
    // call super constructor
    $Emitter.proto.constructor.call(this, Started, Elapsed, Stopped)
    // apply local constructor logic
    this.interval = typeof interval === 'number' && (interval >>= 0) > 0
      ? interval : DefaultInterval
    if (isApplicable(listener)) {
      this.on(Elapsed, listener)
    }
  })

  link(proto, 'activator', function () {
    // call super activator
    $Emitter.proto.activator.apply(this, arguments)
    // apply local activator logic
    if (!Number.isSafeInteger(this.interval) || this.interval <= 0) {
      this.interval = DefaultInterval
    }
    if (ownsProperty.call(this, 'stop')) {
      delete this.stop
    }
  })

  link(proto, 'start', function (args) {
    if (this.stop !== stop) {
      return this // the timer is active already.
    }
    // create inner timer.
    var id = setInterval(function () {
      this.emit(Elapsed, args)
    }.bind(this), this.interval)
    // construct the stop function to wrap the native timer.
    this.stop = function () {
      if (id !== null) {
        clearInterval(id)
        id = null
        this.emit(Stopped, args)
      }
    }.bind(this)
    // raise the started event after stop function is ready.
    this.emit(Started, args)
    return this
  })

  link(proto, 'is-elapsing', function () {
    return this.stop !== stop
  })

  var stop = link(proto, 'stop', function () {
    // make this method overrideable by an instance method.
    if (this.stop !== stop && isApplicable(this.stop)) {
      this.stop()
      delete this.stop
    }
    return this
  })

  $export($void, '$timer', timer)
}
