'use strict'

var sugly = require('../sugly')
var defaultTerm = require('./lib/term')
var defaultStdout = require('./lib/stdout')
var defaultLoader = require('../lib/loader')

function ensure (factory, alternative) {
  return typeof factory === 'function' ? factory : alternative
}

module.exports = window.$void = function (term, stdout, loader) {
  term = ensure(term, defaultTerm)()
  stdout = ensure(stdout, defaultStdout)(term)
  loader = ensure(loader, defaultLoader)

  var $void = sugly(stdout, loader)
  $void.env('home', window.location.origin)
  $void.$['check-runtime'] = require('../test/test')($void)
  var bootstrap = $void.createBootstrapSpace(window.location.origin + '//.')

  function run (app, context) {
    var initialize = prepare(context)
    var initialized = initialize && initialize(bootstrap, $void)
    if (initialized instanceof Promise) {
      return new Promise(function (resolve, reject) {
        initialized.then(function () {
          resolve(innerRun(app))
        }, reject)
      })
    } else {
      return innerRun(app)
    }
  }

  function prepare (context) {
    if (typeof context === 'function') { // an initializer function.
      return context
    } else if (typeof context === 'string') { // a customized dependency loader
      return execute.bind(null, context)
    } else if (Array.isArray(context)) { // dependency modules
      return preload.bind(null, context)
    } else if (context) {
      console.warn('unknown type of context:', context)
    }
    return null
  }

  function execute (loader) {
    return new Promise(function (resolve, reject) {
      bootstrap.$fetch(loader).then(function () {
        resolve(bootstrap.$load(loader))
      }, reject)
    })
  }

  function preload (modules) {
    return bootstrap.$fetch(modules)
  }

  function innerRun (app) {
    return $void.$run(app)
  }

  function shell (args) {
    var reader
    var agent = require('../lib/shell')($void,
      (reader = require('./lib/stdin')($void, term)),
      require('./lib/process')($void)
    )
    agent(args, term.echo)
    return reader.open()
  }

  return function sugly (context, app) { // a runner function
    return app && typeof app === 'string' ? run(app, context) : shell(context)
  }
}
