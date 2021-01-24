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
  var promiseOfRejected = $Promise['of-rejected']

  // fetch: asynchronously load a module.
  var operator = staticOperator('fetch', function (space, clause) {
    if (!space.app) {
      warn('load', 'invalid without an app context.')
      return null
    }
    var clist = clause.$
    if (clist.length < 2) {
      return null // at least one file.
    }
    if (!space.app) {
      warn('fetch', 'invalid without an app context.')
      return null
    }

    var fetching = fetch.bind(null, $void.loader, space.local['-module-dir'])
    var tasks = []
    for (var i = 1, len = clist.length; i < len; i++) {
      tasks.push(fetching(evaluate(clist[i], space)))
    }
    return promiseAll(tasks)
  })

  function fetch (loader, baseDir, target) {
    if (!target || typeof target !== 'string') {
      warn('fetch', 'invalid module url.', target)
      return promiseOfRejected(target)
    }
    target = completeFile(target)
    if (!target.endsWith('.es')) {
      warn('fetch', 'only supports Espresso modules.', target)
      return promiseOfRejected(target)
    }
    if (!loader.isRemote(target)) {
      target = [baseDir, target].join('/')
    }
    if (!loader.isRemote(target)) {
      warn('fetch', 'only supports remote modules.', target)
      return promiseOfResolved(target)
    }
    return target.endsWith('/@.es')
      ? new Promise$(function (resolve, reject) {
        loader.fetch(target).then(function () {
          var result = run(target)
          if (result instanceof Promise$) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        }, reject)
      })
      : loader.fetch(target)
  }

  $void.bindOperatorFetch = function (space) {
    return (space.$fetch = function (uris) {
      var clist = Array.isArray(uris) ? uris.slice()
        : Array.prototype.slice.call(arguments)
      clist.unshift(symbolFetch)
      for (var i = 1, len = clist.length; i < len; i++) {
        var uri = clist[i]
        if (!uri || typeof uri !== 'string') {
          warn('$fetch', 'invalid target uri:', uri)
          clist[i] = null
        }
      }
      return operator(space, new Tuple$(clist))
    })
  }
}
