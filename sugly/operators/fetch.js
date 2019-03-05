'use strict'

module.exports = function load ($void) {
  var $ = $void.$
  var $Promise = $.promise
  var warn = $void.$warn
  var evaluate = $void.evaluate
  var appendExt = $void.appendExt
  var staticOperator = $void.staticOperator

  var promiseAll = $Promise.all
  var promiseOfResolved = $Promise['of-resolved']

  // fetch: asychronously load a module from source.
  staticOperator('fetch', function (space, clause) {
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
    for (var i = 1; i < clist.length; i++) {
      tasks.push(fetching(evaluate(clist[i], space)))
    }
    return promiseAll(tasks)
  })

  function fetch (loader, dirs, source) {
    if (!source || typeof source !== 'string') {
      warn('fetch', 'invalid resource uri to fetch.', source)
      return promiseOfResolved(source)
    }
    source = appendExt(source)
    if (!loader.isResolved(source)) {
      source = loader.resolve(source, dirs)
      if (typeof source !== 'string') {
        warn('fetch', 'failed to resolve module ', source, 'in', dirs)
        return promiseOfResolved(source)
      }
    }
    return loader.fetch(source)
  }
}
