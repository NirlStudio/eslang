'use strict'

module.exports = function run ($void) {
  var $ = $void.$
  var compile = $.compile
  var Tuple$ = $void.Tuple
  var Symbol$ = $void.Symbol
  var warn = $void.$warn
  var $export = $void.export
  var execute = $void.execute

  // evaluate: a string, a symbol or a tuple in a separate space.
  $export($, 'eval', function (expr) {
    var code
    if (typeof expr === 'string') {
      // try to compile & evaluate
      code = compile(expr)
      if (!(code instanceof Tuple$)) {
        warn('eval', 'invalid code', code)
        return null
      }
    } else if (expr instanceof Tuple$) {
      // evaluate it
      code = expr
    } else if (expr instanceof Symbol$) {
      // resolve it in global space.
      code = new Tuple$([expr], true)
    } else {
      // a fix-point value.
      return expr
    }
    try {
      return execute(null, code)[0]
    } catch (signal) { // any unexpected signal
      if (code === expr) {
        warn('eval', 'invalid call to', signal.id, 'for', code)
      } else {
        warn('eval', 'invalid call to', signal.id, 'for', code, 'of', expr)
      }
      return null
    }
  })
}
