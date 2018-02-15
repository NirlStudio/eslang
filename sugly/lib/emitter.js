'use strict'

module.exports = function device ($void) {
  var $ = $void.$
  var $Object = $.object
  var $export = $void.export
  var createClass = $void.createClass
  var ownsProperty = $void.ownsProperty

  var emitter = $export($, 'emitter', createClass())
  emitter.proto.on = function (event, listener) {
    if (!this._listeners) {
      this._listeners = $Object.empty()
    }
    if (typeof event === 'string') {
      if (typeof listener === 'undefined') { // query
        return this._listeners[event]
      }
      if (!this.events || ownsProperty(this.events, event)) {
        this._listeners[event] = listener
      }
    }
    return this
  }

  emitter.proto.off = function (event) {
    if (this._listeners && typeof event === 'string' &&
      ownsProperty(this._listeners, event)) {
      delete this._listeners[event]
    }
    return this
  }

  emitter.proto.emit = function (event) {
    if (this._listeners && typeof event === 'string' &&
      ownsProperty(this._listeners, event)) {
      var listener = this._listeners[event]
      if (typeof listener === 'function') {
        return listener.apply(this, arguments)
      }
      if (typeof listener.do === 'function') {
        return listener.do.apply(listener, arguments)
      }
    }
    return null
  }
}
