'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export
  var copyType = $void.copyType

  var json = $export($, 'json', new Object$({
    'is-readonly': true
  }))
  // TODO - type adaptation
  copyType(json, JS.JSON, {
    'stringify': 'string-of',
    'parse': 'parse'
  })
}
