'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.object
  var link = $void.link
  var $export = $void.export
  var isObject = $void.isObject
  var thisCall = $void.thisCall
  var createClass = $void.createClass
  var isApplicable = $void.isApplicable

  var emitter = createClass()
  var proto = emitter.proto
  link(proto, 'listeners', null)

  // define allowed events for this emitter
  link(proto, 'constructor', function () {
    var listeners = this.listeners = $Object.empty()
    for (var i = 0; i < arguments.length; i++) {
      var event = arguments[i]
      if (typeof event === 'string') {
        listeners[event] = []
      }
    }
  })

  // clear legacy event handler on activation.
  link(proto, 'activator', function () {
    if (!isObject(this.listeners)) {
      this.listeners = $Object.empty()
      return
    }
    var events = Object.getOwnPropertyNames(this.listeners)
    for (var i = 0; i < events.length; i++) {
      var listeners = this.listeners[events[i]]
      if (Array.isArray(listeners)) {
        for (var j = listeners.length - 1; j >= 0; j--) {
          if (thisCall(listeners[j], 'is-empty')) {
            listeners.splice(j, 1) // remove empty listeners
          }
        }
      }
    }
  })

  // (an-emitter on) queries allowed events.
  // (an-emitter on event) queries all listeners for an event
  // (an-emitter on event listener) registers a listener for the event.
  link(proto, 'on', function (event, listener) {
    if (!isObject(this.listeners)) {
      return null // invalid emitter instance.
    }
    // query events
    if (typeof event !== 'string') {
      return Object.getOwnPropertyNames(this.listeners)
    }
    // query listeners for an event.
    if (!isApplicable(listener)) {
      return this.listeners[event] || null
    }
    // register an event listener
    var listeners = this.listeners[event]
    if (!Array.isArray(listeners)) {
      return null // invalid emitter instance
    }
    listeners.push(listener)
    return listeners
  })

  // (an-emitter off) clears all listeners for all events.
  // (an-emitter off event) clears all listeners for the event.
  // (an-emitter on event listener) clears a listener for the event.
  link(proto, 'off', function (event, listener) {
    if (!isObject(this.listeners)) {
      return null
    }
    var i, listeners
    // clear all event listeners.
    if (typeof event !== 'string') {
      var events = Object.getOwnPropertyNames(this.listeners)
      for (i = 0; i < events.length; i++) {
        listeners = this.listeners[events[i]]
        if (Array.isArray(listeners)) {
          listeners.splice(0)
        }
      }
      return events
    }
    // clear listeners for an event.
    listeners = this.listeners[event]
    if (!Array.isArray(listeners)) {
      return null
    }
    if (!isApplicable(listener)) {
      listeners.splice(0)
      return listeners
    }
    // clear a particular listener
    for (i = 0; i < listeners.length; i++) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1)
        break
      }
    }
    return listeners
  })

  link(proto, 'emit', function (event, args) {
    if (!isObject(this.listeners) || typeof event !== 'string') {
      return null // invalid emitter instance.
    }
    var listeners = this.listeners[event]
    if (!Array.isArray(listeners)) {
      return null // partially invalid emitter instance at least.
    }
    if (typeof args === 'undefined') {
      args = event
    }
    var handled = false
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i]
      if (isApplicable(listener)) {
        if (listener(args, this, event) === true) {
          return true // event has been handled at least once.
        }
        handled = true
      }
    }
    return handled // no listener to handle this event.
  })

  $export($, 'emitter', emitter)
}
