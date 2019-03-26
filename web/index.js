'use strict'

var sugly = require('../sugly')
var defaultTerm = require('./lib/term')
var defaultStdout = require('./lib/stdout')
var defaultLoader = require('../lib/loader')

function ensure (factory, alternative) {
  return typeof factory === 'function' ? factory : alternative
}

module.exports = function (term, stdout, loader) {
  term = ensure(term, defaultTerm)()
  stdout = ensure(stdout, defaultStdout)(term)
  loader = ensure(loader, defaultLoader)

  var $void = sugly(stdout, loader)
  $void.env('home', window.location.origin)
  $void.env('user-home', window.location.origin)
  $void.env('os', window.navigator.userAgent)

  var bootstrap = $void.createBootstrapSpace(window.location.origin + '/@')

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
        ? executor.bind(null, context) // an initializatoin profile.
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
    // export global shell commands
    $void.$['test-bootstrap'] = require('../test/test')($void)

    // generate shell agent.
    return initialize(context, function () {
      var reader = require('./lib/stdin')($void, term)
      var agent = require('../lib/shell')($void, reader,
        require('./lib/process')($void)
      )
      agent(args, term.echo)
      return reader.open()
    })
  }

  return function sugly (context, app) {
    return typeof app === 'string' ? run(app, context)
      : shell(Array.isArray(app) ? app : [], context)
  }
}
