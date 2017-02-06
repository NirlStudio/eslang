'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var object = $.object
  var constant = $void.constant
  var copyObject = $void.copyObject

  var json = constant($, 'json', object())
  copyObject(json, JS.JSON, {
    'stringify': 'string-of',
    'parse': 'parse'
  })
  return json
}
