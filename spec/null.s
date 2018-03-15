(var (types) (import (samples) from "samples/types").

(define "Identity" (=> ()
  (should "null is and only is itself." (=> ()
    (assert (null is),
    (assert (null is null),
    (assert false (null is-not),
    (assert false (null is-not null),

    (assert false (null is type),
    (assert (null is-not type),

    (for t in types
      (assert false (null is (t the-type),
      (assert (null is-not (t the-type),

      (assert false (null is (t "empty"),
      (assert (null is-not (t "empty"),

      (for v in (t values)
        (assert false (null is v),
        (assert (null is-not v),
      ),
).

(define "Identity Operators" (= ()
  (should "'===' is 'is'." (= ()
    (assert (:(null "===") is (null "is"),
  ),
  (should "'!==' is 'is-not'." (= ()
    (assert (:(null "!==") is (null "is-not"),
  ),
).

(define "Equivalence" (= ()
  (should "null's equivalence is identical with its identity." (= ()
    (assert (:(null "equals") is (null "is"),
    (assert (:(null "not-equals") is (null "is-not"),
  ),
).

(define "Equivalence Operators" (= ()
  (should "'==' is 'equals'." (= ()
    (assert (:(null "==") is (null "equals"),
  ),
  (should "'!=' is 'not-equals'." (= ()
    (assert (:(null "!=") is (null "not-equals"),
  ),
).

(define "Ordering" (=> ()
  (should "null is only comparable with itself." (=> ()
    (assert 0 (null compare),
    (assert 0 (null compare null),

    (assert null (null compare type),

    (for t in types
      (assert null (null compare (t the-type),
      (assert null (null compare (t "empty"),
      (for v in (t values)
        (assert null (null compare v),
      ),
).

(define "Type Verification" (=> ()
  (should "null is the type of itself." (=> ()
    (assert (null is-a),
    (assert (null is-a null),
    (assert false (null is-not-a),
    (assert false (null is-not-a null),

    (assert false (null is-a type),
    (assert (null is-not-a type),

    (for t in types
      (assert false (null is-a (t the-type),
      (assert (null is-not-a (t the-type),
    ),
).

(define "Emptiness" (= ()
  (should "null is an empty value." (= ()
    (assert (null is-empty),
    (assert false (null not-empty),
).

(define "Encoding" (= ()
  (should "null is encoded to itself." (= ()
    (assert null (null to-code),
).

(define "Representation" (= ()
  (should "null is represented as 'null'." (= ()
    (assert "null" (null to-string),
).

(define "Indexer" (= ()
  (should "the indexer is a lambda." (= ()
    (assert (:(null ":") is-a lambda),
  ),
  (should "null's type is null." (= ()
    (assert null (null type),

    (assert null (null "type"),
    (assert null (null (`type),

    (assert null (null :"type"),
    (assert null (null :(`type),

    (assert null (null :"type" x),
    (assert null (null :(`type) x),
  ),
).

(define "Evaluation" (=> ()
  (should "null is evaluated to null." (=> ()
    (assert null (null),
    (assert null (null null),

    (assert null (null type),

    (for t in types
      (assert null (null (t the-type),
      (assert null (null (t "empty"),
      (for v in (t values)
        (assert null (null v),
      ),
  ),
).
