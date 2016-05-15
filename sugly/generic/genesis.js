'use strict'

module.exports = function () {

  /* In the beginning God created the heavens and the earth. */
  var $ = Object.create(null)
  var classNull = Object.create(null)

  /* Now the earth was formless and empty, */
  //var $ = Object.create(classNull)

  /* "Now there be light," */
  var classBool = Object.create(classNull)
  var classNumber = Object.create(classNull)
  var classString = Object.create(classNull)
  var classSymbol = Object.create(classNull)
  var classObject = Object.create(classNull)
  var classFunction = Object.create(classNull)

  var typeNull = classNull.static = Object.create(classObject)
  var typeBool = classBool.static = Object.create(classObject)
  var typeNumber = classNumber.static = Object.create(classObject)
  var typeString = classString.static = Object.create(classObject)
  var typeSymbol = classSymbol.static = Object.create(classObject)
  var typeObject = classObject.static = Object.create(classObject)
  var typeFunction = classFunction.static = Object.create(classObject)

  typeNull.class = classNull
  typeBool.class = classBool
  typeNumber.class = classNumber
  typeString.class = classString
  typeSymbol.class = classSymbol
  typeObject.class = classObject
  typeFunction.class = classFunction

  /* Nameless beginning of heaven and earth, the famous mother of all things. */
  $.identityName = '$'
  $.Null = typeNull
  $.Bool = typeBool
  $.Number = typeNumber
  $.String = typeString
  $.Symbol = typeSymbol
  $.Object = typeObject
  $.Function = typeFunction

  var typeInt = $.Int = Object.create(classObject)
  var classInt = typeInt.class = Object.create(classNumber)
  classInt.static = typeInt

  var typeFloat = $.Float = Object.create(classObject)
  var classFloat = typeFloat.class = Object.create(classNumber)
  classFloat.static = typeFloat

  var typeInterface = $.Interface = Object.create(classObject)
  var classInterface = typeInterface.class = Object.create(classObject)
  classInterface.static = typeInterface

  var typeDate = $.Date = Object.create(classObject)
  var classDate = typeDate.class = Object.create(classObject)
  classDate.static = typeDate

  var typeArray = $.Array = Object.create(classObject)
  var classArray = typeArray.class = Object.create(classObject)
  classArray.static = typeArray

  var typeRange = $.Range = Object.create(classObject)
  var classRange = typeRange.class = Object.create(classObject)
  classRange.static = typeRange

  var typeIterator = $.Iterator = Object.create(typeInterface)
  var classIterator = typeIterator.class = Object.create(classInterface)
  classIterator.static = typeIterator

  return $
}
