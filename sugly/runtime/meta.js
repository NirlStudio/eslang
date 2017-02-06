'use strict'

module.exports = function meta ($void) {
  var $ = $void.$
  var object = $.object
  var constant = $void.constant
  var readonly = $void.readonly
  var variable = $void.variable

  var runtime = constant($, 'runtime', object())
  readonly(runtime, 'core', 'js')
  variable(runtime, 'debugging', true)

  var version = readonly(runtime, 'version', object())
  readonly(version, 'major', 0)
  readonly(version, 'minor', 3)
  readonly(version, 'build', 0)
}
