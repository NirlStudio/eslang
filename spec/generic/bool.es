(var * (load "./share/type" (@ the-type: bool).

(define "Bool Common Behaviors" (= ()
  (define "Identity" (=> ()
    (should "true is true." (= ()
      (assert (true is true).
      (assert false (true is-not true).

      (assert (true is-not false).
      (assert false (true is false).
    ).
    (should "false is false." (=> ()
      (assert (false is false).
      (assert false (false is-not false).

      (assert (false is-not true).
      (assert false (false is true).
  ).

  (define "Equivalence" (=> ()
    (should "bool equivalence is the same of identity." (=> ()
      (assert ($(true "is") is (true "equals")).
      (assert ($(true "is") equals (false "equals")).

      (assert ($(false "is") equals (true "equals")).
      (assert ($(false "is") is (false "equals")).

      (assert ($(true "equals") is (true "is")).
      (assert ($(true "equals") equals (false "is")).

      (assert ($(false "equals") equals (true "is")).
      (assert ($(false "equals") is (false "is")).
    ).
  ).

  (define "Ordering" (=> ()
    (should "true is only comparable with itself." (=> ()
      (assert 0 (true compares-to true).
      (assert null (true compares-to false).
    ).
    (should "false is only comparable with itself." (=> ()
      (assert 0 (false compares-to false).
      (assert null (false compares-to true).
    ).
  ).

  (define "Emptiness" (=> ()
    (should "false is defined as the empty value." (=> ()
      (assert ((bool empty) is false).
      (assert false ((bool empty) is-not false).

      (assert false (true is-empty).
      (assert (true  not-empty).

      (assert (false is-empty).
      (assert false (false not-empty).
  ).

  (define "Encoding" (=> ()
    (should "true is encoded to itself." (=> ()
      (assert ((true to-code) is true).
      (assert false ((true to-code) is-not true).
    ).
    (should "false is encoded to itself." (=> ()
      (assert ((false to-code) is false).
      (assert false ((false to-code) is-not false).
    ).
  ).

  (define "Representation" (=> ()
    (should "true is represented as 'true'." (=> ()
      (assert "true" (true to-string).
    ).
    (should "false is represented as 'false'." (=> ()
      (assert "false" (false to-string).
  ).
).

(define "Value Conversion" (=> ()
  (should "true is converted to true." (= ()
    (assert true (bool of true).
  ).
  (should "false is converted to false." (= ()
    (assert false (bool of false).
  ).
  (should "null is converted to false." (= ()
    (assert false (bool of).
    (assert false (bool of null).
  ).
  (should "0 is converted to false." (= ()
    (assert false (bool of 0).
    (assert false (bool of -0).
    (assert false (bool of +0).
  ).
  (should "other values will be converted to true." (=> ()
    (for a-type in other-types
      (for a-value in ((a-type values) concat (a-type "empty"))
        (assert (0 not-equals a-value) (bool of a-value).
      ).
    ).
  ).
).

(define "Value Indexer" (= ()
  (should "bool value's indexer is read-only." (= ()
    (assert null (true "__prop" "value").
    (assert null (false "__prop" "value").

    (assert null (true : "__prop" "value").
    (assert null (false : "__prop" "value").
  ).
).

(define "Logical Operations" (= ()
  (define "Operator AND: &&" (= ()
    (should "true and true is true" (= ()
      (assert (true && true).
    ).
    (should "true and false is false" (= ()
      (assert false (true && false).
    ).
    (should "false and true is false" (= ()
      (assert false (false && true).
    ).
    (should "false and false is false" (= ()
      (assert false (false && false).
    ).
  ).
  (define "Operator AND: and" (= ()
    (should "operator 'and' is an alias of '&&'." (= ()
      (assert (true "and":: is (true "&&").
      (assert (false "and":: is (false "&&").
    ).
  ).
  (define "Operator OR: ||" (= ()
    (should "true or true is true" (= ()
      (assert (true || true).
    ).
    (should "true or false is true" (= ()
      (assert (true || false).
    ).
    (should "false or true is true" (= ()
      (assert (false || true).
    ).
    (should "false or false is false" (= ()
      (assert false (false || false).
    ).
  ).
  (define "Operator OR: or" (= ()
    (should "operator 'or' is an alias of '||'." (= ()
      (assert (true "or":: is (true "||").
      (assert (false "or":: is (false "||").
    ).
  ).
  (define "Operator NOT: !" (= ()
    (should "the operator returns false without input." (= ()
      (assert ((!) is false).
    ).
    (should "the not value of true is false" (= ()
      (assert false (! true).
    ).
    (should "the not value of false is true" (= ()
      (assert (! false).
    ).
  ).
  (define "Operator NOT: not" (= ()
    (should "the operator returns false without input." (= ()
      (assert ((not) is false).
    ).
    (should "the NOT value of true is false" (= ()
      (assert false (not true).
    ).
    (should "the NOT value of false is true" (= ()
      (assert (not false).
    ).
  ).
).

(define "(a-bool fails)" (= ()
  (should "(true fails) returns false." (= ()
    (assert ((true fails) is false).
  ).
  (should "(false fails) returns true." (= ()
    (assert ((false fails) is true).
  ).
).

(define "(a-bool succeeds)" (= ()
  (should "(true succeeds) returns true." (= ()
    (assert ((true succeeds) is true).
  ).
  (should "(false succeeds) returns false." (= ()
    (assert ((false succeeds) is false).
  ).
).
