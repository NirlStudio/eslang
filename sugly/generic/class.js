'use strict'

module.exports = function ($void) {
  var $ = $void.$
  var Type = $.class
  var $Type = $.type
  var $Tuple = $.tuple
  var $Object = $.object
  var $Operator = $.operator
  var link = $void.link
  var Object$ = $void.Object
  var typeOf = $void.typeOf
  var thisCall = $void.thisCall
  var ClassType$ = $void.ClassType
  var createClass = $void.createClass
  var typeEncoder = $void.typeEncoder
  var typeIndexer = $void.typeIndexer
  var protoIndexer = $void.protoIndexer
  var sharedSymbolOf = $void.sharedSymbolOf

  // define a new class.
  link(Type, 'of', function () {
    // prepare class members
    var typeMembers = new Object$()
    var instMembers = new Object$()
    for (var i = 0; i < arguments.length; i++) {
      var parent = arguments[i]
      if (parent instanceof ClassType$) {
        Object.assign(typeMembers, parent)
        Object.assign(instMembers, parent.proto)
      } else if (parent instanceof Object$ || typeOf(parent) === $Object) {
        Object.assign(typeMembers, parent)
        if (parent.proto instanceof Object$ || typeOf(parent.proto) === $Object) {
          Object.assign(instMembers, parent.proto)
        }
      }
    }
    delete typeMembers.proto
    delete instMembers.type

    // create empty class
    var class_ = Object.assign(createClass(), typeMembers)
    var proto_ = Object.assign(class_.proto, instMembers)
    typeMembers.proto = instMembers

    // add function to create an empty instance
    link(class_, 'empty', function () {
      return Object.create(proto_)
    })

    // add function to create an instance with properties
    var constructor = proto_.constructor
    link(class_, 'of', typeof constructor === 'function' && constructor.type !== $Operator ? function (props) {
      var obj = Object.create(proto_)
      if (arguments.length < 2) {
        constructor.call(obj, props instanceof Object$ || typeOf(props) === $Object ? props : null)
      } else {
        var allProps = new Object$()
        for (var i = 0; i < arguments.length; i++) {
          props = arguments[i]
          if (props instanceof Object$ || typeOf(props) === $Object) {
            Object.assign(allProps, props)
          }
        }
        constructor.call(obj, allProps)
      }
      return obj
    } : function (props) {
      if (arguments.length < 2) {
        return props instanceof Object$ || typeOf(props) === $Object
          ? Object.assign(Object.create(proto_), props)
          : Object.create(proto_)
      }
      var obj = Object.create(proto_)
      for (var i = 0; i < arguments.length; i++) {
        props = arguments[i]
        if (props instanceof Object$ || typeOf(props) === $Object) {
          Object.assign(obj, props)
        }
      }
      return obj
    })

    // Encoding
    var class$ = function () {}
    class$.prototype = proto_
    link(class_, 'to-code', function (ctx) {
      return $Tuple.of(sharedSymbolOf('class'), sharedSymbolOf('of'), typeMembers['to-code'](ctx))
    })

    // Description
    link(class_, 'to-string', function () {
      // TODO: #( name )# (class of typeMembers)
      return '#( ' + (this.name || '?class') + ' )# ' +
        thisCall(this, 'to-code')['to-string']() // TODO
    })

    // override type indexer
    typeIndexer(class_)

    // Class type verifier : TODO
    link(proto_, 'is-a', function (t) {
      return t === class_ || t === $Object
    })
    link(proto_, 'is-not-a', function (t) {
      return thisCall(this, 'is-a') !== true
    })

    // override proto indexer
    var indexer = typeof proto_[':'] === 'function' &&
      proto_[':'].type !== $Operator ? proto_[':'] : null
    indexer ? protoIndexer(class_, indexer) : protoIndexer(class_)

    return class_
  })

  // Type Verification: shared for all classes.
  link(Type, 'is-a', function (type) {
    return type === $Type || (this !== Type && type === Type)
  })
  link(Type, 'is-not-a', function (type) {
    return thisCall(this, 'is-a', type) !== true
  })

  // Emptiness: shared by all classes.
  // The meta class is taken as empty.
  // Any other class is not empty.
  link(Type, 'is-empty', function () {
    return this === Type
  })
  link(Type, 'not-empty', function () {
    return thisCall(this, 'is-empty') !== true
  })

  // Encoding & Description of class
  typeEncoder(Type)

  // Type Indexer for class.
  typeIndexer(Type)
}
