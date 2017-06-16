'use strict'

module.exports = function module ($void) {
  var $ = $void.$
  var Type = $.module
  var $Tuple = $.tuple
  var $Symbol = $.symbol
  var link = $void.link
  var Module$ = $void.Module
  var CodingContext$ = $void.CodingContext
  var typeIndexer = $void.typeIndexer
  var typeVerifier = $void.typeVerifier

  // create an empty module.
  link(Type, 'empty', function () {
    return new Module$(null)
  })

  // create an array with its elements
  link(Type, 'of', function (uri) {
    return typeof $.load === 'function' ? $.load(uri) : null
  })

  // type Indexer
  typeIndexer(this)

  // Type Verification
  typeVerifier(Type)

  var proto = Type.proto
  // determine emptiness by module uri.
  link(proto, 'is-empty', function () {
    return this instanceof Module$
      ? typeof this['module-uri'] === 'undefined' || this['module-uri'] === null
      : null
  }, 'not-empty', function () {
    return this instanceof Module$
      ? typeof this['module-uri'] !== 'undefined' && this['module-uri'] === null
      : null
  })

  // Encoding
  link(proto, 'to-code', function (ctx) {
    if (!(this instanceof Module$)) {
      return null
    }
    var uri = this['module-uri']
    if (typeof uri !== 'string' || !uri) {
      return null
    }
    if (ctx instanceof CodingContext$) {
      ctx.touch(this, Type) // to be reused if required.
      return ctx.complete($Tuple.of($Symbol.of('load'), uri))
    } else {
      return $Tuple.of($Symbol.of('load'), uri)
    }
  })

  // Description
  link(proto, 'to-string', function () {
    return this instanceof Module$
      ? '(module of "' + (this['module-uri'] || '<unkown>') + '")'
      : null
  })
}
