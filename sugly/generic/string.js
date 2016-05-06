'use strict'

var $export = require('../export')
var dump = $export.dump(Boolean)

var $type = {}
Object.assign($type, dump.constants)
Object.assign($type, dump.utils)

var $inst = {}
Object.assign($inst, dump.props)
Object.assign($inst, dump.methods)

function create () {
  return function Bool$create (x, y, z) {
    return undefined
  }
}

module.exports = function ($) {
  var $Bool = $export.copy('Bool', $type, {
    '?': 'is'
  })

  $Bool.create = create()

  $Bool.$ = $export.copy('$', $inst)

  return $Bool
}
