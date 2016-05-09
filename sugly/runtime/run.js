'use strict'

module.exports = function run ($) {
  var seval = $.$eval

  $.$evalIn = function $evalIn ($) {
    return function $eval (expr) {
      return seval(expr, $.$isSpace(this) ? this : $)
    }
  }

  $.$loadIn = function $loadIn ($) {
    var dirs = [$.$dir]
    var load = $.$load

    return function $load (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(dirs, source)
      return uri ? load(uri) : null
    }
  }

  $.$execIn = function $execIn ($) {
    var dir = $.$dir
    var exec = $.$exec

    return function $exec (program, source) {
      if (typeof program === 'string' || Array.isArray(program)) {
        if (typeof source !== 'string') {
          source = ''
        }
        return exec(program, '?' + source, dir)
      }
      if (typeof program === 'function') {
        return exec.apply($, arguments)
      }
      return null
    }
  }

  $.$runIn = function $runIn ($) {
    var dirs = [null, $.$dir]
    var load = $.$load
    var exec = $.$exec

    return function $run (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(dirs, source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return exec(load(uri), uri, path)
    }
  }

  $.$importIn = function $importIn ($) {
    var dirs = [$.$dir]
    var load = $.$load
    var exec = $.$exec

    return function $import (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(dirs, source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return exec(load(uri), uri, path)
    }
  }

  function importJSModule ($, name) {
    try {
      return require(name)
    } catch (err) {
      $.print.warn({
        form: '$/sugly',
        message: 'failed to load JS moudle: ' + name
      })
      return null
    }
  }

  $.$requireIn = function $requireIn ($) {
    var dirs = [$.$dir]
    var exec = $.$exec
    var load = $.$load
    var modules = $.$modules

    return function $require (source, type) {
      if (typeof source !== 'string') {
        return null
      }

      if (type === 'js') {
        return importJSModule($, source)
      }

      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(dirs, source)
      if (!uri) {
        return null
      }

      if (modules.hasOwnProperty(uri)) {
        return modules[uri]
      }

      var path = load.dir(uri)
      var result = exec(load(uri), uri, path)
      if (typeof result !== 'object' && typeof result !== 'function') {
        result = {
          value: result
        }
      }
      if (result && !result.timestamp) {
        result.timestamp = Date.now()
      }

      modules[uri] = result
      return result
    }
  }
}
