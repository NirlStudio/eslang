'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.object
  var link = $void.link
  var $export = $void.export

  var uri = $Object.empty()
  link(uri, 'encode', function (str) {
    return typeof str !== 'string' ? null : encodeURI(str)
  })

  link(uri, 'decode', function (str, defaultValue) {
    if (typeof str !== 'string') {
      return typeof defaultValue === 'undefined' ? null : defaultValue
    }
    if (typeof defaultValue === 'undefined') {
      return decodeURI(str)
    }
    try {
      return decodeURI(str)
    } catch (err) {
      return defaultValue
    }
  })

  link(uri, 'escape', function (str) {
    return typeof str !== 'string' ? null : encodeURIComponent(str)
  })

  link(uri, 'unescape', function (str, defaultValue) {
    if (typeof str !== 'string') {
      return typeof defaultValue === 'undefined' ? null : defaultValue
    }
    if (typeof defaultValue === 'undefined') {
      return decodeURIComponent(str)
    }
    try {
      return decodeURIComponent(str)
    } catch (err) {
      return defaultValue
    }
  })

  $export($, 'uri', uri)
}
