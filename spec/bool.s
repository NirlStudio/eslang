(var the-type bool)
(include "share/type")

(define "Common Behaviours" (= ()
  (define "Identity" (=> ()
    (should "true is true." (= ()
      (assert (true is true),
      (assert false (true is-not true),

      (assert (true is-not false),
      (assert false (true is false),
    ),
    (should "false is false." (=> ()
      (assert (false is false),
      (assert false (false is-not false),

      (assert (false is-not true),
      (assert false (false is true),
  ),

  (define "Equivalence" (=> ()
    (should "true is equivalent with true." (=> ()
      (assert (true equals true),
      (assert false (true not-equals true),

      (assert (true not-equals false),
      (assert false (true equals false),
    ),
    (should "false is equivalent with false." (=> ()
      (assert (false equals false),
      (assert false (false not-equals false),

      (assert (false not-equals true),
      (assert false (false equals true),
  ),

  (define "Ordering" (=> ()
    (should "true is only comparable with itself." (=> ()
      (assert 0 (true compare true),
      (assert null (true compare false),
      # to compare with all other types and their values.
    ),
    (should "false is only comparable with itself." (=> ()
      (assert 0 (false compare false),
      (assert null (false compare true),
      # to compare with all other types and their values.
    ),
  ),

  (define "Emptiness" (=> ()
    (should "false is defined as the empty value." (=> ()
      (assert ((bool empty) is false),
      (assert false ((bool empty) is-not false),

      (assert (false is-empty),
      (assert false (false  not-empty),

      (assert false (true is-empty),
      (assert (true  not-empty),
  ),

  (define "Encoding" (=> ()
    (should "true is encoded to itself." (=> ()
      (assert ((true to-code) is true),
      (assert false ((true to-code) is-not true),
    ),
    (should "false is encoded to itself." (=> ()
      (assert ((false to-code) is false),
      (assert false ((false to-code) is-not false),
    ),
  ),

  (define "Representation" (=> ()
    (should "true is represented as 'true'." (=> ()
      (assert "true" (true to-string),
    ),
    (should "false is represented as 'false'." (=> ()
      (assert "false" (false to-string),
  ),
).

(define "Value Conversion" (= ()
  (should "true is converted to true." (= ()
    (assert true (bool of true),
  ),
  (should "false is converted to false." (= ()
    (assert false (bool of false),
  ),
  (should "null is converted to false." (= ()
    (assert false (bool of null),
    (assert false (bool of),
  ),
  (should "0 is converted to false." (= ()
    (assert false (bool of 0),
  ),
  (should "other values will be converted to true." (= ()
    # TODO
  ),
).

(define "Logical Operations" (= ()
  (define "AND: &&" (= ()
    (should "true and true is true" (= ()
      (assert (true && true),
    ),
    (should "true and false is false" (= ()
      (assert false (true && false),
    ),
    (should "false and true is false" (= ()
      (assert false (false && true),
    ),
    (should "false and false is false" (= ()
      (assert false (false && false),
    ),
  ),
  (define "OR: ||" (= ()
    (should "true or true is true" (= ()
      (assert (true || true),
    ),
    (should "true or false is true" (= ()
      (assert (true || false),
    ),
    (should "false or true is true" (= ()
      (assert (false || true),
    ),
    (should "false or false is false" (= ()
      (assert false (false || false),
    ),
  ),
  (define "NOT: not / !" (= ()
    (should "the empty not op is defined as true" (= ()
      (assert (not),
      (assert (!),
    ),
    (should "the not value of true is false" (= ()
      (assert false (not true),
      (assert false (! true),
    ),
    (should "the not value of false is true" (= ()
      (assert (not false),
      (assert (! false),
    ),
).
