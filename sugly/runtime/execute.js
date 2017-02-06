'use strict'

module.exports = function execute ($void) {
  var Signal = $void.Signal
  var evaluate = $void.evaluate
  var constant = $void.constant
  var createModuleSpace = $void.createModuleSpace
  var spaceStack = $void.spaceStack
  var compile = $void.$.compile

  constant($void.$.Function, 'execute', function function$execute (subject, func, args) {
    if (typeof args === 'undefined') {
      args = func; func = subject; subject = null
    }
    try {
      return typeof func !== 'function' ? null
        : func.apply(subject, Array.isArray(args) ? args : [])
    } catch (signal) {
      if (signal instanceof Signal &&
         (signal.id === 'return' || signal.id === 'exit')) {
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
         (signal.id === 'return' || signal.id === 'exit')) {
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
