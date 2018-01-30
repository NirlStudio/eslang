'use strict'

module.exports = function module ($void) {
  var $ = $void.$
  var Type = $.module
  var $Tuple = $.tuple
  var link = $void.link
  var Module$ = $void.Module
  var initializeType = $void.initializeType
  var protoIndexer = $void.protoIndexer
  var CodingContext$ = $void.CodingContext
  var sharedSymbolOf = $void.sharedSymbolOf

  // create an empty module.
  initializeType(Type, function () {
    return new Module$(null)
  })

  // a helper function of load
  link(Type, 'of', function (uri) {
    return typeof $.load === 'function' ? $.load(uri) : null
  })

  var proto = Type.proto
  // determine emptiness by module uri.
  link(proto, 'is-empty', function () {
    return this instanceof Module$
      ? typeof this['uri'] === 'undefined' || this['uri'] === null
      : null
  }, 'not-empty', function () {
    return this instanceof Module$
      ? typeof this['uri'] !== 'undefined' && this['uri'] === null
      : null
  })

  // Encoding
  link(proto, 'to-code', function (ctx) {
    if (!(this instanceof Module$)) {
      return null
    }
    var uri = this['uri']
    if (typeof uri !== 'string' || !uri) {
      return null
    }
    if (ctx instanceof CodingContext$) {
      ctx.touch(this, Type) // to be reused if required.
      return ctx.complete(this, $Tuple.of(sharedSymbolOf('import'), uri))
    } else {
      return $Tuple.of(sharedSymbolOf('import'), uri)
    }
  })

  // Description
  link(proto, 'to-string', function () {
    return this instanceof Module$
      ? '(module of "' + (this['uri'] || '<unkown>') + '")'
      : null
  })

  // add indexer
  protoIndexer(Type, function (name) {
    return this instanceof Module$ && typeof name === 'string' ? this[name] : null
  })
}
