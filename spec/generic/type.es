(var (types) (import (samples) from "./samples/types").

(define "Identity" (=> ()
  (should "type is and only is type." (=> ()
    (assert (type is type).
    (assert false (type is-not type).

    (assert false (type is).
    (assert false (type is null).
    (assert (type is-not).
    (assert (type is-not null).

    (for t in types
      (assert false (type is (t the-type).
      (assert (type is-not (t the-type).

      (assert false (type is (t "empty").
      (assert (type is-not (t "empty").

      (for v in (t values)
        (assert false (type is v).
        (assert (type is-not v).
      ).
).

(define "Identity Operators" (= ()
  (should "'===' is 'is'." (= ()
    (assert ($(type "===") is (type "is").
  ).
  (should "'!==' is 'is-not'." (= ()
    (assert ($(type "!==") is (type "is-not").
  ).
).

(define "Equivalence" (= ()
  (should "null's equivalence is identical with its identity." (= ()
    (assert ($(type "equals") is (type "is").
    (assert ($(type "not-equals") is (type "is-not").
).

(define "Equivalence Operators" (= ()
  (should "'==' is 'equals'." (= ()
    (assert ($(type "==") is (type "equals").
  ).
  (should "'!=' is 'not-equals'." (= ()
    (assert ($(type "!=") is (type "not-equals").
  ).
).

(define "Ordering" (=> ()
  (should "type is only comparable with itself." (=> ()
    (assert 0 (type compares-to type).

    (assert null (type compares-to).
    (assert null (type compares-to null).
    (assert null (null compares-to type).

    (for t in types
      (assert null (type compares-to (t the-type).
      (assert null ((t the-type) compares-to type).

      (assert null (type compares-to (t "empty").
      (assert null ((t "empty") compares-to type).

      (for v in (t values)
        (assert null (type compares-to v).
        (assert null ($v compares-to type).
      ).
).

(define "Type Verification" (=> ()
  (should "type is an instance of its proto." (=> ()
    (assert (type is-a type).
    (assert false (type is-not-a type).

    (assert false (type is-a).
    (assert false (type is-a null).
    (assert (type is-not-a).
    (assert (type is-not-a null).

    (for t in types
      (assert false (type is-a (t the-type).
      (assert (type is-not-a (t the-type).
    ).
).

(define "Emptiness" (= ()
  (should "type is an empty value." (= ()
    (assert ((type empty) is type).
    (assert (type is (type empty)).

    (assert (type is-empty).
    (assert false (type not-empty).
).

(define "Encoding" (= ()
  (should "type is encoded to (` type)." (= ()
    (assert (` type) (type to-code).
).

(define "Description" (= ()
  (should "type is described as 'type'." (= ()
    (assert "type" (type to-string).
).

(define "Indexer" (= ()
  (should "the indexer is a lambda." (= ()
    (assert ($(type ":") is-a lambda).
  ).
  (should "the indexer is a read-only accessor." (= ()
    (assert null (type :"__new_prop" 1).
    (assert ((type "__new_prop") is null).

    (assert null (type :"__new_method" (= x x).
    (assert ($(type "__new_method") is null).
  ).
  (should "type's type is type." (= ()
    (assert type (type type).

    (assert type (type "type").
    (assert type (type (`type).

    (assert type (type :"type").
    (assert type (type :(`type).

    (assert type (type :"type" x).
    (assert type (type :(`type) x).
  ).
  (should "type's proto is a descriptor object." (= ()
    (assert ((type proto) is-an object).

    (assert ((type "proto") is-an object).
    (assert ((type (`proto)) is-an object).

    (assert ((type :"proto") is-an object).
    (assert ((type :(`proto)) is-an object).

    (assert ((type :"proto" x) is-an object).
    (assert ((type :(`proto) x) is-an object).
  ).
  (should "type's proto returns the objectified type." (= ()
    (var t (type proto).
    (assert (t is-an object).
    (assert ((t type) is-an object).
    (assert ((type of t) is object).

    (assert 1 ((object fields-of t) length).

    (var s (object get t "type").
    (assert (s is-an object).
    (assert ((s type) is object).
    (assert ((s proto) is null).

    (print (object fields-of s).
    (assert 7 ((object fields-of s) length).
    (assert ((s name) is "type").
    (assert ((s empty) is type).
    (assert ($(s "of") is-a lambda).
    (assert ($(s "indexer") is-a lambda).
    (assert ($(s "reflect") is-a lambda).
    (assert ($(s "seal") is-a lambda).
    (assert ($(s "is-sealed") is-a lambda).
  ).
).

(define "Evaluation" (=> ()
  (should "type is evaluated to type." (=> ()
    (assert type (type).
  ).
).

(define "Arithmetic Operators" (=> ()
  (should "(++ type) returns 1." (=> ()
    (var x type)
    (assert 1 (++ x).
    (assert 1 x).
  ).
  (should "(-- type) returns -1." (=> ()
    (var x type)
    (assert -1 (-- x).
    (assert -1 x).
  ).
).

(define "Bitwise Operators" (=> ()
  (should "(~ type) returns (~ 0)." (=> ()
    (assert (~ 0) (~ type).

    (var x type)
    (assert (~ 0) (~ x).
  ).
).

(define "General Operators" (=> ()
  (should "(+ type) returns 'type'." (=> ()
    (assert "type" (+ type).
    (assert "typetype" (+ type type).

    (var x type)
    (assert "type" (+ x).
    (assert "typetype" (+ x x).
  ).
).

(define "Logical Operators" (=> ()
  (define "Logical NOT: (! type)" (=> ()
    (should "(! type) returns false." (=> ()
      (assert false (! type).
      (var x type)
      (assert false (! x).
    ).
    (should "(not type) returns false." (=> ()
      (assert false (not type).
      (var x type)
      (assert false (not x).
    ).
  ).
  (define "Logical AND: (type && ...)" (=> ()
    (should "(type &&) returns type." (=> ()
      (assert type (type &&).
      (var x type)
      (assert type (x &&).
    ).
    (should "(type && x) returns x." (=> ()
      (assert true (type && true).
      (var x type)
      (assert true (x && true).
    ).
    (should "(type && x y) returns y." (=> ()
      (assert false (type && true false).
      (var x type)
      (assert false (x && true false).
    ).
    (should "'and' is an alias of '&&'." (=> ()
      (assert (type "and") (type "&&").
      (assert (type "&&") (type "and").
    ).
  ).
  (define "Logical AND Self-Assignment: (type &&= ...)" (=> ()
    (should "(type &&=) returns type." (=> ()
      (assert type (type &&=).
      (var x type)
      (assert type (x &&=).
      (assert type x).
    ).
    (should "(type &&= x) returns x." (=> ()
      (assert true (type &&= true).
      (var x type)
      (assert true (x &&= true).
      (assert true x).
    ).
    (should "(type &&= x y) returns y." (=> ()
      (assert false (type &&= true false).
      (var x type)
      (assert false (x &&= true false).
      (assert false x).
    ).
  ).
  (define "Logical OR: (type || ...)" (=> ()
    (should "(type ||) returns type." (=> ()
      (assert type (type ||).
      (var x type)
      (assert type (x ||).
    ).
    (should "(type || x) returns type." (=> ()
      (assert type (type || 1).
      (var x type)
      (assert type (x || 1).
    ).
    (should "(type || x y) returns type." (=> ()
      (assert type (type || 1 2).
      (var x type)
      (assert type (x || 1 2).
    ).
    (should "'or' is an alias of '||'." (=> ()
      (assert (type "or") (type "||").
      (assert (type "||") (type "or").
    ).
  ).
  (define "Logical OR Self-Assignment: (type ||= ...)" (=> ()
    (should "(type ||=) returns type." (=> ()
      (assert type (type ||=).
      (var x type)
      (assert type (x ||=).
      (assert type x)
    ).
    (should "(type ||= x) returns type." (=> ()
      (assert type (type ||= 1).
      (var x type)
      (assert type (x ||= 1).
      (assert type x)
    ).
    (should "(type ||= x y) returns type." (=> ()
      (assert type (type ||= 1 2).
      (var x type)
      (assert type (x ||= 1 2).
      (assert type x)
    ).
  ).
).

(define "Global Operators" (=> ()
  (define "Boolean Test: (type ? ...)" (=> ()
    (should "Booleanize: (type ?) returns true." (=> ()
      (assert true (type ?).
      (var x type)
      (assert true (x ?).
    ).
    (should "Boolean Fallback: (type ? x) returns type." (=> ()
      (assert type (type ? 1).
      (assert type (type ? (1).
      (var x type)
      (assert type (x ? 1).
      (assert type (x ? (1).
    ).
    (should "Boolean Switch: (type ? x y) returns x." (=> ()
      (var x -1)
      (var y  1)
      (assert -1 (type ? x (++ y).
      (assert 1 y)

      (assert -2 (type ? (-- x) (++ y).
      (assert -2 x)
      (assert 1 y)
    ).
  ).
  (define "Emptiness Test: (type ?* ...)" (=> ()
    (should "Booleanize: (type ?*) returns false." (=> ()
      (assert false (type ?*).
      (var x type)
      (assert false (x ?*).
    ).
    (should "Emptiness Fallback: (type ?* x) returns x." (=> ()
      (assert 1 (type ?* 1).
      (assert 1 (type ?* (1).
      (var x type)
      (assert 1 (x ?* 1).
      (assert 1 (x ?* (1).
    ).
    (should "Emptiness Switch: (type ?* x y) returns y." (=> ()
      (var x -1)
      (var y  1)
      (assert 2 (type ?* x (++ y).
      (assert 2 y)

      (assert 3 (type ?* (-- x) (++ y).
      (assert -1 x)
      (assert 3 y)
    ).
  ).
  (define "Null Test: (type ?? ...)", (=> ()
    (define "Booleanize Null: (type ??)" (=> ()
      (should "(type ??) returns true." (=> ()
        (assert true (type ??).

        (var t type)
        (assert true (t ??).
      ).
    ).
    (define "Null fallback: (type ?? value)" (=> ()
      (should "(type ?? value) returns type." (=> ()
        (var c 0)
        (assert type (type ?? 1).
        (assert type (type ?? (++ c).
        (assert 0 c)

        (var t type)
        (assert type (t ?? 1).
        (assert type (t ?? (++ c).
        (assert 0 c)
      ).
    ).
    (define "Null Switch: (type ?? truthy, falsy)" (=> ()
      (should "(type ?? truthy, falsy) returns truthy." (=> ()
        (let x 1)
        (let y -1)
        (assert 1 (type ?? x y).
        (assert 2 (type ?? (++ x) (-- y).
        (assert 2 x)
        (assert -1 y)
      ).
    ).
  ).
).

(define "Type Reflection" (=> ()
  (should "(type of value) returns the real type of a value." (=> ()
    (assert ((type of null) is null).
    (assert ((type of type) is type).
    (for t in types
      (var tt (t the-type))
      (assert (((type of tt) is type) || ((type of tt) is class).
      (assert ((type of (t "empty")) is tt).
      (for v in (t values)
        (assert ((type of v) is tt).
      ).
  ).
  (should "(type \"indexer\") returns the indexer for all types." (=> ()
    (var indexer (type "indexer").
    (assert ($indexer is-a lambda).
    (assert ($indexer is-bound).
    (for t in types
      (if ((t the-type) is-not-a class)
        (assert ($((t the-type) ":") is-bound).
        (assert ($indexer equals ((t the-type) ":").
      )
    ).
  ).
  (should "(type reflect) returns the object representation of type." (= ()
    (var t (type reflect).
    (assert (t is-an object).
    (assert ((t type) is-an object).
    (assert ((type of t) is object).
    (assert 1 ((object fields-of t) length).

    (for (k v) in t
      (if ($v is-a lambda) (assert ($v is-bound).
      (if ($v is-a function) (assert ($v is-bound).
    ).
    (for (k v) in (t type)
      (if ($v is-a lambda) (assert ($v is-bound).
      (if ($v is-a function) (assert ($v is-bound).
    ).

    (var s (object get t "type").
    (assert (s is-an object).
    (assert ((s type) is object).
    (assert ((s proto) is null).
    (assert 7 ((object fields-of s) length).

    (assert ((s name) is "type").
    (assert ((s empty) is type).

    (assert ($(s "of") is-a lambda).
    (assert ($(s "indexer") is-a lambda).
    (assert ($(s "reflect") is-a lambda).
    (assert ($(s "seal") is-a lambda).
    (assert ($(s "is-sealed") is-a lambda).
  ).
  (should "(type reflect null) returns all common operations defined on null." (= ()
    (var t (type reflect null).
    (assert (t is-an object).
    (assert null (t type).
    (assert ((type of t) is object).

    (const all-fields (@
      "is", "===", "is-not", "!==",
      "equals", "==", "not-equals", "!=", "compares-to",
      "is-empty", "not-empty",
      "is-a", "is-an", "is-not-a", "is-not-an",
      "to-code", "to-string", ":",
      "&&", "and", "&&=", "||", "or", "||=", "?", "?*", "??", "type"
    ).
    (var fields (object fields-of t).
    (for field in fields
      (assert (all-fields first-of field:: >= 0).
    ).
    (assert (all-fields length) (fields length).

    (for (_ v) in t
      (if ($v is-a lambda)
        (assert ($v is-bound).
        (assert null ($v this).
      ).
    ).
  ).
  (should "(type reflect value) returns all common operations bound with value." (= ()
    (var t (type reflect).
    (assert (t is-an object).
    (assert 1 (object fields-of t:: length).
    (assert "type" (t type:: name).

    (let t (type reflect string).
    (assert (t is-an object).
    (assert 1 (object fields-of t:: length).
    (assert "type" (t type:: name).

    (let t (string reflect).
    (assert (t is-an object).
    (assert "string" (t type:: name).
    (assert 0 (t length).

    (let t (string reflect "abc").
    (assert (t is-an object).
    (assert "string" (t type:: name).
    (assert 3 (t length).

    (let t (string reflect 123).
    (assert (t is-an object).
    (assert "string" (t type:: name).
    (assert 0 (t length).

    (let t (string reflect null).
    (assert (t is-an object).
    (assert "string" (t type:: name).
    (assert 0 (t length).
  ).
).

(define "Mutability" (=> ()
  (should "(type is-sealed) returns true." (=> ()
    (assert true (type is-sealed).
  ).
  (should "(type seal) returns type." (=> ()
    (assert type (type seal).
  ).
).
