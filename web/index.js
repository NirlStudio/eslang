'use strict'

var consoleTerm = require('./lib/console')
var terminalStdin = require('./lib/stdin')
var terminalStdout = require('./lib/stdout')
var defaultLoader = require('../lib/loader/http')

function ensure (factory, alternative) {
  return typeof factory === 'function' ? factory : alternative
}

function getDefaultHome () {
  var href = window.location.href
  return href.substring(0, href.lastIndexOf('/'))
}

module.exports = function (term, stdin, stdout, loader) {
  term = typeof term === 'object' ? term : consoleTerm()
  stdout = typeof stdout === 'function' ? stdout : terminalStdout(term)
  loader = ensure(loader, defaultLoader)

  var $void = require('./es')(stdout, loader)
  require('./lib/io')($void)

  // prepare app environment.
  var home = getDefaultHome()
  $void.env('home', home)
  $void.env('user-home', home)
  $void.env('os', window.navigator.userAgent)

  var isObject = $void.isObject
  var bootstrap = $void.createBootstrapSpace(home + '/@')

  var run = function (appHome, context, args, app) {
    return initialize(context, function () {
      $void.$['-enable-console'] = enableConsole
      return $void.$run(app || 'app', args, appHome)
    })
  }

  function initialize (context, main) {
    var preparing = prepare(context)
    var prepared = preparing(bootstrap, $void)
    return !(prepared instanceof Promise) ? main()
      : new Promise(function (resolve, reject) {
        prepared.then(function () { resolve(main()) }, reject)
      })
  }

  function prepare (context) {
    return typeof context === 'function'
      ? context // a customized initializer function.
      : typeof context === 'string'
        ? executor.bind(null, context) // an initialization profile.
        : Array.isArray(context) ? function () {
          // a list of dependency modules
          return bootstrap.$fetch(context)
        } : function () {
          // try to fetch the default root module loader.
          return bootstrap.$fetch('@')
        }
  }

  function executor (profile) {
    return new Promise(function (resolve, reject) {
      bootstrap.$fetch(profile).then(function () {
        resolve(bootstrap.$load(profile))
      }, reject)
    })
  }

  function enableConsole (context, args, profile) {
    return shell(context || ['_@', '_profile'], args,
      profile && typeof profile === 'string' ? profile
        : '(var * (load "_profile"))'
    )
  }

  function shell (context, args, profile) {
    return initialize(context, function () {
      var reader = ensure(stdin, terminalStdin)($void, term)
      var agent = require('../lib/shell')($void, reader,
        require('./lib/process')($void)
      )
      // export global shell commands
      $void.$shell['test-bootstrap'] = require('../test/test')($void)
      if (isObject(args)) {
        Object.assign($void.$shell, args)
        args = []
      }
      agent(args, term.echo, profile)
      return reader.open()
    })
  }

  return {
    run: run,
    shell: shell
  }
}
