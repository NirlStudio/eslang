'use strict'

var $export = require('../export')

module.exports = function execute ($void) {
  var Signal = $void.Signal
  var evaluate = $void.evaluate
  var createModuleSpace = $void.createModuleSpace
  var compile = $void.$.compile

  $export($void.$.Function.proto, 'exec', function function$exec () {
    try {
      return typeof this !== 'function' ? this
        : Function.prototype.call.apply(this, arguments.length > 0 ? arguments : [null])
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
      var length = program.length
      for (var i = 0; i < length; i++) {
        result = evaluate(program[i], space)
      }
    } catch (signal) {
      if (signal instanceof Signal &&
         (signal.type === 'return' || signal.type === 'exit')) {
        result = signal.value
      } else {
        throw signal
      }
    }
    return result
  }
}
