'use strict'

var sugly = require('../sugly')
var terminalStdin = require('./lib/stdin')
var terminalStdout = require('./lib/stdout')
var consoleStdout = require('../lib/stdout')
var defaultLoader = require('../lib/loader')

function ensure (factory, alternative) {
  return typeof factory === 'function' ? factory : alternative
}

function getDefaultHome () {
  var href = window.location.href
  return href.substring(0, href.lastIndexOf('/'))
}

module.exports = function (term, stdin, stdout, loader) {
  term = typeof term === 'object' ? term
    : null // by default, shell mode is not available.
  stdout = typeof stdout === 'function' ? stdout
    : term ? terminalStdout(term)
      : consoleStdout // web console does not support printf.
  loader = ensure(loader, defaultLoader)

  var $void = sugly(stdout, loader)
  var home = getDefaultHome()
  $void.env('home', home)
  $void.env('user-home', home)
  $void.env('os', window.navigator.userAgent)

  var bootstrap = $void.createBootstrapSpace(home + '/@')

  var run = function (appHome, context, args, app) {
    return initialize(context, function () {
      return $void.$run(app || 'app', args, appHome)
    })
  }

  function initialize (context, main) {
    var preparing = prepare(context)
    var prepared = preparing(bootstrap, $void)
    return !(prepared instanceof Promise) ? main()
      : new Promise(function (resolve, reject) {
        prepared.then(function () {
          resolve(main())
        }, reject)
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

  function shell (context, args, profile) {
    if (typeof stdin !== 'function' && !term) {
      throw new TypeError('An interactive shell requires a terminal to work.')
    }
    // generate shell agent.
    return initialize(context, function () {
      var reader = ensure(stdin, terminalStdin)($void, term)
      var agent = require('../lib/shell')($void, reader,
        require('./lib/process')($void)
      )
      // export global shell commands
      $void.$shell['test-bootstrap'] = require('../test/test')($void)
      agent(args, term.echo, profile)
      return reader.open()
    })
  }

  return {
    run: run,
    shell: shell
  }
}
