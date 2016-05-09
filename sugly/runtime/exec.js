'use strict'

module.exports = function exec ($) {
  var beval = $.$beval
  var Signal = $.$Signal
  var compile = $.compile
  var createModuleSpace = $.$createModuleSpace

  $.$exec = function $$exec (program, source, dir) {
    var result
    if (typeof program === 'string') {
      program = compile(program, source)
    }
    try {
      if (Array.isArray(program)) {
        var space = createModuleSpace(source.startsWith('?'), dir)
        result = beval(space, program)
      } else if (typeof program === 'function') {
        var args = arguments.length < 2 ? [] : Array.prototype.slice.call(arguments, 1)
        result = program.apply(null, args)
      } else {
        return null // unrecognized code type
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
