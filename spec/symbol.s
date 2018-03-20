(var the-type symbol)
(include "type_")

(define "Common Behaviours" (= ()
  (define "Identity" (=> ()
    (should "true is true" (= ()
      (assert (true is true),
      (assert false (true is-not true),

      (assert (true is-not false),
      (assert false (true is false),
    ),
    (should "false is false" (=> ()
      (assert (false is false),
      (assert false (false is-not false),

      (assert (false is-not true),
      (assert false (false is true),
  ),

  (define "Equivalence" (=> ()
    (should "true is equivalent with true" (=> ()
      (assert (true equals true),
      (assert false (true not-equals true),

      (assert (true not-equals false),
      (assert false (true equals false),
    ),
    (should "false is equivalent with false" (=> ()
      (assert (false equals false),
      (assert false (false not-equals false),

      (assert (false not-equals true),
      (assert false (false equals true),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "true is equivalent with true" (=> ()
      (assert (true == true),
      (assert false (true != true),

      (assert (true != false),
      (assert false (true == false),
    ),
    (should "false is equivalent with false" (=> ()
      (assert (false == false),
      (assert false (false != false),

      (assert (false != true),
      (assert false (false == true),
  ),

  (define "Ordering" (=> ()
    (should "true is only comparable with itself." (=> ()
      (assert 0 (true compare true),
      (assert null (true compare false),
      (assert null (true compare type),
      (assert null (true compare null),
      (assert null (true compare 0),
      (assert null (true compare ""),
      (assert null (true compare (@:),
    ),
    (should "false is only comparable with itself." (=> ()
      (assert 0 (false compare false),
      (assert null (false compare true),
      (assert null (false compare type),
      (assert null (false compare null),
      (assert null (false compare 0),
      (assert null (false compare ""),
      (assert null (false compare (@:),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "false is defined as the empty value." (=> ()
      (assert false (bool empty),
      (assert false (true is-empty),
      (assert (true  not-empty),
      (assert (false is-empty),
      (assert false (false  not-empty),
  ),

  (define "Encoding" (=> ()
    (should "true is encoded to itself." (=> ()
      (assert true (true to-code),
    ),
    (should "false is encoded to itself." (=> ()
      (assert false (false to-code),
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
  (should "Other values is converted to true." (= ()
    (assert true (bool of 1),
    (assert true (bool of -1),
    (assert true (bool of (number invalid)),
    (assert true (bool of (number infinite)),
    (assert true (bool of ""),
    (assert true (bool of "X"),
    (assert true (bool of (date of 0),
    (assert true (bool of (range of 0),
    (assert true (bool of (symbol of "X"),
    (assert true (bool of (tuple of (@ 1 2),
    (assert true (bool of (@),
    (assert true (bool of (@ 1 2),
    (assert true (bool of (@:),
    (assert true (bool of (@ x:1),
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
