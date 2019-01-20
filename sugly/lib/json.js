'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var $Object = $.object
  var link = $void.link
  var $export = $void.export

  var json = $Object.empty()
  link(json, 'of', function (value, defaultJson) {
    if (typeof value === 'undefined') {
      return 'null'
    }
    if (typeof defaultJson === 'undefined') {
      return JSON.stringify(value)
    }
    try {
      return JSON.stringify(value)
    } catch (err) {
      return defaultJson
    }
  })

  link(json, 'parse', function (json, defaultValue) {
    if (typeof json !== 'string') {
      return typeof defaultValue === 'undefined' ? null : defaultValue
    }
    if (typeof defaultValue === 'undefined') {
      return JSON.parse(json)
    }
    try {
      return JSON.parse(json)
    } catch (err) {
      return defaultValue
    }
  })

  $export($, 'json', json)
}
