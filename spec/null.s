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

(define "Arithmetic Operators" (=> ()
  (should "(++ null) returns 1." (=> ()
    (assert 1 (++),
    (assert 1 (++ null),

    (var n null)
    (assert 1 (++ n),
    (assert 1 n),
  ),
  (should "(-- null) returns -1." (=> ()
    (assert -1 (--),
    (assert -1 (-- null),

    (var n null)
    (assert -1 (-- n),
    (assert -1 n),
  ),
).

(define "Bitwise Operators" (=> ()
  (should "(~ null) returns (~ 0)." (=> ()
    (assert (~ 0) (~),
    (assert (~ 0) (~ null),

    (var n null)
    (assert (~ 0) (~ n),
  ),
).

(define "General Operators" (=> ()
  (should "(+ null) returns 'null'." (=> ()
    (assert 0 (+),
    (assert "null" (+ null),
    (assert "nullnull" (+ null null),

    (var n null)
    (assert "null" (+ n),
    (assert "nullnull" (+ n n),
  ),
).

(define "Logical Operators" (=> ()
  (should "(! null) returns true." (=> ()
    (assert true (!),
    (assert true (! null),

    (var n null)
    (assert true (! n),
  ),
  (should "(not null) returns true." (=> ()
    (assert true (not),
    (assert true (not null),

    (var n null)
    (assert true (not n),
  ),
).

(define "Global Operators" (=> ()
  (define "Logical AND: (null && ...)" (=> ()
    (should "(null &&) returns null." (=> ()
      (assert null (null &&),
      (var n null)
      (assert null (n &&),
    ),
    (should "(null && x) returns null." (=> ()
      (assert null (null && true),
      (var n null)
      (assert null (n && true),
    ),
    (should "(null && x y) returns null." (=> ()
      (assert null (null && true true),
      (var n null)
      (assert null (n && true true),
    ),
  ),
  (define "Logical OR: (null || ...)" (=> ()
    (should "(null ||) returns null." (=> ()
      (assert null (null ||),
      (var n null)
      (assert null (n ||),
    ),
    (should "(null || x) returns x." (=> ()
      (assert 1 (null || 1),
      (var n null)
      (assert 1 (n || 1),
    ),
    (should "(null || null x) returns x." (=> ()
      (assert 1 (null || null 1),
      (var n null)
      (assert 1 (n || null 1),
    ),
  ),
  (define "Boolean Test: (null ? ...)" (=> ()
    (should "Booeanize: (null ?) returns false." (=> ()
      (assert false (null ?),
      (var n null)
      (assert false (n ?),
    ),
    (should "Boolean Fallback: (null ? x) returns x." (=> ()
      (assert 1 (null ? 1),
      (assert 1 (null ? (1),
      (var n null)
      (assert 1 (n ? 1),
      (assert 1 (n ? (1),
    ),
    (should "Boolean Switch: (null ? x y) returns y." (=> ()
      (var x -1)
      (var y  1)
      (assert 1 (null ? (-- x) y),
      (assert -1 x)

      (assert 2 (null ? (-- 0) (++ y),
      (assert -1 x)
      (assert 2 y)
    ),
  ),
  (define "Null fallback: (null ?? ...)" (=> ()
    (should "(null ??) returns null." (=> ()
      (assert null (null ??),
      (var n null)
      (assert null (n ??),
    ),
    (should "(null ?? x) returns x." (=> ()
      (assert 1 (null ?? 1),
      (assert 2 (null ?? (++ 1),
      (var n null)
      (assert 1 (n ?? 1),
      (assert 2 (n ?? (++ 1),
    ),
    (should "(null ?? x y) returns x." (=> ()
      (let x 1)
      (let y -1)
      (assert 1 (null ?? x y),
      (assert 2 (null ?? (++ x) (-- y),
      (assert 2 x)
      (assert -1 y)
    ),
    (should "(null ?? null x) returns x." (=> ()
      (assert 2 (null ?? null 2),
      (assert 2 (null ?? (null) (2),
      (var n null)
      (assert 2 (n ?? n 2),
      (assert 2 (n ?? (n) (2),
    ),
  ),
).
