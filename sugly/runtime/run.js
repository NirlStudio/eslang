'use strict'

module.exports = function run ($void) {
  var evaluate = $void.evaluate

  $void.runIn = function runIn (space) {
    var load = $void.load
    var execute = $void.execute
    var constant = $void.constant
    var spaceStack = $void.spaceStack

    var dir = space.dir
    var runInDirs = [null, dir]
    var modules = space.modules || $void.modules
    var $ = space.$

    constant($, 'eval', function $eval (expr) {
      return evaluate(expr, spaceStack.current() || space)
    })

    constant($, 'load', function $load (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(source.startsWith('.') ? dir : [dir], source)
      return uri ? load(uri) : null
    })

    constant($, 'exec', function $exec (program, source) {
      if (typeof source !== 'string') {
        source = ''
      }
      return execute(program, '?' + source, dir)
    })

    constant($, 'run', function $run (source) {
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

    function modulize (value, action, source) {
      if (typeof value === 'undefined' || value === null) {
        return null
      }
      return {
        value: value,
        sourceUri: source,
        timestamp: Date.now()
      }
    }

    function importJSModule ($, name) {
      try {
        return name.startsWith('.') ? require(dir + '/' + name) : require(name)
      } catch (err) {
        $.warn({
          form: '$/sugly/runtime/run:importJSModule',
          message: 'failed to load JS moudle: ' + name
        })
        return null
      }
    }

    constant($, 'import', function $import (source, type) {
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
      return execute(load(uri), uri, path)
    })

    constant($, 'require', function $require (source) {
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
        return modules[uri].value
      }

      var path = load.dir(uri)
      var mod = modulize(execute(load(uri), uri, path), 'require', uri)
      if (mod) {
        modules[uri] = mod
      }
      return mod && mod.value
    })

    constant($, 'retire', function $retire (mod) {
      if (typeof mod.sourceUri === 'string') {
        delete modules[mod.sourceUri]
      }
    })
  }
}
