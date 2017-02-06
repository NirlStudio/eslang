'use strict'

module.exports = function encode ($void, JS) {
  var $ = $void.$
  var constant = $void.constant
  var readonly = $void.readonly
  var arrayProto = $.Array.proto

  function callToCode (value) {
    if (typeof value === 'undefined' || value === null) {
      return 'null'
    }
    var toCode = value['to-code'] ||
      (value.type && value.type.proto && value.type.proto['to-code'])
    return typeof toCode === 'function' ? toCode.call(value, this) : '()'
  }

  var encode = constant($, 'encode', $.object())

  readonly(encode, 'clause', function (clause) {
    return Array.isArray(clause) ? arrayProto['to-clause'].call(clause)
      : callToCode(clause)
  })
  readonly(encode, 'program', function (program) {
    return Array.isArray(program) ? arrayProto['to-program'].call(program)
      : callToCode(program)
  })
}
