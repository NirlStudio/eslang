'use strict'

function getWindowOrigin () {
  return window.location.origin || (
    window.location.protocol + '//' + window.location.host
  )
}

function getPageHome () {
  var origin = getWindowOrigin()
  var href = window.location.href
  var home = href.substring(0, href.lastIndexOf('/'))
  return !home || home.length < origin.length ? origin : home
}

module.exports = function $void (term, stdout, loader) {
  term || (term = require('./lib/console')())
  stdout || (stdout = require('./lib/stdout')(term))

  // create the void.
  var $void = require('../es/start')(stdout)

  // set the location of the runtime
  $void.env('runtime-home', window.ES_HOME || getWindowOrigin())

  // prepare app environment.
  var home = getPageHome()
  $void.env('home', home)
  $void.env('user-home', home)
  $void.env('os', window.navigator.userAgent)

  // create the source loader
  $void.loader = (loader || require('../lib/loader/http'))($void)

  // mount native module loader
  $void.module = require('../lib/module')($void)
  $void.module.native = require('./lib/module-native')($void)

  var bootstrap = $void.createBootstrapSpace(home + '/@')

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

  function initialize (context, main) {
    var preparing = prepare(context)
    var prepared = preparing(bootstrap, $void)
    return !(prepared instanceof Promise) ? main()
      : new Promise(function (resolve, reject) {
        prepared.then(function () { resolve(main()) }, reject)
      })
  }

  $void.web = Object.create(null)
  $void.web.initialize = initialize

  $void.web.run = function run (context, app, args, appHome) {
    return initialize(context, function () {
      return $void.$run(app, args, appHome)
    })
  }

  $void.web.shell = function shell (context, stdin, exit) {
    return initialize(context, function () {
      require('../lib/shell')($void)(
        stdin || require('./lib/stdin')($void, term),
        exit || require('./lib/exit')($void)
      )
    })
  }

  return $void
}
