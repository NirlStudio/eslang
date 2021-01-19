'use strict'

module.exports = function jsonIn ($void) {
  var $ = $void.$
  var $Object = $.object
  var link = $void.link
  var $export = $void.export

  var json = $Object.empty()
  link(json, 'of', function (value, defaultJson) {
    try {
      return typeof value === 'undefined' ? 'null'
        : JSON.stringify(value, null, '  ')
    } catch (err) {
      return typeof defaultJson === 'undefined' ? null : defaultJson
    }
  })

  link(json, 'parse', function (json, defaultValue) {
    if (typeof defaultValue === 'undefined') {
      defaultValue = null
    }
    try {
      return typeof json === 'string' ? JSON.parse(json) : defaultValue
    } catch (err) {
      return defaultValue
    }
  })

  $export($, 'json', json)
}
