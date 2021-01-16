'use strict'

module.exports = function load ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var run = $void.$run
  var warn = $void.$warn
  var Tuple$ = $void.Tuple
  var Promise$ = $void.Promise
  var evaluate = $void.evaluate
  var completeFile = $void.completeFile
  var sharedSymbolOf = $void.sharedSymbolOf
  var staticOperator = $void.staticOperator

  var promiseAll = $Promise.all
  var symbolFetch = sharedSymbolOf('fetch')
  var promiseOfResolved = $Promise['of-resolved']

  // fetch: asynchronously load a module from source.
  var operator = staticOperator('fetch', function (space, clause) {
    var clist = clause.$
    if (clist.length < 2) {
      return null // at least one file.
    }
    if (!space.app) {
      warn('fetch', 'invalid without an app context.')
      return null
    }
    var loader = $void.loader
    var dirs = space.local['-module'] ? [loader.dir(space.local['-module'])] : []
    var fetching = fetch.bind(null, loader, dirs)
    var tasks = []
    for (var i = 1, len = clist.length; i < len; i++) {
      tasks.push(fetching(evaluate(clist[i], space)))
    }
    return promiseAll(tasks)
  })

  function fetch (loader, dirs, source) {
    if (!source || typeof source !== 'string') {
      warn('fetch', 'invalid resource uri to fetch.', source)
      return promiseOfResolved(source)
    }
    source = completeFile(source)
    if (!loader.isResolved(source)) {
      source = loader.resolve(source, dirs)
      if (typeof source !== 'string') {
        warn('fetch', 'failed to resolve ', source)
        return promiseOfResolved(source)
      }
    }
    return source.endsWith('@.es')
      ? new Promise$(function (resolve, reject) {
        loader.fetch(source).then(function () {
          var result = run(source)
          if (result instanceof Promise$) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        }, reject)
      })
      : loader.fetch(source)
  }

  $void.bindOperatorFetch = function (space) {
    return (space.$fetch = function (uris) {
      var clist = Array.isArray(uris) ? uris.slice()
        : Array.prototype.slice.call(arguments)
      clist.unshift(symbolFetch)
      for (var i = 1, len = clist.length; i < len; i++) {
        var uri = clist[i]
        if (!uri || typeof uri !== 'string') {
          warn('$fetch', 'invalid source uri:', uri)
          clist[i] = null
        }
      }
      return operator(space, new Tuple$(clist))
    })
  }
}
