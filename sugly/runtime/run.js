'use strict'

module.exports = function run ($) {
  var seval = $.$eval
  var isSymbol = $.Symbol['is-type-of']

  $.$evalIn = function $evalIn ($) {
    return function $eval (expr) {
      return seval(expr, $.$isSpace(this) ? this : $)
    }
  }

  $.$loadIn = function $loadIn ($) {
    var dir = $.$dir
    var load = $.$load

    return function $load (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }
      var uri = load.resolve(source.startsWith('.') ? dir : [dir], source)
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
      // execute a function as module: to catch exit signal.
      if (typeof program === 'function') {
        return exec.apply($, arguments)
      }
      return null
    }
  }

  $.$runIn = function $runIn ($) {
    var dir = $.$dir
    var dirs = [null, dir]
    var load = $.$load
    var exec = $.$exec

    return function $run (source) {
      if (typeof source !== 'string') {
        return null
      }
      if (!source.endsWith('.s')) {
        source += '.s'
      }

      var uri = load.resolve(source.startsWith('.') ? [] : dirs, source)
      if (!uri) {
        return null
      }

      var path = load.dir(uri)
      return exec(load(uri), uri, path)
    }
  }

  function modulize (mod, source, action) {
    if (typeof mod === 'undefined' || mod === null) {
      return null
    }

    if (isSymbol(mod)) {
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
      return name.startsWith('.') ? require($.$dir + '/' + name) : require(name)
    } catch (err) {
      $.print.warn({
        form: '$/sugly/runtime/run:importJSModule',
        message: 'failed to load JS moudle: ' + name
      })
      return null
    }
  }

  $.$importIn = function $importIn ($) {
    var dir = $.$dir
    var load = $.$load
    var exec = $.$exec

    return function $import (source, type) {
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
      return modulize(exec(load(uri), uri, path), 'import', uri)
    }
  }

  $.$requireIn = function $requireIn ($) {
    var dir = $.$dir
    var exec = $.$exec
    var load = $.$load
    var modules = $.$modules

    return function $require (source) {
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
      var result = modulize(exec(load(uri), uri, path), 'require', uri)
      if (result) {
        modules[uri] = result
      }
      return result
    }
  }

  $.$retireIn = function $retireIn ($) {
    var modules = $.$modules

    return function $retire (mod) {
      if (typeof mod.sourceUri === 'string') {
        delete modules[mod.sourceUri]
      }
    }
  }
}
