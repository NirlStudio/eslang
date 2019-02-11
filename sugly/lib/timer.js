'use strict'

var Started = 'started'
var Elapsed = 'elapsed'
var Stopped = 'stopped'
var DefaultInterval = 1000

function safeDelayOf (milliseconds, defaultValue) {
  return typeof milliseconds !== 'number' ? (defaultValue || 0)
    : (milliseconds >>= 0) <= 0 ? (defaultValue || 0)
      : milliseconds
}

module.exports = function timer ($void) {
  var $ = $void.$
  var $Emitter = $.emitter
  var promiseOf = $.promise.of
  var link = $void.link
  var $export = $void.export
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable
  var ownsProperty = $void.ownsProperty

  // a timer is an emitter.
  var timer = createClass().as($Emitter)

  link(timer, 'timeout', function (milliseconds, callback) {
    if (isApplicable(milliseconds)) {
      callback = milliseconds
      milliseconds = 0
    } else {
      milliseconds = safeDelayOf(milliseconds)
      if (!isApplicable(callback)) {
        return milliseconds
      }
    }
    // a simple non-cancellable timeout.
    setTimeout(callback.bind(null, milliseconds), milliseconds)
    return milliseconds
  })

  link(timer, 'countdown', function (milliseconds) {
    milliseconds = safeDelayOf(milliseconds)
    // a cancellable promise-based timeout.
    return promiseOf(function (async) {
      var id = setTimeout(function () {
        if (id !== null) {
          id = null
          async.resolve(milliseconds)
        }
      }, milliseconds)
      return function cancel () {
        if (id !== null) {
          clearTimeout(id)
          id = null
          async.reject(milliseconds)
        }
      }
    })
  })

  var proto = timer.proto
  link(proto, 'constructor', function (interval, listener) {
    // call super constructor
    $Emitter.proto.constructor.call(this, Started, Elapsed, Stopped)
    // apply local constructor logic
    this.interval = safeDelayOf(interval, DefaultInterval)
    if (isApplicable(listener)) {
      this.on(Elapsed, listener)
    }
  })

  link(proto, 'activator', function () {
    // call super activator
    $Emitter.proto.activator.apply(this, arguments)

    // apply local activator logic
    this.interval = safeDelayOf(this.interval, DefaultInterval)

    // trying to fix corrupted fields
    var listeners = this.listeners
    var fix = function (event) {
      if (!Array.isArray(listeners[event])) {
        listeners[event] = []
      }
    }
    fix(Started); fix(Elapsed); fix(Stopped)
    if (ownsProperty.call(this, 'stop')) {
      delete this.stop
    }
  })

  link(proto, 'start', function (args) {
    if (this.stop !== stop) {
      return this // the timer is active already.
    }
    if (typeof args === 'undefined') {
      args = this.interval
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
    // make this method overridable by an instance method.
    if (this.stop !== stop && isApplicable(this.stop)) {
      this.stop()
      delete this.stop
    }
    return this
  })

  $export($void, '$timer', timer)
}
