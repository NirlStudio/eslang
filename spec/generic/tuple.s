(var * (load "share/type" (@ the-type: tuple).

(define "Tuple Common Behaviours" (=> ()
  (define "Identity" (=> ()
    (should "a tuple is identified by its instance." (= ()
      (assert ((` (x y)) is-not (` (x y).
      (assert false ((` (x y)) is (` (x y).

      (assert ((tuple of null) is-not (tuple of null).
      (assert false ((tuple of null) is (tuple of null).

      (assert ((tuple of-plain null) is-not (tuple of-plain null).
      (assert false ((tuple of-plain null) is (tuple of-plain null).
    ).
    (should "an empty tuple is always identical with (tuple empty)." (= ()
      (assert ((tuple of) is (tuple empty).
      (assert false ((tuple of) is-not (tuple empty).

      (assert ((tuple empty) is (tuple of).
      (assert false ((tuple empty) is-not (tuple of).
    ).
    (should "a blank plain tuple is always identical with (tuple blank)." (= ()
      (assert ((tuple of-plain) is (tuple blank).
      (assert false ((tuple of-plain) is-not (tuple blank).

      (assert ((tuple blank) is (tuple of-plain).
      (assert false ((tuple blank) is-not (tuple of-plain).
    ).
    (should "(tuple empty) is not (tuple blank)." (= ()
      (assert false ((tuple empty) is (tuple blank).
      (assert ((tuple empty) is-not (tuple blank).

      (assert false ((tuple blank) is (tuple empty).
      (assert ((tuple blank) is-not (tuple empty).
    ).
  ).

  (define "Equivalence" (=> ()
    (should "two tuples with equivalent items in the same order are equivalent." (= ()
      (assert ((` (x y)) equals (` (x y).
      (assert false ((` (x y)) not-equals (` (x y).

      (assert false ((` (x y)) equals (` (y x).
      (assert ((` (x y)) not-equals (` (y x).

      (assert ((tuple of null 1 true "abc" (0 1) (` x))
        equals (tuple of null 1 true "abc" (0 1) (` x))
      ).
      (assert false ((tuple of null 1 true "abc" (0 1) (` x))
        not-equals (tuple of null 1 true "abc" (0 1) (` x))
      ).

      (assert ((tuple of-plain null 1 true "abc" (0 1) (` x))
        equals (tuple of-plain null 1 true "abc" (0 1) (` x))
      ).
      (assert false ((tuple of-plain null 1 true "abc" (0 1) (` x))
        not-equals (tuple of-plain null 1 true "abc" (0 1) (` x))
      ).
    ).
    (should "a plain tuple cannot be equivalent with a non-plain tuple." (= ()
      (assert false ((tuple of null) equals (tuple of-plain null).
      (assert ((tuple of null) not-equals (tuple of-plain null).

      (assert false ((tuple of-plain null) equals (tuple of null).
      (assert ((tuple of-plain null) not-equals (tuple of null).

      (assert false ((tuple of null 1 true "abc" (0 1) (` x))
        equals (tuple of-plain null 1 true "abc" (0 1) (` x))
      ).
      (assert ((tuple of null 1 true "abc" (0 1) (` x))
        not-equals (tuple of-plain null 1 true "abc" (0 1) (` x))
      ).

      (assert false ((tuple of-plain null 1 true "abc" (0 1) (` x))
        equals (tuple of null 1 true "abc" (0 1) (` x))
      ).
      (assert ((tuple of-plain null 1 true "abc" (0 1) (` x))
        not-equals (tuple of null 1 true "abc" (0 1) (` x))
      ).
    ).
  ).

  (define "Ordering" (=> ()
    (should "comparison of two equivalent tuples returns 0." (=> ()
      (assert 0 ((tuple of null) compare (tuple of null).
      (assert 0 ((tuple of-plain null) compare (tuple of-plain null).

      (assert 0 ((tuple of null 1 true "abc" (0 1) (` x))
        compare (tuple of null 1 true "abc" (0 1) (` x))
      ).
      (assert 0 ((tuple of-plain null 1 true "abc" (0 1) (` x))
        compare (tuple of-plain null 1 true "abc" (0 1) (` x))
      ).
    ).
    (should "comparison of two non-equivalent tuples return null." (=> ()
      (assert null ((tuple empty) compare (tuple blank).
      (assert null ((tuple of null) compare (tuple of-plain null).

      (assert null ((tuple of null 1 true "abc" (0 1) (` x))
        compare (tuple of-plain null 1 true "abc" (0 1) (` x))
      ).
      (assert null ((tuple of-plain null 1 true "abc" (0 1) (` x))
        compare (tuple of null 1 true "abc" (0 1) (` x))
      ).
    ).
  ).

  (define "Emptiness" (=> ()
    (should "(tuple empty) is defined as empty." (=> ()
      (assert ((tuple empty) is-empty).
      (assert false ((tuple empty) not-empty).
    ).
    (should "(tuple blank) is defined as empty." (=> ()
      (assert ((tuple blank) is-empty).
      (assert false ((tuple blank) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "a tuple is encoded to itself." (=> ()
      (for value
          in (the-values concat (tuple empty) (tuple blank) (tuple unknown).
        (assert value (value to-code).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "(tuple empty) is represented as ()." (=> ()
      (assert "()" ((tuple empty) to-string).
      (assert "()" ((tuple empty) to-string " ").
      (assert "()" ((tuple empty) to-string "  ").
      (assert "()" ((tuple empty) to-string "   ").
      (assert "()" ((tuple empty) to-string " " " ").
      (assert "()" ((tuple empty) to-string " " "  ").
      (assert "()" ((tuple empty) to-string " " "   ").
    ).
    (should "(tuple blank) is represented as nothing." (=> ()
      (assert "" ((tuple blank) to-string).
      (assert "" ((tuple blank) to-string " ").
      (assert "" ((tuple blank) to-string "  ").
      (assert "" ((tuple blank) to-string "   ").
      (assert "" ((tuple blank) to-string " " " ").
      (assert "" ((tuple blank) to-string " " "  ").
      (assert "" ((tuple blank) to-string " " "   ").
    ).
    (should "(tuple unknown) is represented as (...)." (=> ()
      (assert "(...)" ((tuple unknown) to-string).
      (assert "(...)" ((tuple unknown) to-string " ").
      (assert "(...)" ((tuple unknown) to-string "  ").
      (assert "(...)" ((tuple unknown) to-string "   ").
      (assert "(...)" ((tuple unknown) to-string " " " ").
      (assert "(...)" ((tuple unknown) to-string " " "  ").
      (assert "(...)" ((tuple unknown) to-string " " "   ").
    ).
    (should "a common tuple is represented as an expression of its items." (=> ()
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string).
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string " ").
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string "  ").
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string "   ").
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string " " " ").
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string " " "  ").
      (assert "(null true 1 \"abc\" (1 2) x)" ((` (null true 1 "abc" (1 2) x)) to-string " " "   ").
    ).
    (should "a plain tuple is represented as a list of its items, each in a new line." (=> ()
      (assert "\nnull\ntrue\n1\n\"abc\"\n(1 2)\nx"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string)
      ).
      (assert "\nnull\ntrue\n1\n\"abc\"\n(1 2)\nx"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string " ")
      ).
      (assert "\nnull\ntrue\n1\n\"abc\"\n(1 2)\nx"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string "  ")
      ).
      (assert "\nnull\ntrue\n1\n\"abc\"\n(1 2)\nx"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string "   ")
      ).
      (assert "\n null\n true\n 1\n \"abc\"\n (1 2)\n x"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string " " " ")
      ).
      (assert "\n  null\n  true\n  1\n  \"abc\"\n  (1 2)\n  x"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string " " "  ")
      ).
      (assert "\n   null\n   true\n   1\n   \"abc\"\n   (1 2)\n   x"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string " " "   ")
      ).
    ).
    (should "a plain tuple is represented as a list of its items, each in a new line." (=> ()
      (assert "\nnull\ntrue\n1\n\"abc\"\n(1 2)\nx"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string)
      ).
      (assert "\nnull\ntrue\n1\n\"abc\"\n(1 2)\nx"
        ((tuple of-plain null true 1 "abc" (` (1 2)) (`x)) to-string " ")
      ).
    ).
    (should "in (a-tuple to-string indent), the indent is applied for nested plain tuples." (=> ()
      (assert "(null true 1 \"abc\"\n  1\n  2\n)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string)
      ).
      (assert "(null true 1 \"abc\"\n  1\n  2\n x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string)
      ).
      (assert "(null true 1 \"abc\"\n 1\n 2\n)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string " ")
      ).
      (assert "(null true 1 \"abc\"\n 1\n 2\n x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string " ")
      ).
      (assert "(null true 1 \"abc\"\n  1\n  2\n)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string "  ")
      ).
      (assert "(null true 1 \"abc\"\n  1\n  2\n x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string "  ")
      ).
      (assert "(null true 1 \"abc\"\n   1\n   2\n)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string "   ")
      ).
      (assert "(null true 1 \"abc\"\n   1\n   2\n x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string "   ")
      ).
    ).
    (should "in (a-tuple to-string indent padding), the padding is applied for plain tuple items." (=> ()
      (assert "(null true 1 \"abc\"\n   1\n   2\n )"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string * " ")
      ).
      (assert "(null true 1 \"abc\"\n   1\n   2\n  x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string * " ")
      ).
      (assert "(null true 1 \"abc\"\n    1\n    2\n  )"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string * "  ")
      ).
      (assert "(null true 1 \"abc\"\n    1\n    2\n   x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string * "  ")
      ).
      (assert "(null true 1 \"abc\"\n     1\n     2\n   )"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2)) to-string * "   ")
      ).
      (assert "(null true 1 \"abc\"\n     1\n     2\n    x)"
        ((tuple of null true 1 "abc" (tuple of-plain 1 2) (`x)) to-string * "   ")
      ).
    ).
  ).
).

(define "Constant and Special Values" (= ()
  (define "(tuple empty)" (= ()
    (should "(tuple empty) has not item." (= ()
      (assert 0 ((tuple empty) length).
    ).
    (should "(tuple empty) is not a plain tuple." (= ()
      (assert false ((tuple empty) is-plain).
      (assert ((tuple empty) not-plain).
    ).
    (should "(tuple empty) is evaluated to null." (= ()
      (assert null ((tuple empty)).
    ).
  ).
  (define "(tuple blank)" (= ()
    (should "(tuple blank) has not item." (= ()
      (assert 0 ((tuple blank) length).
    ).
    (should "(tuple blank) is a plain tuple." (= ()
      (assert ((tuple blank) is-plain).
      (assert false ((tuple blank) not-plain).
    ).
    (should "(tuple blank) is evaluated to null." (= ()
      (assert null ((tuple blank)).
    ).
  ).
  (define "(tuple unknown)" (= ()
    (should "(tuple unknown) is not an empty tuple." (= ()
      (assert false ((tuple unknown) is-empty).
      (assert ((tuple unknown) not-empty).
    ).
    (should "(tuple unknown) is not a plain tuple." (= ()
      (assert false ((tuple unknown) is-plain).
      (assert ((tuple unknown) not-plain).
    ).
    (should "(tuple unknown)'s only item is (symbol etc)." (= ()
      (assert 1 ((tuple unknown) length).
      (assert (symbol etc) ((tuple unknown) 0).
    ).
    (should "(tuple unknown) is evaluated to null." (= ()
      (assert null ((tuple unknown)).
    ).
  ).
  (define "(tuple lambda)" (= ()
    (should "(tuple lambda) is a piece of code to generate an empty lambda." (= ()
      (assert 3 ((tuple lambda) length).
      (assert (symbol lambda) ((tuple lambda) 0).
      (assert (tuple empty) ((tuple lambda) 1).
      (assert (tuple blank) ((tuple lambda) 2).
      (assert ($((tuple lambda)) is-a lambda).
      (assert false ($((tuple lambda)) is-static).
    ).
  ).
  (define "(tuple stambda)" (= ()
    (should "(tuple stambda) is a piece of code to generate an empty static lambda." (= ()
      (assert 3 ((tuple stambda) length).
      (assert (symbol stambda) ((tuple stambda) 0).
      (assert (tuple empty) ((tuple stambda) 1).
      (assert (tuple blank) ((tuple stambda) 2).
      (assert ($((tuple stambda)) is-a lambda).
      (assert ($((tuple stambda)) is-static).
    ).
  ).
  (define "(tuple function)" (= ()
    (should "(tuple function) is a piece of code to generate an empty function." (= ()
      (assert 3 ((tuple function) length).
      (assert (symbol function) ((tuple function) 0).
      (assert (tuple empty) ((tuple function) 1).
      (assert (tuple blank) ((tuple function) 2).
      (assert ($((tuple function)) is-a function).
    ).
  ).
  (define "(tuple operator)" (= ()
    (should "(tuple operator) is a piece of code to generate an empty operator." (= ()
      (assert 3 ((tuple operator) length).
      (assert (symbol operator) ((tuple operator) 0).
      (assert (tuple empty) ((tuple operator) 1).
      (assert (tuple blank) ((tuple operator) 2).
      (assert ($((tuple operator)) is-an operator).
    ).
  ).
  (define "(tuple array)" (= ()
    (should "(tuple array) is a piece of code to generate an empty array." (= ()
      (assert 1 ((tuple array) length).
      (assert (symbol literal) ((tuple array) 0).
      (assert (((tuple array)) is-an array).
    ).
  ).
  (define "(tuple object)" (= ()
    (should "(tuple object) is a piece of code to generate an empty object." (= ()
      (assert 2 ((tuple object) length).
      (assert (symbol literal) ((tuple object) 0).
      (assert (symbol pairing) ((tuple object) 1).
      (assert (((tuple object)) is-an object).
    ).
  ).
  (define "(tuple class)" (= ()
    (should "(tuple class) is a piece of code to generate an empty class." (= ()
      (assert 3 ((tuple class) length).
      (assert (symbol literal) ((tuple class) 0).
      (assert (symbol pairing) ((tuple class) 1).
      (assert (symbol of "class") ((tuple class) 2).
      (assert (((tuple class)) is-a type).
      (assert (((tuple class)) is-a class).
    ).
  ).
).

(define "(tuple accepts ...)" (= ()
  (should "(tuple accepts) returns true." (= ()
    (assert (tuple accepts).
  ).
  (should "(tuple accepts null) returns true." (= ()
    (assert (tuple accepts null).
  ).
  (should "(tuple accepts a-bool) returns true." (= ()
    (assert (tuple accepts true).
    (assert (tuple accepts false).
  ).
  (should "(tuple accepts a-string) returns true." (= ()
    (assert (tuple accepts "").
    (assert (tuple accepts " ").
    (assert (tuple accepts "x").
  ).
  (should "(tuple accepts a-number) returns true." (= ()
    (assert (tuple accepts 0).
    (assert (tuple accepts -1).
    (assert (tuple accepts 1).
    (assert (tuple accepts (number invalid).
  ).
  (should "(tuple accepts a-date) returns true." (= ()
    (assert (tuple accepts (date empty).
    (assert (tuple accepts (date of 1).
    (assert (tuple accepts (date of -1).
    (assert (tuple accepts (date invalid).
  ).
  (should "(tuple accepts a-range) returns true." (= ()
    (assert (tuple accepts (range empty).
    (assert (tuple accepts (0 1).
    (assert (tuple accepts (0 -1).
  ).
  (should "(tuple accepts a-symbol) returns true." (= ()
    (assert (tuple accepts (symbol empty).
    (assert (tuple accepts (` x).
    (assert (tuple accepts (` xy).
    (assert (tuple accepts (symbol invalid).
  ).
  (should "(tuple accepts a-tuple) returns true." (= ()
    (assert (tuple accepts (tuple empty).
    (assert (tuple accepts (tuple blank).
    (assert (tuple accepts (tuple unknown).
    (assert (tuple accepts (` (x).
    (assert (tuple accepts (` (x y).
  ).
  (should "(tuple accepts other-value) returns false." (= ()
    (var values (@
      type bool number string date range symbol tuple lambda function operator array object class (class empty)
      (lambda empty) (function empty) (operator empty) (array empty) (object empty)
    ).
    (for value in values
      (assert false (tuple accepts value).
    ).
  ).
).

(define "(tuple atom-of ...)" (= ()
  (should "(tuple atom-of) returns null." (= ()
    (assert null (tuple atom-of).
  ).
  (should "(tuple atom-of null) returns null." (= ()
    (assert null (tuple atom-of null).
  ).
  (should "(tuple atom-of a-bool) returns true." (= ()
    (assert true (tuple atom-of true).
    (assert false (tuple atom-of false).
  ).
  (should "(tuple atom-of a-string) returns true." (= ()
    (assert "" (tuple atom-of "").
    (assert " " (tuple atom-of " ").
    (assert "x" (tuple atom-of "x").
  ).
  (should "(tuple atom-of a-number) returns true." (= ()
    (assert 0 (tuple atom-of 0).
    (assert -1 (tuple atom-of -1).
    (assert 1 (tuple atom-of 1).
    (assert (number invalid) (tuple atom-of (number invalid).
  ).
  (should "(tuple atom-of a-date) returns true." (= ()
    (assert (date empty) (tuple atom-of (date empty).
    (assert (date of 1) (tuple atom-of (date of 1).
    (assert (date of -1) (tuple atom-of (date of -1).
    (assert (date invalid) (tuple atom-of (date invalid).
  ).
  (should "(tuple atom-of a-range) returns true." (= ()
    (assert (range empty) (tuple atom-of (range empty).
    (assert (0 1) (tuple atom-of (0 1).
    (assert (0 -1) (tuple atom-of (0 -1).
  ).
  (should "(tuple atom-of a-symbol) returns true." (= ()
    (assert (symbol empty) (tuple atom-of (symbol empty).
    (assert (` x) (tuple atom-of (` x).
    (assert (` xy) (tuple atom-of (` xy).
    (assert (symbol invalid) (tuple atom-of (symbol invalid).
  ).
  (should "(tuple atom-of a-tuple) returns true." (= ()
    (assert (tuple empty) (tuple atom-of (tuple empty).
    (assert (tuple blank) (tuple atom-of (tuple blank).
    (assert (tuple unknown) (tuple atom-of (tuple unknown).
    (assert (` (x)) (tuple atom-of (` (x).
    (assert (` (x y)) (tuple atom-of (` (x y).
  ).
  (should "(tuple atom-of other-value) returns null." (= ()
    (var values (@
      type bool number string date range symbol tuple lambda function operator array object class (class empty)
      (lambda empty) (function empty) (operator empty) (array empty) (object empty)
    ).
    (for value in values
      (assert (tuple unknown) (tuple atom-of value).
    ).
  ).
).

(define "(tuple of ...)" (= ()
  (should "(tuple of) returns (tuple empty)." (= ()
    (assert (tuple empty) (tuple of).
  ).
  (should "(tuple of item ...) returns a tuple of items." (= ()
    (var t (tuple of null true 1 "a" (date of 1) (0 1) (` x) (` (x y)) (@).
    (assert (t is-a tuple).
    (assert (t not-plain).
    (assert false (t is-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (`(x y)) (t 7).
    (assert (tuple unknown) (t 8).
  ).
).

(define "(tuple of-plain ...)" (= ()
  (should "(tuple of-plain) returns (tuple blank)." (= ()
    (assert (tuple blank) (tuple of-plain).
  ).
  (should "(tuple of-plain item ...) returns a plain tuple of items." (= ()
    (var t (tuple of-plain null true 1 "a" (date of 1) (0 1) (` x) (` (x y)) (@).
    (assert (t is-a tuple).
    (assert (t is-plain).
    (assert false (t not-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (`(x y)) (t 7).
    (assert (tuple unknown) (t 8).
  ).
).

(define "(tuple from ...)" (= ()
  (should "(tuple from) returns (tuple empty)." (= ()
    (assert (tuple empty) (tuple from).
  ).
  (should "(tuple from a-tuple ...) returns a tuple of items in a-tuple." (= ()
    (var t (tuple from (tuple of null true 1 "a") (tuple of (date of 1) (0 1) (` x) (` (x y)) (@).
    (assert (t is-a tuple).
    (assert (t not-plain).
    (assert false (t is-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (`(x y)) (t 7).
    (assert (tuple unknown) (t 8).
  ).
  (should "(tuple from an-array ...) returns a tuple of items in an-array." (= ()
    (var t (tuple from (tuple from (@ null true 1 "a") (@ (date of 1) (0 1) (` x) (` (x y)) (@).
    (assert (t is-a tuple).
    (assert (t not-plain).
    (assert false (t is-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (`(x y)) (t 7).
    (assert (tuple unknown) (t 8).
  ).
  (should "(tuple from item ...) returns a tuple of (tuple atom-of item) if item is neither a tuple nor an array." (= ()
    (var t (tuple from (tuple from null true 1 "a" (date of 1) (0 1) (` x) (` (x y)) (@ 100 (@)).
    (assert (t is-a tuple).
    (assert (t not-plain).
    (assert false (t is-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (` x) (t 7).
    (assert (` y) (t 8).
    (assert 100 (t 9).
    (assert (tuple unknown) (t 10).
  ).
).

(define "(tuple from-plain ...)" (= ()
  (should "(tuple from-plain) returns (tuple empty)." (= ()
    (assert (tuple blank) (tuple from-plain).
  ).
  (should "(tuple from-plain a-tuple ...) returns a tuple of items in a-tuple." (= ()
    (var t (tuple from-plain (tuple of null true 1 "a") (tuple of (date of 1) (0 1) (` x) (` (x y)) (@).
    (assert (t is-a tuple).
    (assert (t is-plain).
    (assert false (t not-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (`(x y)) (t 7).
    (assert (tuple unknown) (t 8).
  ).
  (should "(tuple from-plain an-array ...) returns a tuple of items in an-array." (= ()
    (var t (tuple from-plain (tuple from (@ null true 1 "a") (@ (date of 1) (0 1) (` x) (` (x y)) (@).
    (assert (t is-a tuple).
    (assert (t is-plain).
    (assert false (t not-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (`(x y)) (t 7).
    (assert (tuple unknown) (t 8).
  ).
  (should "(tuple from item ...) returns a tuple of (tuple atom-of item) if item is neither a tuple nor an array." (= ()
    (var t (tuple from-plain (tuple from null true 1 "a" (date of 1) (0 1) (` x) (` (x y)) (@ 100 (@)).
    (assert (t is-a tuple).
    (assert (t is-plain).
    (assert false (t not-plain).

    (assert null (t 0).
    (assert true (t 1).
    (assert 1 (t 2).
    (assert "a" (t 3).
    (assert (date of 1) (t 4).
    (assert (0 1) (t 5).
    (assert (` x) (t 6).
    (assert (` x) (t 7).
    (assert (` y) (t 8).
    (assert 100 (t 9).
    (assert (tuple unknown) (t 10).
  ).
).

(define "(a-tuple length)" (= ()
  (should "((tuple empty) length) returns 0." (= ()
    (assert 0 ((tuple empty) length).
  ).
  (should "((tuple blank) length) returns 0." (= ()
    (assert 0 ((tuple blank) length).
  ).
  (should "(a-tuple length) returns the count of its items." (= ()
    (assert 1 ((tuple of null) length).
    (assert 1 ((tuple of-plain null) length).

    (assert 2 ((tuple of null 1) length).
    (assert 2 ((tuple of-plain null 1) length).

    (assert 3 ((tuple of null 1 true) length).
    (assert 3 ((tuple of-plain null 1 true) length).
  ).
).

(define "(a-tuple is-plain)" (= ()
  (should "((tuple empty) is-plain) returns false." (= ()
    (assert false ((tuple empty) is-plain).
  ).
  (should "((tuple blank) is-plain) returns true." (= ()
    (assert ((tuple blank) is-plain).
  ).
  (should "a tuple generated by (tuple of ...) or (tuple from) is not a plain tuple." (= ()
    (assert false ((tuple of null 1) is-plain).
    (assert false ((tuple from (@ null 1)) is-plain).
  ).
  (should "a tuple generated by (tuple of-plain ...) or (tuple from-plain) is a plain tuple." (= ()
    (assert ((tuple of-plain null 1) is-plain).
    (assert ((tuple from-plain (@ null 1)) is-plain).
  ).
).

(define "(a-tuple not-plain)" (= ()
  (should "((tuple empty) not-plain) returns true." (= ()
    (assert ((tuple empty) not-plain).
  ).
  (should "((tuple blank) not-plain) returns false." (= ()
    (assert false ((tuple blank) not-plain).
  ).
  (should "a tuple generated by (tuple of ...) or (tuple from) is not a plain tuple." (= ()
    (assert ((tuple of null 1) not-plain).
    (assert ((tuple from (@ null 1)) not-plain).
  ).
  (should "a tuple generated by (tuple of-plain ...) or (tuple from-plain) is a plain tuple." (= ()
    (assert false ((tuple of-plain null 1) not-plain).
    (assert false ((tuple from-plain (@ null 1)) not-plain).
  ).
).

(define "(a-tuple as-plain)" (= ()
  (should "((tuple empty) as-plain) returns (tuple blank)." (= ()
    (assert (((tuple empty) as-plain) is (tuple blank)).
  ).
  (should "(a-tuple as-plain) returns a plain tuple with the same elements." (= ()
    (var t (`(x y null true).
    (var p (t as-plain).
    (assert (p is-plain).
    (assert false (p not-plain).
    (assert 4 (p length).
    (assert (`x) (p 0).
    (assert (`y) (p 1).
    (assert null (p 2).
    (assert true (p 3).
  ).
).

(define "(a-tuple source-map)" (= ()
  (should "(a-tuple source-map) returns null if a-tuple is not generated from source code." (= ()
    (assert null ((tuple empty) source-map).
    (assert null ((tuple blank) source-map).
    (assert null ((tuple of null 1) source-map).
    (assert null ((tuple of-plain null 1) source-map).
  ).
).

(define "(a-tuple iterate)" (= ()
  (should "(a-tuple iterate) returns an interator function to traverse all its items." (= ()
    (var t (tuple of null true 1).
    (var iter (t iterate).
    (assert ($iter is-a function).
    (assert ((iter) is-an array).
    (assert null ((iter true) 0).
    (assert ((iter) is-an array).
    (assert true ((iter true) 0).
    (assert ((iter) is-an array).
    (assert 1 ((iter true) 0).
    (assert null (iter).

    (var items (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var t (tuple from items).
    (for (v i) in t
      (assert (items:i) v).
    ).
  ).
  (should "a tuple can be used in a for loop to traverse all its items." (= ()
    (var items (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var t (tuple from items).
    (var i 0)
    (for v in t
      (assert (items: (i ++)) v).
    ).
  ).
  (should "a tuple can be used in a for loop to traverse all its items and indices." (= ()
    (var items (@ null true 1 "a" (date of 1) (0 1) (` x) (` (x y).
    (var t (tuple from items).
    (for (v i) in t
      (assert (items:i) v).
    ).
  ).
).

(define "(a-tuple copy ...)" (= ()
  (should "(a-tuple copy) returns the subject tuple." (= ()
    (var t (` (x y).
    (var c (t copy).
    (assert ((c 0) is (`x).
    (assert ((c 1) is (`y).
    (assert (c is t).
  ).
  (should "(a-tuple copy begin) returns the elements in range of begin to end." (= ()
    (var t (` (x y).
    (var c (t copy 0).
    (assert 2 (c length).
    (assert ((c 0) is (`x).
    (assert ((c 1) is (`y).
    (assert (c is t).

    (var c (t copy -2).
    (assert 2 (c length).
    (assert ((c 0) is (`x).
    (assert ((c 1) is (`y).
    (assert (c is t).

    (var c (t copy -3).
    (assert 2 (c length).
    (assert ((c 0) is (`x).
    (assert ((c 1) is (`y).
    (assert (c is t).

    (let c (t copy 1).
    (assert 1 (c length).
    (assert ((c 0) is (`y).

    (let c (t copy -1).
    (assert 1 (c length).
    (assert ((c 0) is (`y).

    (let c (t copy 2).
    (assert 0 (c length).
    (let c (t copy 3).
    (assert 0 (c length).
  ).
  (should "(a-tuple copy begin count) returns the first <count> elements from begin." (= ()
    (var t (` (x y z).
    (var c (t copy 0 3).
    (assert ((c 0) is (`x).
    (assert ((c 1) is (`y).
    (assert ((c 2) is (`z).
    (assert (c is t).

    (let c (t copy -3 3).
    (assert ((c 0) is (`x).
    (assert ((c 1) is (`y).
    (assert ((c 2) is (`z).
    (assert (c is t).

    (let c (t copy 2 1).
    (assert 1 (c length).
    (assert ((c 0) is (`z).

    (let c (t copy -1 1).
    (assert 1 (c length).
    (assert ((c 0) is (`z).

    (let c (t copy 2 4).
    (assert 1 (c length).
    (assert ((c 0) is (`z).

    (let c (t copy -1 4).
    (assert 1 (c length).
    (assert ((c 0) is (`z).

    (let c (t copy 1 1).
    (assert 1 (c length).
    (assert ((c 0) is (`y).

    (let c (t copy -2 2).
    (assert 2 (c length).
    (assert ((c 0) is (`y).
    (assert ((c 1) is (`z).
  ).
  (should "(a-tuple copy begin count) returns (tuple empty) if count is not great than 0." (= ()
    (var t (` (x y z).
    (assert (tuple empty) (t copy 0 0).
    (assert (tuple empty) (t copy 0 -1).
    (assert (tuple empty) (t copy -3 0).
    (assert (tuple empty) (t copy -2 -1).
  ).
).

(define "(a-tuple slice ...)" (= ()
  (should "(a-tuple slice) returns the subject tuple." (= ()
    (var t (` (x y).
    (var s (t slice).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert ((s slice) is t).
  ).
  (should "(a-tuple slice begin) returns the elements in range of begin to end." (= ()
    (var t (` (x y).

    (var s (t slice 0).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert (s is t).

    (let s (t slice -2).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert (s is t).

    (let s (t slice -3).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert (s is t).

    (let s (t slice 1).
    (assert 1 (s length).
    (assert ((s 0) is (`y).

    (let s (t slice -1).
    (assert 1 (s length).
    (assert ((s 0) is (`y).
  ).
  (should "(a-tuple slice begin end) returns the elements in the range of (begin end)." (= ()
    (var t (` (x y z).
    (var s (t slice 0 3).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert ((s 2) is (`z).
    (assert (s is t).

    (let s (t slice -3 3).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert ((s 2) is (`z).
    (assert (s is t).

    (let s (t slice -4 3).
    (assert ((s 0) is (`x).
    (assert ((s 1) is (`y).
    (assert ((s 2) is (`z).
    (assert (s is t).

    (let s (t slice 2 3).
    (assert 1 (s length).
    (assert ((s 0) is (`z).

    (let s (t slice -1 3).
    (assert 1 (s length).
    (assert ((s 0) is (`z).

    (let s (t slice 2 4).
    (assert 1 (s length).
    (assert ((s 0) is (`z).

    (let s (t slice -1 4).
    (assert 1 (s length).
    (assert ((s 0) is (`z).

    (let s (t slice 1 2).
    (assert 1 (s length).
    (assert ((s 0) is (`y).

    (let s (t slice -2 2).
    (assert 1 (s length).
    (assert ((s 0) is (`y).
  ).
  (should "(a-tuple slice begin end) returns (tuple empty) if begin is after end." (= ()
    (var t (` (x y z).
    (assert (tuple empty) (t slice 0 0).
    (assert (tuple empty) (t slice 1 0).
    (assert (tuple empty) (t slice 1 1).
    (assert (tuple empty) (t slice 3 2).
    (assert (tuple empty) (t slice -2 0).
    (assert (tuple empty) (t slice -1 1).
    (assert (tuple empty) (t slice -1 -1).
    (assert (tuple empty) (t slice -1 -2).
  ).
).

(define "(a-tuple first ...)" (= ()
  (should "((tuple empty) first) and ((tuple blank) first) returns null." (= ()
    (assert null ((tuple empty) first).
    (assert null ((tuple blank) first).
  ).
  (should "(a-tuple first) returns the first element of the tuple." (= ()
    (var t (` (x y).
    (assert ((t first) is (`x).
  ).
  (should "(a-tuple first count) returns (tuple empty) or (tuple blank) if count <= 0." (= ()
    (var t (` (x y z).
    (var f (t first 0).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple empty).

    (var f (t first -1).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple empty).

    (let t (tuple from-plain t).
    (var f (t first 0).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple blank).

    (var f (t first -1).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple blank).
  ).
  (should "(a-tuple first count) returns the first <count> elements of the tuple as a tuple." (= ()
    (var t (` (x y z).
    (var f (t first 1).
    (assert (f is-a tuple).
    (assert 1 (f length).
    (assert (`x) (f 0).

    (var f (t first 2).
    (assert (f is-a tuple).
    (assert 2 (f length).
    (assert (`x) (f 0).
    (assert (`y) (f 1).

    (var f (t first 3).
    (assert (f is-a tuple).
    (assert 3 (f length).
    (assert (`x) (f 0).
    (assert (`y) (f 1).
    (assert (`z) (f 2).

    (var f (t first 4).
    (assert (f is-a tuple).
    (assert 3 (f length).
    (assert (`x) (f 0).
    (assert (`y) (f 1).
    (assert (`z) (f 2).
  ).
).

(define "(a-tuple first-of ...)" (= ()
  (should "(a-tuple first-of) returns null." (= ()
    (var t (` (x y).
    (assert null (t first-of).
  ).
  (should "(a-tuple first-of value) returns the offset of the first occurance of value." (= ()
    (var t (` (x y x z x y).
    (assert 0 (t first-of (`x).
    (assert 1 (t first-of (`y).
    (assert 3 (t first-of (`z).
  ).
  (should "(a-tuple first-of value) returns null if value is not an element of the tuple." (= ()
    (var t (` (x y x z x y).
    (assert null (t first-of (`p).
    (assert null (t first-of 0).
    (assert null (t first-of true).
  ).
).

(define "(a-tuple last ...)" (= ()
  (should "((tuple empty) last) and ((tuple blank) last) returns null." (= ()
    (assert null ((tuple empty) last).
    (assert null ((tuple blank) last).
  ).
  (should "(a-tuple last) returns the last element of the tuple." (= ()
    (var t (` (x y).
    (assert ((t last) is (`y).
  ).
  (should "(a-tuple last count) returns (tuple empty) or (tuple blank) if count <= 0." (= ()
    (var t (` (x y z).
    (var f (t last 0).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple empty).

    (var f (t last -1).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple empty).

    (let t (tuple from-plain t).
    (var f (t last 0).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple blank).

    (var f (t last -1).
    (assert (f is-a tuple).
    (assert 0 (f length).
    (assert (f is (tuple blank).
  ).
  (should "(a-tuple last count) returns the last <count> elements of the tuple as a tuple." (= ()
    (var t (` (x y z).
    (var f (t last 1).
    (assert (f is-a tuple).
    (assert 1 (f length).
    (assert (`z) (f 0).

    (var f (t last 2).
    (assert (f is-a tuple).
    (assert 2 (f length).
    (assert (`y) (f 0).
    (assert (`z) (f 1).

    (var f (t last 3).
    (assert (f is-a tuple).
    (assert 3 (f length).
    (assert (`x) (f 0).
    (assert (`y) (f 1).
    (assert (`z) (f 2).

    (var f (t last 4).
    (assert (f is-a tuple).
    (assert 3 (f length).
    (assert (`x) (f 0).
    (assert (`y) (f 1).
    (assert (`z) (f 2).
  ).
).

(define "(a-tuple last-of ...)" (= ()
  (should "(a-tuple last-of) returns null." (= ()
    (var t (` (x y).
    (assert null (t last-of).
  ).
  (should "(a-tuple last-of value) returns the offset of the first occurance of value." (= ()
    (var t (` (x y x z x y x).
    (assert 6 (t last-of (`x).
    (assert 5 (t last-of (`y).
    (assert 3 (t last-of (`z).
  ).
  (should "(a-tuple last-of value) returns null if value is not an element of the tuple." (= ()
    (var t (` (x y x z x y).
    (assert null (t last-of (`p).
    (assert null (t last-of 0).
    (assert null (t last-of true).
  ).
).

(define "(a-tuple concat ...)" (= ()
  (should "(a-tuple concat) returns the original tuple." (= ()
    (var t (` (x y).
    (assert ((t concat) is t).
  ).
  (should "(a-tuple concat value ...) returns a new tuple with the value(s) appended to the end." (= ()
    (var t (` (x y).
    (var c (t concat (`z).
    (assert 2 (t length).
    (assert (`x) (t 0).
    (assert (`y) (t 1).
    (assert 3 (c length).
    (assert (`x) (c 0).
    (assert (`y) (c 1).
    (assert (`z) (c 2).

    (let cc (c concat (`p) (`q).
    (assert 2 (t length).
    (assert 3 (c length).
    (assert 5 (cc length).
    (assert (`p) (cc 3).
    (assert (`q) (cc 4).
  ).
).

(define "(a-tuple merge ...)" (= ()
  (should "(a-tuple merge) returns the original tuple." (= ()
    (var t (` (x y).
    (assert ((t merge) is t).
  ).
  (should "(a-tuple merge b-tuple) returns a new tuple appending b-tuple elements to a-tuple." (= ()
    (var t1 (` (x y).
    (var t2 (` (p q).
    (var m (t1 merge t2).
    (assert 4 (m length).
    (assert (`x) (m 0).
    (assert (`y) (m 1).
    (assert (`p) (m 2).
    (assert (`q) (m 3).
  ).
  (should "(a-tuple merge an-array) returns a new tuple appending an-array elements to a-tuple." (= ()
    (var t1 (` (x y).
    (var t2 (@ (`p) (`q) (@).
    (var m (t1 merge t2).
    (assert 5 (m length).
    (assert (`x) (m 0).
    (assert (`y) (m 1).
    (assert (`p) (m 2).
    (assert (`q) (m 3).
    (assert (tuple unknown) (m 4).
  ).
  (should "(a-tuple merge value ...) returns a new tuple appending other type of values to a-tuple." (= ()
    (var t (` (x y).
    (var m (t merge (`z) null true 1 "x" (1 10)
      type (=) (=>) (=?) (@:) (class empty)
    ).
    (assert 14 (m length).
    (assert (`x) (m 0).
    (assert (`y) (m 1).
    (assert (`z) (m 2).
    (assert null (m 3).
    (assert true (m 4).
    (assert 1 (m 5).
    (assert "x" (m 6).
    (assert (1 10) (m 7).
    (for i in (8 (m length))
      (assert (tuple unknown) (m:i).
    ).
  ).
).

(define "(a-tuple + ...)" (= ()
  (should "(a-tuple + ...) is just an alias of (a-tuple merge ...)." (= ()
    (var t (` (x y).
    (assert ($(t "+") is (t "merge").
  ).
).

(define "(a-tuple to-array)" (= ()
  (should "(a-tuple to-array) returns an array which has same elements in the original tuple." (= ()
    (var t (` (x y).
    (var a (t to-array).
    (a push (`z).
    (assert 2 (t length).
    (assert 3 (a length).
    (assert (`x) (a 0).
    (assert (`y) (a 1).
    (assert (`z) (a 2).
  ).
  (should "(a-tuple to-array) returns a new array each time when it's called." (= ()
    (var t (` (x y).
    (var a (t to-array).
    (var b (t to-array).
    (b push (`z).
    (assert 2 (a length).
    (assert 3 (b length).
    (assert (`x) (b 0).
    (assert (`y) (b 1).
    (assert (`z) (b 2).
  ).
).
