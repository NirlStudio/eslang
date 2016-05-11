'use strict'

module.exports = function $module ($, name, prototype) {
  if (typeof prototype === 'undefined') {
    prototype = null
  }
  var mod = Object.create(prototype)

  mod.identityName = name
  if ($) {
    $[name] = mod
  }

  mod['to-code'] = function () {
    return name
  }
  mod['to-string'] = function () {
    return '[module] ' + name
  }
  return mod
}
