(var * (load "./share/type" (@ the-type: string).

(define "String Common Behaviors" (= ()
  (define "Identity" (=> ()
    (should "a string is itself." (= ()
      (assert ("" is "").
      (assert false ("" is-not "").

      (assert ("s" is "s").
      (assert false ("s" is-not "s").

      (assert false ("s" is "S").
      (assert ("s" is-not "S").

      (assert ((+ "ss" "S") is (+ "s" "sS").
    ).
  ).

  (define "Equivalence" (=> ()
    (should "string equivalence is the same of identity." (=> ()
      (assert ($("" "is") is ("" "equals")).
      (assert ($("s" "is") is ("s" "equals")).

      (assert ($("" "is") equals ("s" "equals")).
      (assert ($("s" "is") equals ("" "equals")).

      (assert ($("" "equals") equals ("s" "is")).
      (assert ($("s" "equals") equals ("" "is")).
    ).
  ).

  (define "Ordering" (=> ()
    (should "an empty string is less than any non-empty string." (=> ()
      (assert 0 ("" compares-to "").

      (assert -1 ("" compares-to " ").
      (assert 1 (" " compares-to "").

      (assert -1 ("" compares-to "\t").
      (assert 1 ("\t" compares-to "").

      (assert -1 ("" compares-to "\r").
      (assert 1 ("\r" compares-to "").

      (assert -1 ("" compares-to "\n").
      (assert 1 ("\n" compares-to "").

      (assert -1 ("" compares-to "a").
      (assert 1 ("a" compares-to "").

      (assert -1 ("" compares-to "A").
      (assert 1 ("A" compares-to "").

      (assert -1 ("a" compares-to "aa").
      (assert 1 ("aa" compares-to "a").

      (assert -1 ("A" compares-to "AA").
      (assert 1 ("AA" compares-to "A").
    ).
    (should "an string is compared by each character's unicode." (=> ()
      (assert 0 ("a" compares-to "a").
      (assert 0 ("A" compares-to "A").

      (assert -1 ("A" compares-to "a").
      (assert 1 ("a" compares-to "A").

      (assert -1 ("aa" compares-to "ab").
      (assert 1 ("ab" compares-to "aa").
    ).
  ).

  (define "Emptiness" (=> ()
    (should "'' is defined as the empty value." (=> ()
      (assert "" (string empty).

      (assert ("" is-empty).
      (assert false ("" not-empty).

      (assert false (" " is-empty).
      (assert (" " not-empty).

      (assert false ("a" is-empty).
      (assert ("a" not-empty).

      (assert false ("A" is-empty).
      (assert ("A" not-empty).
  ).

  (define "Encoding" (=> ()
    (should "a string is encoded to itself." (=> ()
      (assert "" ("" to-code).
      (assert " " (" " to-code).
      (assert "a" ("a" to-code).
      (assert "A" ("A" to-code).
    ).
  ).

  (define "Representation" (=> ()
    (should "a string is represented as a series of escaped characters enclosed in \"\"." (=> ()
      (assert "\"\"" ("" to-string).
      (assert "\" \"" (" " to-string).
      (assert "\"a\"" ("a" to-string).
      (assert "\"A\"" ("A" to-string).
      (assert "\"\\r\"" ("\r" to-string).
      (assert "\"\\n\"" ("\n" to-string).
      (assert "\"\\t\"" ("\t" to-string).
    ).
  ).
).

(define "(string of ...)" (= ()
  (should "(string of) returns an empty string." (= ()
    (assert "" (string of).
  ).
  (should "(string of str) returns str." (= ()
    (assert "" (string of "").
    (assert "a" (string of "a").
    (assert "A" (string of "A").
    (assert " " (string of " ").
    (assert "\t" (string of "\t").
    (assert "\r" (string of "\r").
    (assert "\n" (string of "\n").
  ).
  (should "(string of value) returns (value to-string)." (= ()
    (assert "null" (string of null).

    (assert "type" (string of type).
    (assert "bool" (string of bool).
    (assert "string" (string of string).
    (assert "number" (string of number).
    (assert "date" (string of date).
    (assert "range" (string of range).
    (assert "symbol" (string of symbol).
    (assert "tuple" (string of tuple).
    (assert "operator" (string of operator).
    (assert "lambda" (string of lambda).
    (assert "function" (string of function).
    (assert "array" (string of array).
    (assert "object" (string of object).
    (assert "class" (string of class).

    (assert "true" (string of true).
    (assert "false" (string of false).

    (assert "0" (string of 0).
    (assert "-0" (string of -0).
    (assert "-1" (string of -1).
    (assert "1" (string of 1).

    (assert "(date empty)" (string of (date of 0).

    (assert "(0 0 1)" (string of (range of 0 0 1).

    (assert "x" (string of (` x).
    (assert "x" (string of (symbol of "x").

    (assert "(x y)" (string of (` (x y).
    (assert "(x y)" (string of (tuple of (` x) (` y).

    (assert "(@ 1)" (string of (@ 1).
    (assert "(@ 1, 2)" (string of (@ 1 2).

    (assert "(@:)" (string of (@:).
    (assert "(@ x: 1)" (string of (@ x:1).

    (var spring (@:class).
    (assert "spring" (string of spring).
  ).
  (should "(string of value ...) concatenates the string value of values" (= ()
    (assert "" (string of "" "").
    (assert "aA" (string of "a" "A").
    (assert "a A" (string of "a" " " "A").
    (assert "a false" (string of "a " false).
  ).
).

(define "(string of-chars ...)" (= ()
  (should "a string can be create by the unicode values of chars." (= ()
    (assert "" (string of-chars).
    (assert "A" (string of-chars 0x41).
    (assert "AA" (string of-chars 0x41 0x41).
    (assert "AAA" (string of-chars 0x41 0x41 0x41).
  ).
).

(define "(string of-code ...)" (= ()
  (should "(string of-code) returns (string empty)." (= ()
    (assert "" (string of-code).
  ).
  (should "(string of-code value) returns ((value to-code) to-string)." (= ()
    (assert (("abc" to-code) to-string) (string of-code "abc").
    (assert ((true to-code) to-string) (string of-code true).
    (assert ((1 to-code) to-string) (string of-code 1).
    (assert (((@ 1 2  3) to-code) to-string) (string of-code (@ 1 2 3)).
    (assert (((@ 1 2  10:3) to-code) to-string) (string of-code (@ 1 2 10:3)).
    (assert (((@ x:1 y:2  z:3) to-code) to-string) (string of-code (@ x:1 y:2 z:3)).
  ).
).

(define "(a-string length)" (= ()
  (should "(str \"length\") is a function." (= ()
    (assert ($("" "length") is-a lambda).
    (assert ($("A" "length") is-a lambda).
  ).
  (should "(str length) returns the count of characters." (= ()
    (assert 0 ("" length).
    (assert 1 ("A" length).
    (assert 2 ("AA" length).
    (assert 3 ("AAA" length).
  ).
).

(define "(a-string first ...)" (= ()
  (should "(str first) returns null for an empty string." (= ()
    (assert null ("" first).
  ).
  (should "(str first) returns the first character for a non-empty string." (= ()
    (assert "A" ("ABC" first).
  ).
  (should "(str first count) returns the empty string for an empty string." (= ()
    (assert "" ("" first -2).
    (assert "" ("" first -1).
    (assert "" ("" first 0).
    (assert "" ("" first 1).
    (assert "" ("" first 2).
  ).
  (should "(str first count) returns the first _count_ of characters." (= ()
    (assert "" ("ABC" first -2).
    (assert "" ("ABC" first -1).
    (assert "" ("ABC" first 0).
    (assert "A" ("ABC" first 1).
    (assert "AB" ("ABC" first 2).
    (assert "ABC" ("ABC" first 3).
    (assert "ABC" ("ABC" first 4).
  ).
).

(define "(a-string first-of ...)" (= ()
  (should "(str first-of) always returns -1." (= ()
    (assert -1 ("" first-of).
    (assert -1 ("ABC" first-of).
  ).
  (should "(str first-of \"\") always returns 0." (= ()
    (assert 0 ("" first-of "").
    (assert 0 ("A" first-of "").
    (assert 0 ("ABC" first-of "").
  ).
  (should "(str first-of value) returns the index of first occurrence of value or -1." (= ()
    (assert -1 ("" first-of "A").
    (assert -1 ("A" first-of "AB").
    (assert 0 ("A" first-of "A").
    (assert 1 ("BA" first-of "A").
    (assert 1 ("BAC" first-of "A").
  ).
  (should "(str first-of value from) starts the search from the value of 'from'." (= ()
    (assert -1 ("" first-of "A" 0).
    (assert -1 ("A" first-of "AB" 0).
    (assert 0 ("A" first-of "A" 0).
    (assert 1 ("BA" first-of "A" 0).
    (assert 1 ("BAC" first-of "A" 0).

    (assert -1 ("" first-of "A" 1).
    (assert -1 ("" first-of "A" 1).
    (assert -1 ("ABC" first-of "A" 1).
    (assert 1 ("ABC" first-of "B" 1).
    (assert 2 ("ABC" first-of "C" 1).
    (assert -1 ("ABC" first-of "D" 1).
  ).
  (should "(str first-of value from) with from < 0 behaves like from = from + (str length)." (= ()
    (assert -1 ("" first-of "A" -1).
    (assert -1 ("" first-of "A" -2).

    (assert -1 ("A" first-of "AB" -1).
    (assert 0 ("A" first-of "A" -1).
    (assert 1 ("BA" first-of "A" -1).
    (assert -1 ("BAC" first-of "A" -1).

    (assert 0 ("BAC" first-of "B" -4).
    (assert 1 ("BAC" first-of "A" -4).
  ).
).

(define "(a-string last ...)" (= ()
  (should "(str last) returns null for an empty string." (= ()
    (assert null ("" last).
  ).
  (should "(str last) returns the last character a non-empty string." (= ()
    (assert "A" ("A" last).
    (assert "B" ("AB" last).
    (assert "C" ("ABC" last).
  ).
  (should "(str last count) returns the empty string for an empty string." (= ()
    (assert "" ("" last -2).
    (assert "" ("" last -1).
    (assert "" ("" last 0).
    (assert "" ("" last 1).
    (assert "" ("" last 2).
  ).
  (should "(str last count) returns the first _count_ of characters." (= ()
    (assert "" ("ABC" last -2).
    (assert "" ("ABC" last -1).
    (assert "" ("ABC" last 0).
    (assert "C" ("ABC" last 1).
    (assert "BC" ("ABC" last 2).
    (assert "ABC" ("ABC" last 3).
    (assert "ABC" ("ABC" last 4).
  ).
).

(define "(a-string last-of ...)" (= ()
  (should "(str last-of) always returns -1." (= ()
    (assert -1 ("" last-of).
    (assert -1 ("ABC" last-of).
  ).
  (should "(str last-of \"\") always returns (str length)." (= ()
    (assert 0 ("" last-of "").
    (assert 1 ("A" last-of "").
    (assert 2 ("AB" last-of "").
    (assert 3 ("ABC" last-of "").
  ).
  (should "(str last-of value) returns the offset of the last occurrence of value or -1." (= ()
    (assert 3 ("ABCABC" last-of "A").
    (assert 4 ("ABCABC" last-of "B").
    (assert 5 ("ABCABC" last-of "C").
    (assert -1 ("ABCABC" last-of "D").
  ).
  (should "(str last-of value from) starts the searching from the offset value of 'from'." (= ()
    (assert 3 ("ABCABC" last-of "A" 6).
    (assert 4 ("ABCABC" last-of "B" 6).
    (assert 5 ("ABCABC" last-of "C" 6).
    (assert -1 ("ABCABC" last-of "D" 6).

    (assert 3 ("ABCABC" last-of "A" 10).
    (assert 4 ("ABCABC" last-of "B" 10).
    (assert 5 ("ABCABC" last-of "C" 10).
    (assert -1 ("ABCABC" last-of "D" 10).

    (assert -1 ("" last-of "A" 0).
    (assert -1 ("" last-of "A" 1).
    (assert 0 ("ABCABC" last-of "A" 0).
    (assert 0 ("ABCABC" last-of "A" 1).
    (assert 0 ("ABCABC" last-of "A" 2).
    (assert 3 ("ABCABC" last-of "A" 3).
    (assert 1 ("ABCABC" last-of "B" 3).
    (assert 2 ("ABCABC" last-of "C" 3).
    (assert -1 ("ABCABC" last-of "D" 3).
  ).
  (should "(str last-of value from) with from < 0 behaves like from = from + (str length)." (= ()
    (assert 0 ("" last-of "" -1).
    (assert 0 ("" last-of "" -2).

    (assert -1 ("" last-of "A" -1).
    (assert -1 ("" last-of "A" -2).

    (assert 3 ("ABCABC" last-of "A" -1).
    (assert 3 ("ABCABC" last-of "A" -2).
    (assert 3 ("ABCABC" last-of "A" -3).
    (assert 0 ("ABCABC" last-of "A" -4).
    (assert 0 ("ABCABC" last-of "A" -5).
    (assert 0 ("ABCABC" last-of "A" -6).
    (assert 0 ("ABCABC" last-of "A" -7).
    (assert 0 ("ABCABC" last-of "A" -8).
    (assert -1 ("ABCABC" last-of "B" -7).
    (assert -1 ("ABCABC" last-of "C" -7).
  ).
).

(define "(a-string contains ...)" (= ()
  (should "(str contains) always returns false." (= ()
    (assert false ("" contains).
    (assert false ("A" contains).
    (assert false ("ABC" contains).
  ).
  (should "(str contains (string empty)) always returns true." (= ()
    (assert ("" contains "").
    (assert ("" contains (string empty).
    (assert ("A" contains (string empty).
    (assert ("ABC" contains "").
    (assert ("ABC" contains (string empty).
  ).
  (should "(str contains s) returns true if s is a sub-string of str." (= ()
    (assert ("A" contains "A").
    (assert ("ABC" contains "A").
    (assert ("ABC" contains "B").
    (assert ("ABC" contains "C").
    (assert ("ABC" contains "AB").
    (assert ("ABC" contains "BC").
    (assert ("ABCD" contains "BC").
  ).
  (should "(str contains s) returns true if s is a case-sensitive sub-string of str." (= ()
    (assert ("A" contains "A").
    (assert ("AbC" contains "A").
    (assert ("AbC" contains "b").
    (assert ("AbC" contains "C").
    (assert ("AbC" contains "Ab").
    (assert ("AbC" contains "bC").
    (assert ("AbCd" contains "bC").
  ).
  (should "(str contains s) returns false if s is not a case-sensitive sub-string of str." (= ()
    (assert false ("A" contains "a").
    (assert false ("A" contains "b").
    (assert false ("a" contains "A").
    (assert false ("a" contains "b").

    (assert false ("AbC" contains "a").
    (assert false ("AbC" contains "B").
    (assert false ("AbC" contains "c").
    (assert false ("AbC" contains "d").

    (assert false ("AbC" contains "AB").
    (assert false ("AbC" contains "BC").
    (assert false ("AbCd" contains "BC").
  ).
).

(define "(a-string starts-with ...)" (= ()
  (should "(str starts-with) always returns false." (= ()
    (assert false ("" starts-with).
    (assert false ("A" starts-with).
    (assert false ("ABC" starts-with).
  ).
  (should "(str starts-with non-str) always returns false." (= ()
    (assert false ("" starts-with null).
    (assert false ("" starts-with type).
    (assert false ("" starts-with false).
    (assert false ("" starts-with 0).
    (assert false ("" starts-with (date empty).
    (assert false ("" starts-with (range empty).
    (assert false ("" starts-with (` x).
    (assert false ("" starts-with (` (x y)).
    (assert false ("" starts-with (=).
    (assert false ("" starts-with (=>).
    (assert false ("" starts-with (=?).
    (assert false ("" starts-with (@).
    (assert false ("" starts-with (@:).

    (assert false ("A" starts-with null).
    (assert false ("A" starts-with type).
    (assert false ("A" starts-with false).
    (assert false ("A" starts-with 0).
    (assert false ("A" starts-with (date empty).
    (assert false ("A" starts-with (range empty).
    (assert false ("A" starts-with (` x).
    (assert false ("A" starts-with (` (x y)).
    (assert false ("A" starts-with (=).
    (assert false ("A" starts-with (=>).
    (assert false ("A" starts-with (=?).
    (assert false ("A" starts-with (@).
    (assert false ("A" starts-with (@:).
  ).
  (should "(str starts-with \"\") always returns true." (= ()
    (assert ("" starts-with "").
    (assert ("A" starts-with "").
    (assert ("ABC" starts-with "").
  ).
  (should "(str starts-with prefix) return true if str starts with prefix." (= ()
    (assert ("ABC" starts-with "A").
    (assert ("ABC" starts-with "AB").
    (assert false ("ABC" starts-with "AA").

    (assert ("ABC" starts-with "ABC").
    (assert false ("ABC" starts-with "ABD").
    (assert false ("ABC" starts-with "ABCD").

    (assert false ("ABC" starts-with "B").
    (assert false ("ABC" starts-with "C").
  ).
  (should "(str starts-with prefix1 prefix2 ...) return true if str starts with any given prefix." (= ()
    (assert ("ABC" starts-with "A", "B").
    (assert ("ABC" starts-with "B", "A").
    (assert ("ABC" starts-with "B", "C", "A").

    (assert ("ABC" starts-with "AB", "BA").
    (assert ("ABC" starts-with "BA", "AB").
    (assert ("ABC" starts-with "AA", "BA", "AB").

    (assert false ("ABC" starts-with "AA", "BC").
    (assert false ("ABC" starts-with "BC", "AA").
    (assert false ("ABC" starts-with "BC", "AA", "BD").

    (assert ("ABC" starts-with "ABC", "BCD").
    (assert ("ABC" starts-with "BCD", "ABC").
    (assert ("ABC" starts-with "BCD", "ABC", "BC").

    (assert false ("ABC" starts-with "ABD", "B").
    (assert false ("ABC" starts-with "ABD", "B", "C").

    (assert false ("ABC" starts-with "ABCD").
    (assert false ("ABC" starts-with "ABCD", "B", "C").

    (assert false ("ABC" starts-with "B", "C").
    (assert false ("ABC" starts-with "C", "B").
    (assert false ("ABC" starts-with "C", "B", "D").
  ).
).

(define "(a-string ends-with ...)" (= ()
  (should "(str ends-with) always returns false." (= ()
    (assert false ("" ends-with).
    (assert false ("A" ends-with).
    (assert false ("ABC" ends-with).
  ).
  (should "(str ends-with non-str) always returns false." (= ()
    (assert false ("" ends-with null).
    (assert false ("" ends-with type).
    (assert false ("" ends-with false).
    (assert false ("" ends-with 0).
    (assert false ("" ends-with (date empty).
    (assert false ("" ends-with (range empty).
    (assert false ("" ends-with (` x).
    (assert false ("" ends-with (` (x y)).
    (assert false ("" ends-with (=).
    (assert false ("" ends-with (=>).
    (assert false ("" ends-with (=?).
    (assert false ("" ends-with (@).
    (assert false ("" ends-with (@:).

    (assert false ("A" ends-with null).
    (assert false ("A" ends-with type).
    (assert false ("A" ends-with false).
    (assert false ("A" ends-with 0).
    (assert false ("A" ends-with (date empty).
    (assert false ("A" ends-with (range empty).
    (assert false ("A" ends-with (` x).
    (assert false ("A" ends-with (` (x y)).
    (assert false ("A" ends-with (=).
    (assert false ("A" ends-with (=>).
    (assert false ("A" ends-with (=?).
    (assert false ("A" ends-with (@).
    (assert false ("A" ends-with (@:).
  ).
  (should "(str ends-with \"\") always returns true." (= ()
    (assert ("" ends-with "").
    (assert ("A" ends-with "").
    (assert ("ABC" ends-with "").
  ).
  (should "(str ends-with suffix) return true if str ends with a suffix." (= ()
    (assert ("ABC" ends-with "C").
    (assert false ("ABC" ends-with "B").
    (assert false ("ABC" ends-with "A").

    (assert ("ABC" ends-with "BC").
    (assert false ("ABC" ends-with "BB").
    (assert false ("ABC" ends-with "CC").

    (assert ("ABC" ends-with "ABC").
    (assert false ("ABC" ends-with "ABCD").
    (assert false ("ABC" ends-with "DABC").
  ).
  (should "(str ends-with suffix1 suffix2 ...) return true if str ends with any given suffix." (= ()
    (assert ("ABC" ends-with "C", "B").
    (assert ("ABC" ends-with "B", "C").
    (assert ("ABC" ends-with "B", "C", "A").

    (assert ("ABC" ends-with "BC", "BA").
    (assert ("ABC" ends-with "BA", "BC").
    (assert ("ABC" ends-with "AA", "BC", "AB").

    (assert false ("ABC" ends-with "CC", "AB").
    (assert false ("ABC" ends-with "AB", "CC").
    (assert false ("ABC" ends-with "AB", "CC", "BD").

    (assert ("ABC" ends-with "ABC", "BCD").
    (assert ("ABC" ends-with "BCD", "ABC").
    (assert ("ABC" ends-with "BCD", "ABC", "AB").

    (assert false ("ABC" ends-with "ABD", "B").
    (assert false ("ABC" ends-with "ABD", "B", "A").

    (assert false ("ABC" ends-with "ABCD").
    (assert false ("ABC" ends-with "ABCD", "B", "A").

    (assert false ("ABC" ends-with "B", "A").
    (assert false ("ABC" ends-with "A", "B").
    (assert false ("ABC" ends-with "A", "B", "D").
  ).
).

(define "(a-string copy ...)" (= ()
  (should "(str copy) always returns itself." (= ()
    (assert "" ("" copy).
    (assert "A" ("A" copy).
    (assert "ABC" ("ABC" copy).
  ).
  (should "(str copy 0) always returns itself." (= ()
    (assert "" ("" copy 0).
    (assert "A" ("A" copy 0).
    (assert "ABC" ("ABC" copy 0).
  ).
  (should "(\"\" copy ...) always returns the empty string." (= ()
    (assert "" ("" copy).
    (assert "" ("" copy 0).
    (assert "" ("" copy -1).
    (assert "" ("" copy -1 0).
    (assert "" ("" copy -1 1).
    (assert "" ("" copy 0).
    (assert "" ("" copy 0 0).
    (assert "" ("" copy 0 1).
    (assert "" ("" copy 1).
    (assert "" ("" copy 1 0).
    (assert "" ("" copy 1 1).
  ).
  (should "(str copy begin) returns the sub-string from the offset value of 'begin'." (= ()
    (assert "ABC" ("ABC" copy 0).
    (assert "BC" ("ABC" copy 1).
    (assert "C" ("ABC" copy 2).
    (assert "" ("ABC" copy 3).
    (assert "C" ("ABC" copy -1).
    (assert "BC" ("ABC" copy -2).
    (assert "ABC" ("ABC" copy -3).
    (assert "ABC" ("ABC" copy -4).
  ).
  (should "(str copy begin end) returns the sub-string from the begin offset to end offset." (= ()
    (assert "" ("ABC" copy 0 0).
    (assert "A" ("ABC" copy 0 1).
    (assert "AB" ("ABC" copy 0 2).
    (assert "ABC" ("ABC" copy 0 10).

    (assert "C" ("ABC" copy 0 -1).
    (assert "BC" ("ABC" copy 0 -2).
    (assert "ABC" ("ABC" copy 0 -3).
    (assert "ABC" ("ABC" copy 0 -10).

    (assert "B" ("ABC" copy 1 1).
    (assert "BC" ("ABC" copy 1 2).
    (assert "BC" ("ABC" copy 1 10).

    (assert "" ("ABC" copy -1 0).
    (assert "C" ("ABC" copy -1 1).
    (assert "C" ("ABC" copy -1 2).
    (assert "C" ("ABC" copy -1 10).

    (assert "B" ("ABC" copy -1 -1).
    (assert "AB" ("ABC" copy -1 -2).
    (assert "AB" ("ABC" copy -1 -10).
  ).
).

(define "(a-string slice ...)" (= ()
  (should "(str slice) always returns itself." (= ()
    (assert "" ("" slice).
    (assert "A" ("A" slice).
    (assert "ABC" ("ABC" slice).
  ).
  (should "(str slice 0) always returns itself." (= ()
    (assert "" ("" slice 0).
    (assert "A" ("A" slice 0).
    (assert "ABC" ("ABC" slice 0).
  ).
  (should "(\"\" slice ...) always returns the empty string." (= ()
    (assert "" ("" slice).
    (assert "" ("" slice 0).
    (assert "" ("" slice -1).
    (assert "" ("" slice -1 0).
    (assert "" ("" slice -1 1).
    (assert "" ("" slice 0).
    (assert "" ("" slice 0 0).
    (assert "" ("" slice 0 1).
    (assert "" ("" slice 1).
    (assert "" ("" slice 1 0).
    (assert "" ("" slice 1 1).
  ).
  (should "(str slice begin) returns the sub-string from the offset value of 'begin'." (= ()
    (assert "ABC" ("ABC" slice 0).
    (assert "BC" ("ABC" slice 1).
    (assert "C" ("ABC" slice 2).
    (assert "" ("ABC" slice 3).
    (assert "C" ("ABC" slice -1).
    (assert "BC" ("ABC" slice -2).
    (assert "ABC" ("ABC" slice -3).
    (assert "ABC" ("ABC" slice -4).
  ).
  (should "(str slice begin end) returns the sub-string from the begin offset to before the end offset." (= ()
    (assert "" ("ABC" slice 0 0).
    (assert "A" ("ABC" slice 0 1).
    (assert "AB" ("ABC" slice 0 2).
    (assert "ABC" ("ABC" slice 0 10).
    (assert "AB" ("ABC" slice 0 -1).
    (assert "A" ("ABC" slice 0 -2).
    (assert "" ("ABC" slice 0 -10).

    (assert "" ("ABC" slice 1 1).
    (assert "B" ("ABC" slice 1 2).
    (assert "BC" ("ABC" slice 1 10).
    (assert "" ("ABC" slice 1 0).
    (assert "B" ("ABC" slice 1 -1).
    (assert "" ("ABC" slice 1 -2).
    (assert "" ("ABC" slice 1 -10).

    (assert "" ("ABC" slice -1 0).
    (assert "" ("ABC" slice -1 -1).
    (assert "" ("ABC" slice -1 1).
    (assert "" ("ABC" slice -1 2).
    (assert "C" ("ABC" slice -1 3).

    (assert "B" ("ABC" slice -2 2).
    (assert "BC" ("ABC" slice -2 3).
  ).
).

(define "(a-string trim)" (= ()
  (should "remove leading and trailing space characters." (= ()
    (assert "" ("" trim).
    (assert "" (" " trim).
    (assert "A" (" \r\n\tA\r\n\t " trim).
  ).
).

(define "(a-string trim-left)" (= ()
  (should "remove leading space characters." (= ()
    (assert "" ("" trim-left).
    (assert "" (" " trim-left).
    (assert "A\r\n\t " (" \r\n\tA\r\n\t " trim-left).
  ).
).

(define "(a-string trim-right)" (= ()
  (should "remove trailing space characters." (= ()
    (assert "" ("" trim-right).
    (assert "" (" " trim-right).
    (assert " \r\n\tA" (" \r\n\tA\r\n\t " trim-right).
  ).
).

(define "(a-string replace ...)" (= ()
  (should "(\"\" replace) always returns the empty string." (= ()
    (assert "" ("" replace).
    (assert "" ("" replace "").
    (assert "" ("" replace "" "A").
    (assert "" ("" replace "A").
    (assert "" ("" replace "A" "BC").
  ).
  (should "(str replace) returns the original string" (= ()
    (assert "A" ("A" replace).
    (assert "AB" ("AB" replace).
    (assert "ABC" ("ABC" replace).
  ).
  (should "(str replace value) removes the occurrences of value" (= ()
    (assert "" ("A" replace "A").
    (assert "A" ("A" replace "B").

    (assert "B" ("AB" replace "A").
    (assert "A" ("AB" replace "B").

    (assert "BC" ("ABC" replace "A").
    (assert "AC" ("ABC" replace "B").
    (assert "AB" ("ABC" replace "C").

    (assert "C" ("ABC" replace "AB").
    (assert "A" ("ABC" replace "BC").

    (assert "BCBC" ("ABCABC" replace "A").
    (assert "ACAC" ("ABCABC" replace "B").
    (assert "ABAB" ("ABCABC" replace "C").

    (assert "CC" ("ABCABC" replace "AB").
    (assert "AA" ("ABCABC" replace "BC").
    (assert "ABBC" ("ABCABC" replace "CA").
  ).
  (should "(str replace value new-value) replace the occurrences of value with new-value" (= ()
    (assert "DBC" ("ABC" replace "A" "D").
    (assert "ADC" ("ABC" replace "B" "D").
    (assert "ABD" ("ABC" replace "C" "D").

    (assert "DBCDBC" ("ABCABC" replace "A" "D").
    (assert "ADCADC" ("ABCABC" replace "B" "D").
    (assert "ABDABD" ("ABCABC" replace "C" "D").

    (assert "DECDEC" ("ABCABC" replace "AB" "DE").
    (assert "ADEADE" ("ABCABC" replace "BC" "DE").
    (assert "ABDEBC" ("ABCABC" replace "CA" "DE").
  ).
).

(define "(a-string to-upper ...)" (= ()
  (should "(str to-upper) converts characters in a string to upper-case." (= ()
    (assert "" ("" to-upper).
    (assert " " (" " to-upper).

    (assert "A" ("a" to-upper).
    (assert "ABC" ("abc" to-upper).
    (assert "A" ("A" to-upper).
    (assert "ABC" ("ABC" to-upper).

    (assert "Ä" ("ä" to-upper).
    (assert "SS" ("ß" to-upper).
    (assert "GESÄSS" ("Gesäß" to-upper).
    (assert "Ä" ("Ä" to-upper).
    (assert "GESÄSS" ("GESÄSS" to-upper).
  ).
  (should "(str to-upper true) converts characters in a string to upper-case with locale concern." (= ()
    (assert "" ("" to-upper true).
    (assert " " (" " to-upper true).

    (assert "A" ("a" to-upper true).
    (assert "ABC" ("abc" to-upper true).
    (assert "A" ("A" to-upper true).
    (assert "ABC" ("ABC" to-upper true).

    (assert "Ä" ("ä" to-upper true).
    (assert "SS" ("ß" to-upper true).
    (assert "GESÄSS" ("gesäß" to-upper true).
    (assert "Ä" ("Ä" to-upper).
    (assert "GESÄSS" ("GESÄSS" to-upper) true.
  ).
).

(define "(a-string to-lower ...)" (= ()
  (should "convert characters in a string to lower-case." (= ()
    (assert "" ("" to-lower).
    (assert " " (" " to-lower).

    (assert "a" ("a" to-lower).
    (assert "abc" ("abc" to-lower).
    (assert "a" ("A" to-lower).
    (assert "abc" ("ABC" to-lower).

    (assert "ä" ("Ä" to-lower).
    (assert "gesäss" ("GESÄSS" to-lower).
    (assert "ä" ("ä" to-lower).
    (assert "gesäß" ("gesäß" to-lower).
  ).
  (should "(str to-lower true) converts characters in a string to upper-case with locale concern." (= ()
    (assert "" ("" to-lower true).
    (assert " " (" " to-lower true).

    (assert "a" ("a" to-lower true).
    (assert "abc" ("abc" to-lower true).
    (assert "a" ("A" to-lower true).
    (assert "abc" ("ABC" to-lower true).

    (assert "ä" ("Ä" to-lower true).
    (assert "gesäss" ("GESÄSS" to-lower true).
    (assert "ä" ("ä" to-lower true).
    (assert "gesäß" ("gesäß" to-lower true).
  ).
).

(define "(a-string concat ...)" (=> ()
  (should "(str concat) returns the original str" (= ()
    (assert "" ("" concat).
    (assert "A" ("A" concat).
    (assert "ABC" ("ABC" concat).
  ).
  (should "(str concat s ...) concatenates one or more strings to this string" (= ()
    (assert "" ("" concat "").
    (assert "" ("" concat "" "").
    (assert "A" ("" concat "A").
    (assert "A" ("" concat "A" "").
    (assert "AB" ("" concat "A" "B").
    (assert "AB" ("" concat "A" "B" "").

    (assert "X" ("X" concat "").
    (assert "X" ("X" concat "" "").
    (assert "XA" ("X" concat "A").
    (assert "XA" ("X" concat "A" "").
    (assert "XAB" ("X" concat "A" "B").
    (assert "XAB" ("X" concat "A" "B" "").
  ).
  (should "(str concat v ...) converts non-string value to strings for concatenation." (=> ()
    (assert "null" ("" concat null).
    (assert "type" ("" concat type).
    (assert "string" ("" concat string).

    (for t in other-types
      (assert ((t the-type) to-string) ("" concat (t the-type).
      (for v in (t values)
        (assert ($v to-string) ("" concat v).
      ).
    ).
  ).
  (should "(str +) is the same of (str concat)." (= ()
    (assert ($("" "+") is ("" "concat").
    (assert ($("" "concat") is ("" "+").

    (assert ($("" "+") equals ("s" "concat").
    (assert ($("s" "concat") equals ("" "+").
  ).
).


(define "(a-string - ...)" (=> ()
  (should "(str -) returns the original str." (= ()
    (assert "" ("" -).
    (assert "A" ("A" -).
    (assert "ABC" ("ABC" -).
  ).
  (should "(str - suffix ...) removes one or more strings from str." (= ()
    (assert "" ("" - "").
    (assert "" ("" - "" "").
    (assert "" ("" - "A").
    (assert "" ("" - "A" "").

    (assert "" ("A" - "A").
    (assert "A" ("AA" - "A" "").
    (assert "A" ("AA" - "" "A" "").
    (assert "AB" ("ABAB" - "A" "B").
    (assert "AB" ("ABAB" - "A" "B" "").
    (assert "AB" ("ABAB" - "A" "" "B").
    (assert "AB" ("ABAB" -  "" "A" "B").

    (assert "AB" ("ABAB" - "A" "B" "X").
    (assert "AB" ("ABAB" - "A" "X" "B").
    (assert "AB" ("ABAB" -  "X" "A" "B").
  ).
  (should "(str - value ...) converts non-string value to strings before removing." (=> ()
    (assert "X-" ("X-null" - null).
    (assert "X-" ("X-type" - type).
    (assert "X-" ("X-string" - string).

    (for t in other-types
      (assert "" (((t the-type) to-string) - (t the-type).
      (if ((t the-type) is-not number) (for v in (t values)
        (assert "" (($v to-string) - v).
      ).
    ).
  ).
  (should "(str - count ...) removes zero or more characters from the end." (= ()
    (assert "" ("" - 0).
    (assert "A" ("A" - 0).
    (assert "A" ("A" - -0).

    (assert "" ("" - 1).
    (assert "" ("" - 2).
    (assert "" ("A" - 1).
    (assert "" ("A" - 2).
    (assert "A" ("AA" - 1).
    (assert "" ("AA" - 2).
    (assert "AB" ("ABC" - 1).
    (assert "A" ("ABC" - 2).
    (assert "" ("ABC" - 3).

    (assert "" ("" - 1).
    (assert "" ("" - 2).
    (assert "" ("A" - 1).
    (assert "" ("A" - 2).
    (assert "A" ("AA" - 1).
    (assert "" ("AA" - 2).
    (assert "AB" ("ABC" - 1).
    (assert "A" ("ABC" - 2).
    (assert "" ("ABC" - 3).

    (assert "" ("" - 1).
    (assert "" ("" - 1 2).
    (assert "" ("A" - 1).
    (assert "" ("A" - 1 2).
    (assert "A" ("AA" - 1).
    (assert "" ("AA" - 1 2).
    (assert "AB" ("ABC" - 1).
    (assert "" ("ABC" - 1 2).
    (assert "X" ("XABCABC" - 1 2 3).
  ).
  (should "(str - suffix_value_or_count ...) suffix, value and count can be used at the same time." (= ()
    (assert "X" ("XABCABC" - 3 2 "C").
    (assert "X" ("XABCABC" - 3 2 "C" "X").

    (assert "X" ("XABCABC" - 2 "C" 3).
    (assert "X" ("XABCABC" - 2 "C" 3 "X").
    (assert "X" ("XABCABC" - 2 "X" "C" 3).

    (assert "X" ("XABCABC" - "AB" "C" 3).
    (assert "X" ("XABCABC" - "AB" "C" 3 "X").
    (assert "X" ("XABCABC" - "AB" "X" "C" 3).

    (assert "" ("XABCABC" -  "X" "AB" "C" 3).

    (assert "" ("XnullCABC" -  "X" null "AB" "C" 3).
    (assert "" ("XtrueCABC" -  "X" true "AB" "C" 3).
  ).
).

(define "(a-string split)" (= ()
  (should "(str split) returns an array with separated by an ASCII whitespace" (= ()
    (assert (("" split) is-an array).
    (assert ((("" split) length) is 1).
    (assert ((("" split) 0) is "").

    (assert ((" " split) is-an array).
    (assert (((" " split) length) is 2).
    (assert (((" " split) 0) is "").
    (assert (((" " split) 1) is "").

    (assert (("ABC" split) is-an array).
    (assert ((("ABC" split) length) is 1).
    (assert ((("ABC" split) 0) is "ABC").

    (assert (("A B C" split) is-an array).
    (assert ((("A B C" split) length) is 3).
    (assert ((("A B C" split) 0) is "A").
    (assert ((("A B C" split) 1) is "B").
    (assert ((("A B C" split) 2) is "C").
  ).
  (should "(str split \"\") returns an array with all chars in the original string" (= ()
    (assert (("" split "") is-an array).
    (assert ((("" split "") length) is 0).

    (assert ((" " split "") is-an array).
    (assert (((" " split "") length) is 1).
    (assert (((" " split "") 0) is " ").

    (assert (("ABC" split "") is-an array).
    (assert ((("ABC" split "") length) is 3).
    (assert ((("ABC" split "") 0) is "A").
    (assert ((("ABC" split "") 1) is "B").
    (assert ((("ABC" split "") 2) is "C").

    (assert (("A B" split "") is-an array).
    (assert ((("A B" split "") length) is 3).
    (assert ((("A B" split "") 0) is "A").
    (assert ((("A B" split "") 1) is " ").
    (assert ((("A B" split "") 2) is "B").
  ).
  (should "(str split separator) returns an array split by the separator." (= ()
    (assert (("" split "A") is-an array).
    (assert ((("" split "A") length) is 1).
    (assert ((("" split "A") 0) is "").

    (assert (("ABC" split "A") is-an array).
    (assert ((("ABC" split "A") length) is 2).
    (assert ((("ABC" split "A") 0) is "").
    (assert ((("ABC" split "A") 1) is "BC").

    (assert (("ABC" split "B") is-an array).
    (assert ((("ABC" split "B") length) is 2).
    (assert ((("ABC" split "B") 0) is "A").
    (assert ((("ABC" split "B") 1) is "C").

    (assert (("ABBC" split "B") is-an array).
    (assert ((("ABBC" split "B") length) is 3).
    (assert ((("ABBC" split "B") 0) is "A").
    (assert ((("ABBC" split "B") 1) is "").
    (assert ((("ABBC" split "B") 2) is "C").

    (assert (("ABC" split "C") is-an array).
    (assert ((("ABC" split "C") length) is 2).
    (assert ((("ABC" split "C") 0) is "AB").
    (assert ((("ABC" split "C") 1) is "").
  ).
  (should "(str split non-str) returns an array with the original string." (= ()
    (assert (("" split null) is-an array).
    (assert ((("" split null) length) is 1).
    (assert ((("" split null) 0) is "").

    (assert ((" " split null) is-an array).
    (assert (((" " split null) length) is 1).
    (assert (((" " split null) 0) is " ").

    (assert (("A" split null) is-an array).
    (assert ((("A" split null) length) is 1).
    (assert ((("A" split null) 0) is "A").

    (assert (("" split true) is-an array).
    (assert ((("" split false) length) is 1).
    (assert ((("" split 1) 0) is "").

    (assert ((" " split -1) is-an array).
    (assert (((" " split type) length) is 1).
    (assert (((" " split (range empty)) 0) is " ").

    (assert (("A" split (lambda empty)) is-an array).
    (assert ((("A" split (array empty)) length) is 1).
    (assert ((("A" split (object empty)) 0) is "A").
  ).
).

(define "(a-string as-chars)" (= ()
  (should "((string empty) as-chars) returns an empty array." (= ()
    (var chars ((string empty) as-chars).
    (assert (chars is-an array).
    (assert 0 (chars length).
  ).
  (should "(str as-chars) returns an array of characters." (= ()
    (var chars ("a" as-chars).
    (assert (chars is-an array).
    (assert 1 (chars length).
    (assert "a" (chars 0).

    (let chars ("aB" as-chars).
    (assert (chars is-an array).
    (assert 2 (chars length).
    (assert "a" (chars 0).
    (assert "B" (chars 1).

    (let chars ("aBc" as-chars).
    (assert (chars is-an array).
    (assert 3 (chars length).
    (assert "a" (chars 0).
    (assert "B" (chars 1).
    (assert "c" (chars 2).
  ).
  (should "(a-unicode-str as-chars) returns an array of unicode characters." (= ()
    (var chars ("𝟘𝟙𝟚𝟛" as-chars).
    (assert (chars is-an array).
    (assert 4 (chars length).
    (assert "𝟘" (chars 0).
    (assert "𝟙" (chars 1).
    (assert "𝟚" (chars 2).
    (assert "𝟛" (chars 3).
  ).
).

(define "(a-string char-at)" (= ()
  (should "(\"\" char-at ...) always returns null" (= ()
    (assert null ("" char-at).
    (assert null ("" char-at 0).
    (assert null ("" char-at -1).
    (assert null ("" char-at 1).
  ).
  (should "(str char-at offset) returns the UTF-16 value of the char at the offset or null" (= ()
    (assert 65 ("ABC" char-at).
    (assert 65 ("ABC" char-at 0).
    (assert 66 ("ABC" char-at 1).
    (assert 67 ("ABC" char-at 2).
    (assert null ("ABC" char-at 3).

    (assert 0x221A ("\u221a" char-at 0).
    (assert 0x221A ("X\u221a" char-at 1).
    (assert 0x221A ("X\u221aX" char-at 1).
  ).
  (should "(str chart-at offset) with a negative offset value returns the value at (offset + (str length))." (= ()
    (assert 67 ("ABC" char-at -1).
    (assert 66 ("ABC" char-at -2).
    (assert 65 ("ABC" char-at -3).
    (assert null ("ABC" char-at -4).
  ).
).

(define "(a-string compares-to)" (=> ()
  (should "(str compares-to) always returns null." (= ()
    (assert null ("" compares-to).
    (assert null ("A" compares-to).
    (assert null ("ABC" compares-to).
  ).
  (should "(str compares-to non-string) always returns null." (=> ()
    (assert null ("" compares-to null).
    (assert null ("" compares-to type).
    (assert null ("" compares-to string).
    (for a-type in other-types
      (assert null ("" compares-to (a-type the-type).
      (assert null ("" compares-to (a-type empty).
      (for a-value in (a-type values)
        (assert null ("" compares-to a-value).
      ).
    ).
  ).
  (should "(str compares-to s) compares str and s by their UTF-16 values." (= ()
    (assert 0 ("" compares-to "").
    (assert 0 ("A" compares-to "A").
    (assert 0 ("ABC" compares-to "ABC").

    (assert 1 ("a" compares-to "A").
    (assert 1 ("B" compares-to "A").
    (assert 1 ("BA" compares-to "AA").
    (assert 1 ("AB" compares-to "AA").

    (assert -1 ("A" compares-to "a").
    (assert -1 ("A" compares-to "B").
    (assert -1 ("AA" compares-to "BA").
    (assert -1 ("AA" compares-to "AB").
  ).
).

(define "(a-string > ...)" (=> ()
  (should "(str >) always returns null." (= ()
    (assert null ("" >).
    (assert null ("A" >).
    (assert null ("ABC" >).
  ).
  (should "(str > non-string) always returns null." (=> ()
    (assert null ("" > null).
    (assert null ("" > type).
    (assert null ("" > string).
    (for a-type in other-types
      (assert null ("" > (a-type the-type).
      (assert null ("" > (a-type empty).
      (for a-value in (a-type values)
        (assert null ("" > a-value).
      ).
    ).
  ).
  (should "(str > s) returns true when str is greater s." (= ()
    (assert false ("" > "").
    (assert false ("A" > "A").

    (assert ("a" > "A").
    (assert ("Aa" > "AA").
    (assert ("B" > "A").
    (assert ("AB" > "AA").

    (assert false ("A" > "a").
    (assert false ("A" > "B").
    (assert false ("AA" > "BA").
    (assert false ("AA" > "AB").
  ).
).

(define "(a-string >= ...)" (=> ()
  (should "(str >=) always returns null." (= ()
    (assert null ("" >=).
    (assert null ("A" >=).
    (assert null ("ABC" >=).
  ).
  (should "(str >= non-string) always returns null." (=> ()
    (assert null ("" >= null).
    (assert null ("" >= type).
    (assert null ("" >= string).
    (for a-type in other-types
      (assert null ("" >= (a-type the-type).
      (assert null ("" >= (a-type empty).
      (for a-value in (a-type values)
        (assert null ("" >= a-value).
      ).
    ).
  ).
  (should "(str >= s) returns true when str is greater than or equals with s." (= ()
    (assert ("" >= "").
    (assert ("A" >= "A").

    (assert ("a" >= "A").
    (assert ("Aa" >= "AA").
    (assert ("B" >= "A").
    (assert ("AB" >= "AA").

    (assert false ("A" >= "a").
    (assert false ("A" >= "B").
    (assert false ("AA" >= "BA").
    (assert false ("AA" >= "AB").
  ).
).

(define "(a-string < ...)" (=> ()
  (should "(str <) always returns null." (= ()
    (assert null ("" <).
    (assert null ("A" <).
    (assert null ("ABC" <).
  ).
  (should "(str < non-string) always returns null." (=> ()
    (assert null ("" < null).
    (assert null ("" < type).
    (assert null ("" < string).
    (for a-type in other-types
      (assert null ("" < (a-type the-type).
      (assert null ("" < (a-type empty).
      (for a-value in (a-type values)
        (assert null ("" < a-value).
      ).
    ).
  ).
  (should "(str < s) returns true when str is less than s." (= ()
    (assert false ("" < "").
    (assert false ("A" < "A").

    (assert false ("a" < "A").
    (assert false ("Aa" < "AA").
    (assert false ("B" < "A").
    (assert false ("AB" < "AA").

    (assert ("A" < "a").
    (assert ("A" < "B").
    (assert ("AA" < "BA").
    (assert ("AA" < "AB").
  ).
).

(define "(a-string <= ...)" (=> ()
  (should "(str <=) always returns null." (= ()
    (assert null ("" <=).
    (assert null ("A" <=).
    (assert null ("ABC" <=).
  ).
  (should "(str <= non-string) always returns null." (=> ()
    (assert null ("" <= null).
    (assert null ("" <= type).
    (assert null ("" <= string).
    (for a-type in other-types
      (assert null ("" <= (a-type the-type).
      (assert null ("" <= (a-type empty).
      (for a-value in (a-type values)
        (assert null ("" <= a-value).
      ).
    ).
  ).
  (should "(str <= s) returns true when str is less than or equals with s." (= ()
    (assert ("" <= "").
    (assert ("A" <= "A").

    (assert false ("a" <= "A").
    (assert false ("Aa" <= "AA").
    (assert false ("B" <= "A").
    (assert false ("AB" <= "AA").

    (assert ("A" <= "a").
    (assert ("A" <= "B").
    (assert ("AA" <= "BA").
    (assert ("AA" <= "AB").
  ).
).

(define "(a-string to-string)" (=> ()
  (should "(str to-string) returns the string's representation in source code." (= ()
    (assert "\"\"" ("" to-string).
    (assert "\"A\"" ("A" to-string).
    (assert "\"ABC\"" ("ABC" to-string).
    (assert "\"\\t\\r\\n\"" ("\t\r\n" to-string).
  ).
).

(define "(a-string : ...)" (= ()
  (should "(str: offset) returns the character at the offset or an empty string." (= ()
    (assert "" ("": 0).
    (assert "" ("": 1).
    (assert "" ("": -1).
    (assert "A" ("ABC": 0).
    (assert "B" ("ABC": 1).
    (assert "C" ("ABC": 2).
    (assert "" ("ABC": 3).
    (assert "C" ("ABC": -1).
    (assert "B" ("ABC": -2).
    (assert "A" ("ABC": -3).
    (assert "" ("ABC": -4).
  ).
  (should "(str offset) works like (str: offset)." (= ()
    (assert "" ("" 0).
    (assert "" ("" 1).
    (assert "" ("" -1).
    (assert "A" ("ABC" 0).
    (assert "B" ("ABC" 1).
    (assert "C" ("ABC" 2).
    (assert "" ("ABC" 3).
    (assert "C" ("ABC" -1).
    (assert "B" ("ABC" -2).
    (assert "A" ("ABC" -3).
    (assert "" ("ABC" -4).
  ).
  (should "(str: begin end) works like (str slice begin end)." (= ()
    (assert "" ("ABC": 0 0).
    (assert "A" ("ABC": 0 1).
    (assert "AB" ("ABC": 0 2).
    (assert "ABC" ("ABC": 0 10).
    (assert "AB" ("ABC": 0 -1).
    (assert "A" ("ABC": 0 -2).
    (assert "" ("ABC": 0 -10).

    (assert "" ("ABC": 1 1).
    (assert "B" ("ABC": 1 2).
    (assert "BC" ("ABC": 1 10).
    (assert "" ("ABC": 1 0).
    (assert "B" ("ABC": 1 -1).
    (assert "" ("ABC": 1 -2).
    (assert "" ("ABC": 1 -10).

    (assert "" ("ABC": -1 0).
    (assert "" ("ABC": -1 -1).
    (assert "" ("ABC": -1 1).
    (assert "" ("ABC": -1 2).
    (assert "C" ("ABC": -1 3).

    (assert "B" ("ABC": -2 2).
    (assert "BC" ("ABC": -2 3).
  ).
  (should "(str begin end) works like (str: begin end)." (= ()
    (assert "" ("ABC" 0 0).
    (assert "A" ("ABC" 0 1).
    (assert "AB" ("ABC" 0 2).
    (assert "ABC" ("ABC" 0 10).
    (assert "AB" ("ABC" 0 -1).
    (assert "A" ("ABC" 0 -2).
    (assert "" ("ABC" 0 -10).

    (assert "" ("ABC" 1 1).
    (assert "B" ("ABC" 1 2).
    (assert "BC" ("ABC" 1 10).
    (assert "" ("ABC" 1 0).
    (assert "B" ("ABC" 1 -1).
    (assert "" ("ABC" 1 -2).
    (assert "" ("ABC" 1 -10).

    (assert "" ("ABC" -1 0).
    (assert "" ("ABC" -1 -1).
    (assert "" ("ABC" -1 1).
    (assert "" ("ABC" -1 2).
    (assert "C" ("ABC" -1 3).

    (assert "B" ("ABC" -2 2).
    (assert "BC" ("ABC" -2 3).
  ).
).
