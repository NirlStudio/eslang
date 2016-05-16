'use strict'

var $export = require('../export')

module.exports = function space ($void) {
  var functionIn = $void.functionIn
  var runIn = $void.runIn

  $void.spaceCounter = 0
  $void.spaceIdentifier = 'void'
  $void.moduleIdentifier = $void.spaceIdentifier

  function exportTo (space) {
    $export(space.$, 'export', function export_ (key, value) {
      if (typeof key !== 'string') {
        return null
      }
      return (space.$[key] = typeof value === 'undefined' ? null : value)
    })
  }

  function $createSpace (parent) {
    $void.spaceCounter += 1
    return {
      parent: parent,
      spaceIdentifier: 'space-' + $void.spaceCounter,
       // new stack objects
      loops: [],
      oprStack: [],
      // new app space
      $: Object.create(parent.$)
    }
  }

  function $initializeModuleSpace (space, attachExport) {
    if (attachExport) {
      // overridding parent.export
      exportTo(space)
    }

    functionIn(space)
    runIn(space)
  }

  // prepare void as a module space.
  $void.modules = {}
  $void.createSpace = $createSpace // for functionIn
  $void.initializeModuleSpace = $initializeModuleSpace // for sugly.js

  $void.createModuleSpace = function $createModuleSpace (sealing, dir) {
    var space = $createSpace($void)
    space.sealing = sealing
    space.moduleIdentifier = space.spaceIdentifier
    space.operators = {}

    if (dir && dir !== space.dir) {
      space.dir = dir // save base dir if it is changing for this space.
    }
    if (sealing) {
      space.modules = {} // separate module cache
    }

    $initializeModuleSpace(space, sealing)
    return space
  }
}
