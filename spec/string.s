(let the-type string)
(let the-value "")
(include "type_")

(define "Common Behaviours" (= ()
  (define "Identity" (=> ()
    (should "a string is itself." (= ()
      (assert ("" is ""),
      (assert false ("" is-not ""),

      (assert false ("" is " "),
      (assert ("" is-not " "),

      (assert false ("" is "x"),
      (assert ("" is-not "x"),

      (assert false ("" is "X"),
      (assert ("" is-not "X"),

      (assert (" " is " "),
      (assert false (" " is-not " "),

      (assert false (" " is ""),
      (assert (" " is-not ""),

      (assert false (" " is "x"),
      (assert (" " is-not "x"),

      (assert false (" " is "X"),
      (assert (" " is-not "X"),

      (assert false ("X" is " "),
      (assert ("X" is-not " "),

      (assert false ("X" is ""),
      (assert ("X" is-not ""),

      (assert false ("X" is "x"),
      (assert ("X" is-not "x"),

      (assert ("X" is "X"),
      (assert false ("X" is-not "X"),

      (assert false ("x" is " "),
      (assert ("x" is-not " "),

      (assert false ("x" is ""),
      (assert ("x" is-not ""),

      (assert ("x" is "x"),
      (assert false ("x" is-not "x"),

      (assert false ("x" is "X"),
      (assert ("x" is-not "X"),
    ),
  ),

  (define "Equivalence" (=> ()
    (should "a string value is equivalent with itself." (=> ()
      (assert ("" equals ""),
      (assert false ("" not-equals ""),

      (assert false ("" equals " "),
      (assert ("" not-equals " "),

      (assert false ("" equals "x"),
      (assert ("" not-equals "x"),

      (assert false ("" equals "X"),
      (assert ("" not-equals "X"),

      (assert (" " equals " "),
      (assert false (" " not-equals " "),

      (assert false (" " equals ""),
      (assert (" " not-equals ""),

      (assert false (" " equals "x"),
      (assert (" " not-equals "x"),

      (assert false (" " equals "X"),
      (assert (" " not-equals "X"),

      (assert false ("X" equals " "),
      (assert ("X" not-equals " "),

      (assert false ("X" equals ""),
      (assert ("X" not-equals ""),

      (assert false ("X" equals "x"),
      (assert ("X" not-equals "x"),

      (assert ("X" equals "X"),
      (assert false ("X" not-equals "X"),

      (assert false ("x" equals " "),
      (assert ("x" not-equals " "),

      (assert false ("x" equals ""),
      (assert ("x" not-equals ""),

      (assert ("x" equals "x"),
      (assert false ("x" not-equals "x"),

      (assert false ("x" equals "X"),
      (assert ("x" not-equals "X"),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "a string value is equivalent with itself." (=> ()
      (assert ("" == ""),
      (assert false ("" != ""),

      (assert false ("" == " "),
      (assert ("" != " "),

      (assert false ("" == "x"),
      (assert ("" != "x"),

      (assert false ("" == "X"),
      (assert ("" != "X"),

      (assert (" " == " "),
      (assert false (" " != " "),

      (assert false (" " == ""),
      (assert (" " != ""),

      (assert false (" " == "x"),
      (assert (" " != "x"),

      (assert false (" " == "X"),
      (assert (" " != "X"),

      (assert false ("X" == " "),
      (assert ("X" != " "),

      (assert false ("X" == ""),
      (assert ("X" != ""),

      (assert false ("X" == "x"),
      (assert ("X" != "x"),

      (assert ("X" == "X"),
      (assert false ("X" != "X"),

      (assert false ("x" == " "),
      (assert ("x" != " "),

      (assert false ("x" == ""),
      (assert ("x" != ""),

      (assert ("x" == "x"),
      (assert false ("x" != "x"),

      (assert false ("x" == "X"),
      (assert ("x" != "X"),
  ),

  (define "Ordering" (=> ()
    (should "string is compared as chars one by one as their unicode values." (=> ()
      (assert 0 ("" compare ""),
      (assert -1 ("" compare " "),
      (assert -1 ("" compare "x"),
      (assert -1 ("" compare "X"),

      (assert 1 (" " compare ""),
      (assert 0 (" " compare " "),
      (assert -1 (" " compare "x"),
      (assert -1 (" " compare "X"),

      (assert 1 ("x" compare ""),
      (assert 1 ("x" compare " "),
      (assert 0 ("x" compare "x"),
      (assert 1 ("x" compare "X"),

      (assert 1 ("X" compare ""),
      (assert 1 ("X" compare " "),
      (assert -1 ("X" compare "x"),
      (assert 0 ("X" compare "X"),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "'' is defined as the empty value." (=> ()
      (assert "" (string empty),

      (assert ("" is-empty),
      (assert false ("" not-empty),

      (assert false (" " is-empty),
      (assert (" " not-empty),

      (assert false ("x" is-empty),
      (assert ("x" not-empty),

      (assert false ("X" is-empty),
      (assert ("X" not-empty),
  ),

  (define "Encoding" (=> ()
    (should "a string is encoded to itself." (=> ()
      (assert "" ("" to-code),
      (assert " " (" " to-code),
      (assert "x" ("x" to-code),
      (assert "X" ("X" to-code),
    ),
  ),

  (define "Representation" (=> ()
    (should "a string is represented as a series of escaped characters enclosed in \"\"." (=> ()
      (assert "\"\"" ("" to-string),
      (assert "\" \"" (" " to-string),
      (assert "\"x\"" ("x" to-string),
      (assert "\"X\"" ("X" to-string),
      (assert "\"\\r\"" ("\r" to-string),
      (assert "\"\\n\"" ("\n" to-string),
      (assert "\"\\t\"" ("\t" to-string),
    ),
  ),
).

(define "Value Conversion" (= ()
  (should "a string is converted to itself." (= ()
    (assert "" (string of),
    (assert "" (string of ""),
    (assert " " (string of " "),
    (assert "x" (string of "x"),
    (assert "X" (string of "X"),
  ),
  (should "a value is converted to a string by calling its to-string." (= ()
    (assert "true" (string of true),
    (assert "false" (string of false),
    (assert "0" (string of 0),
    (assert "-1" (string of -1),
    (assert "1" (string of 1),
    (assert "(date of 0)" (string of (date of 0),
    (assert "(0 0 1)" (string of (range of 0 0 1),
    (assert "x" (string of (symbol of "x"),
    (assert "(@ 1)" (string of (@ 1),
    (assert "(@:)" (string of (@:),
  ),
  (should "multiple values are joint together by spaces." (= ()
    (assert "aa" (string of "a" "a"),
    (assert "a a" (string of "a" " " "a"),
    (assert "a false" (string of "a " false),
  ),
  (should "a string can be create by the unicode values of chars." (= ()
    (assert "" (string of-chars),
    (assert "A" (string of-chars 0x41),
    (assert "AA" (string of-chars 0x41 0x41),
    (assert "AAA" (string of-chars 0x41 0x41 0x41),
  ),
).

(define "Searching Operations" (= ()
  (define "first" (= ()
    (should "(str first) returns the first character or null w/o arguments." (= ()
      (assert null ("" first),
      (assert "A" ("ABC" first),
    ),
    (should "(str first-of value) returns the offset of the first occurence of value or -1." (= ()
      (assert -1 ("" first-of "A"),
      (assert 0 ("ABC" first-of "A"),
      (assert 1 ("ABC" first-of "B"),
      (assert 2 ("ABC" first-of "C"),
      (assert -1 ("ABC" first-of "D"),
    ),
    (should "(str first-of value from) starts the searching from the value of 'from'." (= ()
      (assert -1 ("" first-of "A" 1),
      (assert -1 ("ABC" first-of "A" 1),
      (assert 1 ("ABC" first-of "B" 1),
      (assert 2 ("ABC" first-of "C" 1),
      (assert -1 ("ABC" first-of "D" 1),
    ),
  ),
  (define "last" (= ()
    (should "(str last) returns the last character or null w/o arguments." (= ()
      (assert null ("" last),
      (assert "C" ("ABC" last),
    ),
    (should "(str last-of value) returns the offset of the last occurence of value or -1." (= ()
      (assert -1 ("" last-of "A"),
      (assert 3 ("ABCABC" last-of "A"),
      (assert 4 ("ABCABC" last-of "B"),
      (assert 5 ("ABCABC" last-of "C"),
      (assert -1 ("ABCABC" last-of "D"),
    ),
    (should "(str last value from) starts the searching from the offset value of 'from'." (= ()
      (assert -1 ("" last-of "A" 1),
      (assert 0 ("ABCABC" last-of "A" -1),
      (assert 3 ("ABCABC" last-of "A" 3),
      (assert 1 ("ABCABC" last-of "B" 3),
      (assert 2 ("ABCABC" last-of "C" 3),
      (assert -1 ("ABCABC" last-of "D" 3),
    ),
  ),
  (define "starts-with" (= ()
    (should "to test if a string has a particular prefix." (= ()
      (assert ("" starts-with ""),
      (assert ("ABC" starts-with ""),
      (assert ("ABC" starts-with "A"),
      (assert ("ABC" starts-with "AB"),
      (assert ("ABC" starts-with "ABC"),
      (assert false ("ABC" starts-with "B"),
    ),
  ),
  (define "ends-with" (= ()
    (should "to test if a string has a particular suffix." (= ()
      (assert ("" ends-with ""),
      (assert ("ABC" ends-with ""),
      (assert ("ABC" ends-with "C"),
      (assert ("ABC" ends-with "BC"),
      (assert ("ABC" ends-with "ABC"),
      (assert false ("ABC" ends-with "B"),
    ),
  ),
).

(define "Converting Operations" (= ()
  (define "copy" (= ()
    (should "(str copy) returns the original string w/o arguments." (= ()
      (assert "" ("" copy),
      (assert "ABC" ("ABC" copy),
    ),
    (should "(str copy begin) returns the sub-string from the begin offset." (= ()
      (assert "" ("" copy 0),
      (assert "" ("" copy 1),
      (assert "ABC" ("ABC" copy 0),
      (assert "BC" ("ABC" copy 1),
      (assert "C" ("ABC" copy -1),
    ),
    (should "(str copy begin end) returns the sub-string from the begin offset to end offset." (= ()
      (assert "" ("" copy 0 1),
      (assert "" ("" copy 1 2),
      (assert "" ("ABC" copy 0 0),
      (assert "" ("ABC" copy 1 1),
      (assert "A" ("ABC" copy 0 1),
      (assert "AB" ("ABC" copy 0 2),
      (assert "ABC" ("ABC" copy 0 10),
      (assert "" ("ABC" copy -1 0),
      (assert "" ("ABC" copy -1 -1),
      (assert "" ("ABC" copy -1 1),
      (assert "" ("ABC" copy -1 2),
      (assert "C" ("ABC" copy -1 3),
      (assert "AB" ("ABC" copy 0 -1),
      (assert "A" ("ABC" copy 0 -2),
      (assert "" ("ABC" copy 0 -3),
    ),
  ),
  (define "trim" (= ()
    (should "removes leading and trailing space characters." (= ()
      (assert "" ("" trim),
      (assert "" (" " trim),
      (assert "A" (" \r\n\tA\r\n\t " trim),
    ),
  ),
  (define "trim-left" (= ()
    (should "removes leading space characters." (= ()
      (assert "" ("" trim-left),
      (assert "" (" " trim-left),
      (assert "A\r\n\t " (" \r\n\tA\r\n\t " trim-left),
    ),
  ),
  (define "trim-right" (= ()
    (should "removes trailing space characters." (= ()
      (assert "" ("" trim-right),
      (assert "" (" " trim-right),
      (assert " \r\n\tA" (" \r\n\tA\r\n\t " trim-right),
    ),
  ),
  (define "replace" (= ()
    (should "(str replace) returns the original string" (= ()
      (assert "" ("" replace),
      (assert "ABC" ("ABC" replace),
    ),
    (should "(str replace value) removes the occurences of value" (= ()
      (assert "" ("" replace "A"),
      (assert "BC" ("ABC" replace "A"),
      (assert "AC" ("ABC" replace "B"),
      (assert "BCBC" ("ABCABC" replace "A"),
      (assert "ACAC" ("ABCABC" replace "B"),
    ),
    (should "(str replace value new-value) replace the occurences of value with new-value" (= ()
      (assert "" ("" replace "A" "D"),
      (assert "DBC" ("ABC" replace "A" "D"),
      (assert "ADC" ("ABC" replace "B" "D"),
      (assert "DBCDBC" ("ABCABC" replace "A" "D"),
      (assert "ADCADC" ("ABCABC" replace "B" "D"),
    ),
  ),
  (define "to-upper" (= ()
    (should "convert characters in a string to upper-case." (= ()
      (assert "" ("" to-upper),
      (assert " " (" " to-upper),
      (assert "A" ("a" to-upper),
      (assert "ABC" ("abc" to-upper),
      (assert "A" ("A" to-upper),
      (assert "ABC" ("ABC" to-upper),
    ),
  ),
  (define "to-lower" (= ()
    (should "convert characters in a string to lower-case." (= ()
      (assert "" ("" to-lower),
      (assert " " (" " to-lower),
      (assert "a" ("a" to-lower),
      (assert "abc" ("abc" to-lower),
      (assert "a" ("A" to-lower),
      (assert "abc" ("ABC" to-lower),
    ),
  ),
  (define "string indexer with number index/indices" (= ()
    (should "(str index) returns the charact at the index." (= ()
      (assert "" ("" 0),
      (assert "" ("" 1),
      (assert "" ("" -1),
      (assert "A" ("ABC" 0),
      (assert "B" ("ABC" 1),
      (assert "C" ("ABC" -1),
    ),
    (should "(str index length) returns the sub-string from index by the length." (= ()
      (assert "" ("" 0 0),
      (assert "" ("" 0 1),
      (assert "" ("" 1 0),
      (assert "" ("" 1 1),
      (assert "" ("" -1 0),
      (assert "" ("" -1 1),

      (assert "A" ("ABC" 0 1),
      (assert "AB" ("ABC" 0 2),
      (assert "B" ("ABC" 1 1),
      (assert "BC" ("ABC" 1 2),
      (assert "" ("ABC" -1 0),
      (assert "C" ("ABC" -1 1),
      (assert "" ("ABC" 3 0),
      (assert "" ("ABC" 3 1),
    ),
  ),
).

(define "Combination & splitting" (= ()
  (define "concat / +" (= ()
    (should "concat one or more strings to this string" (= ()
      (assert "" ("" concat ),
      (assert "" ("" concat ""),
      (assert "A" ("" concat "A"),
      (assert "AB" ("" concat "A" "B"),

      (assert "" ("" + ),
      (assert "" ("" + ""),
      (assert "A" ("" + "A"),
      (assert "AB" ("" + "A" "B"),

      (assert "X" ("X" concat ),
      (assert "X" ("X" concat ""),
      (assert "XA" ("X" concat "A"),
      (assert "XAB" ("X" concat "A" "B"),

      (assert "X" ("X" + ),
      (assert "X" ("X" + ""),
      (assert "XA" ("X" + "A"),
      (assert "XAB" ("X" + "A" "B"),
    ),
    (should "convert non-strings to strings" (= ()
      (assert "" ("" concat ),
      (assert "true" ("" concat true),
      (assert "truefalse" ("" concat true false),
      (assert "0" ("" concat 0 ),
      (assert "01" ("" concat 0 1),
      (assert "10" ("" concat 1 0),
      (assert "0-1" ("" concat 0 -1),
      (assert "-10" ("" concat -1 0),

      (assert "" ("" + ),
      (assert "true" ("" + true),
      (assert "truefalse" ("" + true false),
      (assert "0" ("" + 0 ),
      (assert "01" ("" + 0 1),
      (assert "10" ("" + 1 0),
      (assert "0-1" ("" + 0 -1),
      (assert "-10" ("" + -1 0),
    ),
  ),
  (define "ending removing: -" (= ()
    (should "(str - suffix) removes suffix from str" (= ()
      (assert "" ("" -),
      (assert "" ("" - ""),
      (assert "" ("" - "A"),
      (assert "" ("A" - "A"),
      (assert "ABC" ("ABC" - "A"),
      (assert "AB" ("ABC" - "C"),
    ),
    (should "(str - count) removes count of characters from the end." (= ()
      (assert "" ("" - 0),
      (assert "" ("" - 1),
      (assert "A" ("A" - 0),
      (assert "" ("A" - 1),
      (assert "" ("A" - 2),
      (assert "ABC" ("ABC" - 0),
      (assert "AB" ("ABC" - 1),
      (assert "A" ("ABC" - 2),
      (assert "" ("ABC" - 3),
      (assert "" ("ABC" - 4),
    ),
  ),
  (define "split" (= ()
    (should "(str split) returns an array with single element of the orginal string" (= ()
      (assert (("" split) is-a array),
      (assert ((("" split) length) is 1),

      (assert (("ABC" split) is-a array),
      (assert ((("ABC" split) length) is 1),
    ),
    (should "(str split separater) returns an array splted by the separater." (= ()
      (assert (("" split "") is-a array),
      (assert ((("" split "") length) is 1),

      (assert (("ABC" split "") is-a array),
      (assert ((("ABC" split "") length) is 1),

      (assert (("" split "A") is-a array),
      (assert ((("" split "A") length) is 1),

      (assert (("ABC" split "A") is-a array),
      (assert ((("ABC" split "A") length) is 2),

      (assert (("ABC" split "B") is-a array),
      (assert ((("ABC" split "B") length) is 2),

      (assert (("ABBC" split "B") is-a array),
      (assert ((("ABBC" split "B") length) is 3),

      (assert (("ABC" split "C") is-a array),
      (assert ((("ABC" split "C") length) is 2),
    ),
  ),
).

(define "Character Code" (= ()
  (define "char-at" (= ()
    (should "returns the unicode value of the char at the offset or null" (= ()
      (assert null ("" char-at)
      (assert null ("" char-at 0)
      (assert null ("" char-at -1)
      (assert null ("" char-at 1)

      (assert 65 ("ABC" char-at)
      (assert 65 ("ABC" char-at 0)
      (assert 66 ("ABC" char-at 1)
      (assert 67 ("ABC" char-at 2)
      (assert null ("ABC" char-at 3)
      (assert null ("ABC" char-at -1)
    ),
  ),
).
