'use strict'

var $export = require('../export')
var dump = $export.dump(Date)

var $type = {}
Object.assign($type, dump.constants)
Object.assign($type, dump.utils)

var $inst = {}
Object.assign($inst, dump.props)
Object.assign($inst, dump.methods)

function create () {
  return function Date$create (x, y, z) {
    return undefined
  }
}

module.exports = function ($) {
  var $Bool = $export.copy('Date', $type, {
    '?': 'is'
  })

  $Bool.create = create()

  $Bool.$ = $export.copy('$', $inst)

  return $Bool
}
