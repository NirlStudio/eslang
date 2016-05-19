'use strict'

var $export = require('../export')

module.exports = function space ($void) {
  var functionIn = $void.functionIn
  var runIn = $void.runIn

  $void.spaceCounter = 0
  $void.spaceIdentifier = 'void'
  $void.moduleIdentifier = $void.spaceIdentifier

  // prepare void as a module space.
  $void.modules = {}
  $void.spaceStack = {
    scopes: [],
    frames: [],
    push: function (scope, func, args) {
      this.scopes.push(scope)
      this.frames.push('' + func.name || func)
      if (this.frames.length > 1000) {
        console.log(this.frames.slice(-3))
        throw new RangeError('dead loop?', this.frames)
      }
    },
    pop: function () {
      this.scopes.pop()
      this.frames.pop()
    },
    current: function () {
      return this.scopes.length > 0 ? this.scopes[this.scopes.length - 1] : null
    }
  }

  function exportTo (space) {
    $export(space.$, 'export', function export_ (key, value) {
      if (typeof key !== 'string') {
        return null
      }
      return (space.$[key] = typeof value === 'undefined' ? null : value)
    })
  }

  var createSpace = $void.createSpace = function $createSpace (parent) {
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

  var initializeModuleSpace = $void.initializeModuleSpace = function $initializeModuleSpace (space, attachExport) {
    if (attachExport) {
      // overridding parent.export
      exportTo(space)
    }

    functionIn(space)
    runIn(space)
  }

  $void.createModuleSpace = function $createModuleSpace (sealing, dir) {
    var space = createSpace($void)
    space.sealing = sealing
    space.moduleIdentifier = space.spaceIdentifier
    space.operators = {}

    if (dir && dir !== space.dir) {
      space.dir = dir // save base dir if it is changing for this space.
    }
    if (sealing) {
      space.modules = {} // separate module cache
    }

    initializeModuleSpace(space, sealing)
    return space
  }
}
