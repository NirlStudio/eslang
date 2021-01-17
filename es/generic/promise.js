'use strict'

function ignoreUnhandledRejectionsBy (filter) {
  if (typeof process !== 'undefined') {
    process.on('unhandledRejection', filter)
  } else /* if (typeof window !== 'undefined') */ {
    window.addEventListener('unhandledrejection', function (event) {
      filter(event.reason, event.promise) && event.preventDefault()
    })
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.promise
  var $Tuple = $.tuple
  var $Object = $.object
  var $Symbol = $.symbol
  var Symbol$ = $void.Symbol
  var Promise$ = $void.Promise
  var link = $void.link
  var $export = $void.export
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf

  function hasExcuse (excuse) {
    return typeof excuse !== 'undefined' && excuse !== null
  }

  // use true to make sure it's not a boolean false by default.
  var NoExcuse = true
  function safeExcuse (excuse, waiting) {
    return hasExcuse(excuse) ? excuse
      : waiting && hasExcuse(waiting.excuse) ? waiting.excuse : NoExcuse
  }

  function assemble (promise, cancel) {
    if (promise.excusable !== true) {
      promise.excusable = true
    }
    if (isApplicable(cancel)) {
      promise.$cancel = cancel
    }
    return promise
  }

  function promiseOfAsync (async) {
    var cancel
    var promise = new Promise$(function (resolve, reject) {
      cancel = async(Object.freeze($Object.of({
        resolve: resolve,
        reject: reject
      })))
    })
    return assemble(promise, cancel)
  }

  function promiseOfExecutor (executor) {
    var cancel
    var promise = new Promise$(function (resolve, reject) {
      cancel = executor(resolve, reject)
    })
    return assemble(promise, cancel)
  }

  function resolvedTo (next, result) {
    return next(Object.freeze($Object.of({
      result: result
    })))
  }

  function rejectedTo (next, excuse) {
    return next(Object.freeze($Object.of({
      excuse: safeExcuse(excuse)
    })))
  }

  function staticPromiseOf (result) {
    var value
    return assemble(!Array.isArray(result)
      // intercept a non-array value as an excuse. Otherwise,
      ? (value = safeExcuse(result)) === NoExcuse ? nothing
        : Promise$.reject(value)
      // reject if any excuse exists. Otherwise,
      : hasExcuse((value = result[1])) ? Promise$.reject(value)
        // resolve even the final result value is null.
        : ((value = result[0]) === undefined || value === null) ? empty
          : Promise$.resolve(value)
    )
  }

  function makePromise (promising, isExecutor) {
    return promising instanceof Promise$ ? assemble(promising)
      : !isApplicable(promising) ? staticPromiseOf(promising)
        : isExecutor ? promiseOfExecutor(promising)
          : promiseOfAsync(promising)
  }

  function wrapStepResult (result, waiting) {
    return function (resolve, reject) {
      // any non-array result will be intercepted as an excuse
      !Array.isArray(result) ? reject(safeExcuse(result, waiting))
        // finally reject if any excuse exists. Otherwise,
        : hasExcuse(result[1]) ? reject(result[1])
          // resolve even the final result value is null.
          : resolve(result[0] === undefined ? null : result[0])
    }
  }

  function rejectWith (safeExcuse) {
    return function (resolve, reject) {
      reject(safeExcuse)
    }
  }

  function wrap (step) {
    return isApplicable(step) ? function (waiting) {
      // let a step function to decide if it forgives an existing excuse.
      var result = step.apply(null, arguments)
      return result instanceof Promise$ // continue and
        ? result.then.bind(result) // forward final promise's result.
        : isApplicable(result) // continue too, and
          // generate a final promise and forward its result.
          ? (result = makePromise(result)).then.bind(result)
          // other value will be intercepted as a sync step result.
          : wrapStepResult(result, waiting)
    } : function (waiting) {
      // any value other than a promise or an function will be intercepted as
      // a sync step result.
      return waiting && hasExcuse(waiting.excuse)
        ? rejectWith(waiting.excuse)
        : wrapStepResult(step)
    }
  }

  function awaitFor (promise, next) {
    return function (resolve, reject) {
      promise.then(function (result) {
        resolvedTo(next, result)(resolve, reject)
      }, function (excuse) {
        rejectedTo(next, excuse)(resolve, reject)
      })
    }
  }

  function compose (promise, next) {
    return function (waiting) {
      return waiting && hasExcuse(waiting.excuse)
        // the overall promise will reject immediately if found an tolerated
        // rejection, since a parallel promise cannot react to it.
        ? rejectWith(waiting.excuse)
        // otherwise, the current promise's result will be taken into account in turn.
        : awaitFor(promise, next)
    }
  }

  function connect (step, next) {
    return function (waiting) {
      var result = step.apply(null, arguments)
      return result instanceof Promise$
        // a step function may return another promise, or
        ? awaitFor(result, next)
        // return a new promisee function to generate a promise.
        : isApplicable(result) ? awaitFor(makePromise(result), next)
          // any value other than a sync step result will be intercepted as
          // the excuse of a final rejection.
          : !Array.isArray(result) ? rejectWith(safeExcuse(result, waiting))
            // a sync step result will be relayed literally, so it may have
            // any number of values in theory.
            : function (resolve, reject) {
              next.apply(null, result)(resolve, reject)
            }
    }
  }

  function makePromises (promises) {
    if (!Array.isArray(promises)) {
      promises = []
    }
    for (var i = 0; i < promises.length; i++) {
      promises[i] = makePromise(promises[i])
    }
    return promises
  }

  // the empty value which has been resolved to null.
  var empty = link(Type, 'empty', Promise$.resolve(null))

  // guard espresso promises to ignore unhandled rejections.
  ignoreUnhandledRejectionsBy(function (excuse, promise) {
    // TODO: create warnings
    return promise.excusable === true
  })

  // another special value which has been rejected.
  var nothing = link(Type, 'nothing', Promise$.reject(NoExcuse))
  // catch the rejection of nothing.
  nothing.catch(function () {})

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when all promise handlers have been invoked sequentially.
  var noop = function () { return this }
  $export($, 'commit', link(Type, 'of', function (promising, next) {
    var last = arguments.length - 1
    next = last > 0 ? wrap(arguments[last]) : null
    for (var i = last - 1; i > 0; i--) {
      var current = arguments[i]
      if (!isApplicable(current)) {
        current = noop.bind(current)
      }
      next = connect(current, next)
    }
    promising = typeof promising === 'undefined' || promising === null
      ? nothing : makePromise(promising)
    return next ? makePromise(compose(promising, next)(), true) : promising
  }, true))

  // to make a resolved promise for a value.
  link(Type, 'of-resolved', function (result) {
    return typeof result === 'undefined' || result === null ? empty
      : assemble(Promise$.resolve(result))
  }, true)

  // to make a rejected promise with a cause.
  link(Type, 'of-rejected', function (excuse) {
    excuse = safeExcuse(excuse)
    return excuse === NoExcuse ? nothing
      : assemble(Promise$.reject(excuse))
  }, true)

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when all promise handlers have been invoked separately.
  $export($, 'commit*', link(Type, 'of-all', function (promising) {
    var promises = makePromises(Array.prototype.slice.call(arguments))
    return promises.length > 0 ? assemble(Promise$.all(promises)) : empty
  }, true))

  // the array argument version of (promise of-all promising, ...)
  link(Type, 'all', function (promisingList) {
    if (!Array.isArray(promisingList)) {
      return empty
    }
    var promises = makePromises(promisingList)
    return promises.length > 0 ? assemble(Promise$.all(promises)) : empty
  }, true)

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when any one of them is fulfilled.
  $export($, 'commit?', link(Type, 'of-any', function (promising) {
    var promises = makePromises(Array.prototype.slice.call(arguments))
    return promises.length > 1 ? assemble(Promise$.race(promises))
      : promises.length > 0 ? promises[0] : nothing
  }, true))

  // the array argument version of (promise of-any promising, ...)
  link(Type, 'any', function (promisingList) {
    if (!Array.isArray(promisingList)) {
      return nothing
    }
    var promises = makePromises(promisingList)
    return promises.length > 1 ? assemble(Promise$.race(promises))
      : promises.length > 0 ? promises[0] : nothing
  }, true)

  var proto = Type.proto
  // the optional cancellation capability of a promise.
  link(proto, 'is-cancellable', function () {
    return isApplicable(this.$cancel)
  })
  // try to cancel the promised operation.
  link(proto, 'cancel', function () {
    // a cancel function should be ready for being called multiple times.
    return isApplicable(this.$cancel) ? this.$cancel.apply(this, arguments) : null
  })

  // the next step after this promise has been either resolved or rejected.
  // this returns a new promise or this (only when step is missing).
  link(proto, 'then', function (step) {
    return typeof step === 'undefined' ? this
      : makePromise(awaitFor(this, wrap(step)), true)
  })

  // the last step after this promise has been either resolved or rejected.
  // this returns current promise
  link(proto, 'finally', function (waiter) {
    if (isApplicable(waiter)) {
      this.then(
        resolvedTo.bind(null, waiter),
        rejectedTo.bind(null, waiter)
      )
    }
    return this
  })

  // range is empty if it cannot iterate at least once.
  link(proto, 'is-empty', function () {
    return this === empty || this === nothing
  })
  link(proto, 'not-empty', function () {
    return this !== empty && this !== nothing
  })

  // Encoding
  var symbolPromise = sharedSymbolOf('promise')
  var emptyPromise = $Tuple.of(symbolPromise, sharedSymbolOf('empty'))
  var nothingPromise = $Tuple.of(symbolPromise, sharedSymbolOf('nothing'))
  var otherPromise = $Tuple.of(symbolPromise, sharedSymbolOf('of'), $Symbol.etc)
  var toCode = link(proto, 'to-code', function () {
    return this === empty ? emptyPromise
      : this === nothing ? nothingPromise
        : otherPromise
  })

  // Description
  link(proto, 'to-string', function () {
    return toCode.call(this)['to-string']()
  })

  // Indexer
  var indexer = link(proto, ':', function (index, value) {
    return typeof index === 'string' ? protoValueOf(this, proto, index)
      : index instanceof Symbol$ ? protoValueOf(this, proto, index.key) : null
  })
  indexer.get = function (key) {
    return proto[key]
  }

  // export type indexer.
  link(Type, 'indexer', indexer)
}
