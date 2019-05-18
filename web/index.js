'use strict'

var sugly = require('../sugly')
var defaultTerm = require('./lib/term')
var defaultStdout = require('./lib/stdout')
var defaultLoader = require('../lib/loader')

function ensure (factory, alternative) {
  return typeof factory === 'function' ? factory : alternative
}

function getAppHome () {
  var href = window.location.href
  return href.substring(0, href.lastIndexOf('/'))
}

module.exports = function (term, stdout, loader) {
  term = ensure(term, defaultTerm)()
  stdout = ensure(stdout, defaultStdout)(term)
  loader = ensure(loader, defaultLoader)

  var $void = sugly(stdout, loader)
  var home = getAppHome()
  $void.env('home', home)
  $void.env('user-home', home)
  $void.env('os', window.navigator.userAgent)

  var bootstrap = $void.createBootstrapSpace(home + '/@')

  function run (app, context) {
    return initialize(context, function () {
      return $void.$run(app)
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

  function shell (args, context) {
    // generate shell agent.
    return initialize(context, function () {
      var reader = require('./lib/stdin')($void, term)
      var agent = require('../lib/shell')($void, reader,
        require('./lib/process')($void)
      )
      // export global shell commands
      $void.$shell['test-bootstrap'] = require('../test/test')($void)
      agent(args, term.echo)
      return reader.open()
    })
  }

  return function sugly (context, app) {
    return typeof app === 'string' ? run(app, context)
      : shell(Array.isArray(app) ? app : [], context)
  }
}
