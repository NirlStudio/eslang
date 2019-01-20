'use strict'

function ingoreUnhandledRejectionsBy (filter) {
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', function (event) {
      filter(event.promise, event.reason) && event.preventDefault()
    })
  } else if (typeof process !== 'undefined') {
    process.on('unhandledRejection', function (reason, promise) {
      filter(promise, reason)
    })
  }
}

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.promise
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var Symbol$ = $void.Symbol
  var Promise$ = $void.Promise
  var link = $void.link
  var isApplicable = $void.isApplicable
  var protoValueOf = $void.protoValueOf
  var sharedSymbolOf = $void.sharedSymbolOf
  var defineTypeProperty = $void.defineTypeProperty

  function hasExcuse (excuse) {
    return typeof excuse !== 'undefined' && excuse !== null
  }

  function safeExcuse (excuse, alternative) {
    return hasExcuse(excuse) ? excuse
      : hasExcuse(alternative) ? alternative
        : true // the excuse of no excuse.
  }

  function ignoreRejectionOf (promise) {
    if (promise.excusable !== true) {
      promise.excusable = true
    }
    return promise
  }

  function makePromise (promising) {
    // make sure all related promises are excusable.
    return ignoreRejectionOf(promising instanceof Promise$ ? promising
      : isApplicable(promising)
        // a function will be intercepted as a promisee (executor).
        ? new Promise$(promising)
        // any other value will be intercepted as a resolved result.
        : Promise$.resolve(promising)
    )
  }

  function wrapStepResult (result) {
    return function (resolve, reject) {
      // finally reject if any excuse exists. Otherwise,
      hasExcuse(result[1]) ? reject(result[1])
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
    return step instanceof Promise$ ? function (result, excuse) {
      return hasExcuse(excuse)
        // Any existing excuse will cause a final rejection. Otherwise,
        ? rejectWith(excuse)
        // the promise's result will be forwarded as the final one.
        : step.then.bind(step)
    } : isApplicable(step) ? function (result, excuse) {
      // let a step function to decide if it forgives an existing excuse.
      result = step(result, excuse)
      return result instanceof Promise$ // continue and
        ? result.then.bind(result) // forward final promise's result.
        : isApplicable(result) // continue too, and
          // generate a final promise and forward its result.
          ? (result = makePromise(result)).then.bind(result)
          // an array will be intercepted as a sync step result.
          : Array.isArray(result) ? wrapStepResult(result)
            // other type of value will be taken as a rejection excuse, which
            // may fallback to any existing excuse.
            : rejectWith(safeExcuse(result, excuse))
    } : function (result, excuse) {
      // any value other than a promise or an function will be intercepted as
      // a sync step result.
      return hasExcuse(excuse) ? rejectWith(excuse)
        : Array.isArray(step) ? wrapStepResult(step)
          : rejectWith(safeExcuse(result, excuse))
    }
  }

  function commit (promise, next) {
    return function (resolve, reject) {
      promise.then(function (result) {
        next(result, null)(resolve, reject)
      }, function (excuse) {
        next(null, safeExcuse(excuse))(resolve, reject)
      })
    }
  }

  function compose (promise, next) {
    return function (result, excuse) {
      // the overall promise will reject immediately if found an tolerated
      // rejection, since a parallelizing promise cannot react to it.
      return hasExcuse(excuse) ? rejectWith(excuse)
        // otherwise, the current promise's result will be taken into account in turn.
        : commit(promise, next)
    }
  }

  function connect (step, next) {
    return function (result, excuse) {
      result = step(result, excuse)
      return result instanceof Promise$
        // a step function may return another promise, or
        ? commit(result, next)
        // return a new promisee function to generate a promise.
        : isApplicable(result) ? commit(makePromise(result), next)
          // any value other than a sync step result will be intercepted as
          // the excuse of a final rejection.
          : !Array.isArray(result) ? rejectWith(safeExcuse(result, excuse))
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
  var empty = link(Type, 'empty', makePromise(null))

  // guard sugly promises to ingore unhandled rejections.
  ingoreUnhandledRejectionsBy(function (promise, excuse) {
    // create warnings
    return promise.excusable === true
  })
  // another special value which has been rejected.
  var nothing = link(Type, 'nothing', ignoreRejectionOf(Promise$.reject(true)))

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when all promise handlers have been invoked sequentially.
  link(Type, 'of', function (promising, next) {
    var last = arguments.length - 1
    next = last > 0 ? wrap(arguments[last]) : null
    for (var i = last - 1; i > 0; i++) {
      var current = arguments[i]
      next = current instanceof Promise$ ? compose(current, next)
        : isApplicable(current) ? connect(current, next)
          : compose(ofResolved(current), next)
    }
    promising = makePromise(promising)
    return next ? makePromise(compose(promising, next)()) : promising
  }, true)

  // to make a resolved promise for a value.
  var ofResolved = link(Type, 'of-resolved', function (result) {
    return typeof result === 'undefined' || result === null ? empty
      : ignoreRejectionOf(Promise$.resolve(result))
  }, true)

  // to make a rejected promise with a cause.
  link(Type, 'of-rejected', function (excuse) {
    excuse = safeExcuse(excuse)
    return excuse === true ? nothing
      : ignoreRejectionOf(Promise$.reject(excuse))
  }, true)

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when all promise handlers have been invoked separately.
  link(Type, 'of-all', function (promisings) {
    var promises = makePromises(promisings)
    return promises.length > 1 ? Promise$.all(promises)
      : promises.length > 0 ? promises[0] : empty
  }, true)
  // the agument version of (promise of-all promisings)
  link(Type, 'all', function (promising) {
    var promises = makePromises(Array.prototype.slice.call(arguments))
    return promises.length > 1 ? Promise$.all(promises)
      : promises.length > 0 ? promises[0] : empty
  }, true)

  // To make a promise from one or more promisee functions and/or other promises.
  // It's is fulfilled when any one of them is fulfilled.
  link(Type, 'of-any', function (promisings) {
    var promises = makePromises(promisings)
    return promises.length > 1 ? Promise$.race(promises)
      : promises.length > 0 ? promises[0] : nothing
  }, true)
  // the agument version of (promise of-any promisings)
  link(Type, 'any', function (promising) {
    var promises = makePromises(Array.prototype.slice.call(arguments))
    return promises.length > 1 ? Promise$.race(promises)
      : promises.length > 0 ? promises[0] : nothing
  }, true)

  var proto = Type.proto
  // the logic after the promise has been resolved.
  link(proto, 'then', function (resolving) {
    return isApplicable(resolving) ? this.then(resolving.bind(this)) : this
  })
  // the logic after the promise has been rejected.
  link(proto, 'catch', function (rejecting) {
    return isApplicable(rejecting) ? this.catch(rejecting.bind(this)) : this
  })
  // the cleanup logic after the promise is either resolved or rejected.
  link(proto, 'finally', Promise$.prototype.finally ? function (finalizing) {
    return isApplicable(finalizing) ? this.finally(finalizing.bind(this)) : this
  } : function (finalizing) {
    return !isApplicable(finalizing) ? this
      : this.then((finalizing = finalizing.bind(this)), finalizing)
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

  // inject function as the default type for native functions.
  defineTypeProperty(Promise$.prototype, Type)
}
