'use strict'

function getDefaultHome () {
  var href = window.location.href
  return href.substring(0, href.lastIndexOf('/'))
}

module.exports = function (term, stdin, stdout, loader) {
  // create the void.
  var $void = require('../es/start')(stdout ||
    require('./lib/stdout')(term ||
      require('./lib/console')()
    )
  )
  // set the location of the runtime
  $void.env('runtime-home', window.ES_HOME || (window.location.origin + '/es'))

  // prepare app environment.
  var home = getDefaultHome()
  $void.env('home', home)
  $void.env('user-home', home)
  $void.env('os', window.navigator.userAgent)

  // create the source loader
  $void.loader = (loader || require('../lib/loader/http'))($void)

  // mount native module loader
  $void.module = require('../lib/module')($void)
  $void.module.native = require('./lib/module-native')($void)

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

  function enableConsole (context, args) {
    return shell(context, args)
  }

  function shell (context, args) {
    return initialize(context, function () {
      var reader = (stdin || require('./lib/stdin'))($void, term)
      var agent = require('../lib/shell')($void, reader,
        require('./lib/process')($void)
      )
      agent(args, term.echo)
      return reader.open()
    })
  }

  return {
    run: run,
    shell: shell
  }
}
