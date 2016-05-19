'use strict'

var $export = require('../export')

module.exports = function run ($void) {
  var Symbol$ = $void.Symbol
  var evaluate = $void.evaluate

  $void.runIn = function runIn (space) {
    var load = $void.load
    var execute = $void.execute
    var spaceStack = $void.spaceStack

    var dir = space.dir
    var runInDirs = [null, dir]
    var modules = space.modules || $void.modules
    var $ = space.$

    $export($, 'eval', function $eval (expr) {
      return evaluate(expr, spaceStack.current() || space)
    })

    $export($, 'load', function $load (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(source.startsWith('.') ? dir : [dir], source)
      return uri ? load(uri) : null
    })

    $export($, 'exec', function $exec (program, source) {
      if (typeof source !== 'string') {
        source = ''
      }
      return execute(program, '?' + source, dir)
    })

    $export($, 'run', function $run (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(source.startsWith('.') ? [] : runInDirs, source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return execute(load(uri), uri, path)
    })

    function modulize (mod, action, source) {
      if (typeof mod === 'undefined' || mod === null) {
        return null
      }

      if (mod instanceof Symbol$) {
        mod = {value: mod}
      } else if (typeof mod !== 'function' && typeof mod !== 'object') {
        mod = {value: mod}
      }

      mod.sourceUri = source
      if (!mod.timestamp) {
        mod.timestamp = Date.now()
      }

      var code = '($' + action + ' ' + $.encode.string(source) + ')'
      mod['to-code'] = function () {
        return code
      }

      var str = '[module] ' + source
      mod['to-string'] = function () {
        return str
      }
      return mod
    }

    function importJSModule ($, name) {
      try {
        return name.startsWith('.') ? require(dir + '/' + name) : require(name)
      } catch (err) {
        $.print.warn({
          form: '$/sugly/runtime/run:importJSModule',
          message: 'failed to load JS moudle: ' + name
        })
        return null
      }
    }

    $export($, 'import', function $import (source, type) {
      if (typeof source !== 'string') {
        return null
      }
      if (type === 'js') {
        return importJSModule($, source)
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(source.startsWith('.') ? dir : [dir], source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return modulize(execute(load(uri), uri, path), 'import', uri)
    })

    $export($, 'require', function $require (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(source.startsWith('.') ? dir : [dir], source)
      if (!uri) {
        return null
      }

      if (modules.hasOwnProperty(uri)) {
        return modules[uri]
      }

      var path = load.dir(uri)
      var result = modulize(execute(load(uri), uri, path), 'require', uri)
      if (result) {
        modules[uri] = result
      }
      return result
    })

    $export($, 'retire', function $retire (mod) {
      if (typeof mod.sourceUri === 'string') {
        delete modules[mod.sourceUri]
      }
    })
  }
}
