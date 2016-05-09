'use strict'

module.exports = function space ($) {
  var set = $.$set
  var symbolValueOf = $.Symbol['value-of']
  var isSymbol = $.Symbol.is

  var $functionIn = $.$functionIn
  var $lambdaIn = $.$lambdaIn

  var $evalIn = $.$evalIn
  var $loadIn = $.$loadIn
  var $execIn = $.$execIn
  var $runIn = $.$runIn
  var $importIn = $.$importIn
  var $requireIn = $.$requireIn

  $.$spaceCounter = 0
  $.spaceIdentifier = 'space-0'
  $.moduleSpaceIdentifier = $.spaceIdentifier

  // generate an export function for $.
  function $exportTo ($) {
    return function $export (key, value) {
      if (typeof key === 'string') {
        key = symbolValueOf(key)
      } else if (!isSymbol(key)) {
        return null
      }
      return set($, key, typeof value === 'undefined' ? null : value)
    }
  }

  function $createSpace (parent) {
    var space = Object.create(parent)
    $.$spaceCounter += 1
    space.spaceIdentifier = 'space-' + $.$spaceCounter
    space.$loops = [] // new loop stack
    space.$OprStack = [] // new operator stack
    return space
  }

  function $initializeModuleSpace (space, attachExport) {
    if (attachExport) {
      // overridding parent.export
      space.$export('export', $exportTo(space))
    }

    // isolate function & lambda to the most recent module
    space.$export('function', $functionIn(space))
    space.$export('lambda', $lambdaIn(space))

    // isolate eval space to the most recent module
    space.$export('eval', $evalIn(space))

    // resolving will base on the directory of current space
    space.$export('load', $loadIn(space))
    space.$export('exec', $execIn(space))
    space.$export('run', $runIn(space))
    space.$export('import', $importIn(space))
    space.$export('require', $requireIn(space))
  }

  // initiaize global space as a module.
  $.$modules = {}
  $.$createSpace = $createSpace // for $.function & $.lambda
  $.$initializeModuleSpace = $initializeModuleSpace
  $.$dir = __dirname

  $.$createModuleSpace = function $createModuleSpace (sealing, dir) {
    var space = $createSpace($, sealing)
    space.moduleSpaceIdentifier = space.spaceIdentifier
    if (dir && dir !== space.$dir) {
      space.$dir = dir // save base dir if it is changing for this space.
    }

    if (sealing) {
      // isolate operators
      space.$operators = Object.assign({}, space.$operators)
      // separate modules
      space.$modules = {}
    }

    $initializeModuleSpace(space, sealing)
    return space
  }
}
