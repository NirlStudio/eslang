'use strict'

module.exports = function ($void, JS) {
  var $ = $void.$
  var Object$ = $void.Object
  var $export = $void.export
  var copyType = $void.copyType

  $export($, 'json', copyType(new Object$(), JS.JSON, {
    'stringify': 'of',
    'parse': 'parse'
  }))
}
