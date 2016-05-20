'use strict'

var $export = require('../export')

module.exports = function execute ($void) {
  var Signal = $void.Signal
  var evaluate = $void.evaluate
  var createModuleSpace = $void.createModuleSpace
  var spaceStack = $void.spaceStack
  var compile = $void.$.compile

  $export($void.$.Function, 'execute', function function$execute (func) {
    try {
      return typeof func !== 'function' ? null
        : func.apply(null, Array.prototype.slice.call(arguments, 1))
    } catch (signal) {
      if (signal instanceof Signal &&
         (signal.type === 'return' || signal.type === 'exit')) {
        return signal.value
      } else {
        throw signal
      }
    }
  })

  $export($void.$.Function, 'execute-with', function function$execute_with (subject, func) {
    try {
      return typeof func !== 'function' ? null
        : func.apply(subject, Array.prototype.slice.call(arguments, 2))
    } catch (signal) {
      if (signal instanceof Signal &&
         (signal.type === 'return' || signal.type === 'exit')) {
        return signal.value
      } else {
        throw signal
      }
    }
  })

  $void.execute = function execute (program, source, dir) {
    if (typeof program === 'string') {
      // take string as source code.
      program = compile(program, source)
    }
    if (!Array.isArray(program)) {
      return null // unrecognized program type
    }

    var result = null
    try {
      // sealing if the source of code is not verified.
      var space = createModuleSpace(source.startsWith('?'), dir)
      spaceStack.push(space, source)
      var length = program.length
      for (var i = 0; i < length; i++) {
        result = evaluate(program[i], space)
      }
    } catch (signal) {
      if (signal instanceof Signal &&
         (signal.type === 'return' || signal.type === 'exit')) {
        result = signal.value
      } else {
        spaceStack.pop()
        throw signal
      }
    }
    spaceStack.pop()
    return result
  }
}
