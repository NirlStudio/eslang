(var (types) (import (samples) from "samples/types").

(define "Identity" (=> ()
  (should "type is and only is type." (=> ()
    (assert (type is type),
    (assert false (type is-not type),

    (assert false (type is),
    (assert false (type is null),
    (assert (type is-not),
    (assert (type is-not null),

    (for t in types
      (assert false (type is (t the-type),
      (assert (type is-not (t the-type),

      (assert false (type is (t "empty"),
      (assert (type is-not (t "empty"),

      (for v in (t values)
        (assert false (type is v),
        (assert (type is-not v),
      ),
).

(define "Identity Operators" (= ()
  (should "'===' is 'is'." (= ()
    (assert (:(type "===") is (type "is"),
  ),
  (should "'!==' is 'is-not'." (= ()
    (assert (:(type "!==") is (type "is-not"),
  ),
).

(define "Equivalence" (= ()
  (should "null's equivalence is identical with its identity." (= ()
    (assert (:(type "equals") is (type "is"),
    (assert (:(type "not-equals") is (type "is-not"),
).

(define "Equivalence Operators" (= ()
  (should "'==' is 'equals'." (= ()
    (assert (:(type "==") is (type "equals"),
  ),
  (should "'!=' is 'not-equals'." (= ()
    (assert (:(type "!=") is (type "not-equals"),
  ),
).

(define "Ordering" (=> ()
  (should "type is only comparable with itself." (=> ()
    (assert 0 (type compare type),

    (assert null (type compare),
    (assert null (type compare null),

    (for t in types
      (assert null (type compare (t the-type),
      (assert null (type compare (t "empty"),
      (for v in (t values)
        (assert null (type compare v),
      ),
).

(define "Type Verification" (=> ()
  (should "type is an instance of its proto." (=> ()
    (assert (type is-a type),
    (assert false (type is-not-a type),

    (assert false (type is-a),
    (assert false (type is-a null),
    (assert (type is-not-a),
    (assert (type is-not-a null),

    (for t in types
      (assert false (type is-a (t the-type),
      (assert (type is-not-a (t the-type),
    ),
).

(define "Emptiness" (= ()
  (should "type is an empty value." (= ()
    (assert ((type empty) is type),
    (assert (type is (type empty)),

    (assert (type is-empty),
    (assert false (type not-empty),
).

(define "Encoding" (= ()
  (should "type is encoded to (` type)." (= ()
    (assert (` type) (type to-code),
).

(define "Description" (= ()
  (should "type is described as 'type'." (= ()
    (assert "type" (type to-string),
).

(define "Indexer" (= ()
  (should "the indexer is a lambda." (= ()
    (assert (:(type ":") is-a lambda),
  ),
  (should "the indexer is a readonly accessor." (= ()
    (assert null (type :"__new_prop" 1),
    (assert ((type "__new_prop") is null),

    (assert null (type :"__new_method" (= x x),
    (assert (:(type "__new_method") is null),
  ),
  (should "type's type is type." (= ()
    (assert type (type type),

    (assert type (type "type"),
    (assert type (type (`type),

    (assert type (type :"type"),
    (assert type (type :(`type),

    (assert type (type :"type" x),
    (assert type (type :(`type) x),
  ),
  (should "type's proto is a descriptor object." (= ()
    (assert ((type proto) is-a object),

    (assert ((type "proto") is-a object),
    (assert ((type (`proto)) is-a object),

    (assert ((type :"proto") is-a object),
    (assert ((type :(`proto)) is-a object),

    (assert ((type :"proto" x) is-a object),
    (assert ((type :(`proto) x) is-a object),
  ),
  (should "type's proto returns the objectified type." (= ()
    (var t (type proto),
    (assert (t is-a object),
    (assert ((t type) is object),

    (assert 1 ((object fields-of t) length),

    (var s (t static),
    (assert (s is-a object),
    (assert ((s type) is object),
    (assert ((s proto) is null),

    (assert 6 ((object fields-of s) length),
    (assert ((s name) is "type"),
    (assert ((s empty) is type),
    (assert (:(s "of") is-a lambda),
    (assert (:(s "indexer") is-a lambda),
    (assert (:(s "objectify") is-a lambda),
    (assert (:(s "typify") is-a lambda),
  ),
).

(define "Type Reflection" (=> ()
  (should "(type of value) returns the real type of a value." (=> ()
    (assert ((type of null) is null),
    (assert ((type of type) is type),
    (for t in types
      (var tt (t the-type))
      (assert (((type of tt) is type) || ((type of tt) is class),
      (assert ((type of (t "empty")) is tt),
      (for v in (t values)
        (assert ((type of v) is tt),
      ),
  ),
  (should "(type \"indexer\") returns the indexer for all types." (=> ()
    (var indexer (type "indexer"),
    (assert (:indexer is-a lambda),
    (for t in types
      (assert (:indexer is ((t the-type) ":"),
    ),
  ),
  (should "(type objectify) returns the object representation of type." (= ()
    (var t (type objectify),
    (assert (t is-a object),
    (assert ((t type) is object),
    (assert 1 ((object fields-of t) length),

    (var s (t static),
    (assert (s is-a object),
    (assert ((s type) is object),
    (assert ((s proto) is null),
    (assert 6 ((object fields-of s) length),

    (assert ((s name) is "type"),
    (assert ((s empty) is type),

    (assert (:(s "of") is-a lambda),
    (assert (:(s "indexer") is-a lambda),
    (assert (:(s "objectify") is-a lambda),
    (assert (:(s "typify") is-a lambda),
  ),
  (should "((type \"objectify\") ) returns all universal operations defined on null." (= ()
    (var t ((type "objectify") ),
    (assert (t is-a object),

    (var fields (object fields-of t),
    (assert 20 (fields length),

    (for field in fields
      (assert (null :field) (object get t field),
    ),
  ),
  (should "(type typify ...) extends type with type descriptor(s)." (=> ()
    (assert null (type "__type_prop"),
    (assert null (type "__type_method"),

    (assert null (bool "__inst_prop"),
    (assert null (bool "__inst_method"),

    (type typify (@
      __inst_prop: 1
      __inst_method: (= x (+ x (:this __inst_prop),
      static: (@
        __type_prop: 10
        __type_method: (=> y (+ y (this __type_prop),
    ),

    (assert 1 (type "__inst_prop"),
    (assert (:(type "__inst_method") is-a lambda),
    (assert 11 (type __inst_method 10),

    (assert 10 (type "__type_prop"),
    (assert (:(type "__type_method") is-a function),
    (assert 110 (type __type_method 100),

    (for t in types
      (var tt (t the-type))
      (assert 1 (tt "__inst_prop"),
      (assert (:(tt "__inst_method") is-a lambda),
      (assert 11 (tt __inst_method 10),

      (assert 10 (tt "__type_prop"),
      (assert (:(tt "__type_method") is-a function),
      (assert 110 (tt __type_method 100),

      (var te (t "empty"))
      (assert 1 (:te "__inst_prop"),
      (assert (:(:te "__inst_method") is-a lambda),
      (assert 11 (:te __inst_method 10),

      (assert (? (tt is class) 10) (:te "__type_prop"),
      (assert (:(:te "__type_method") is-a (? (tt is class) function),
      (assert (? (tt is class) 110) (:te __type_method 100),

      (for v in (t values)
        (assert 1 (:v "__inst_prop"),
        (assert (:(:v "__inst_method") is-a lambda),
        (assert 11 (:v __inst_method 10),

        (assert (? (tt is class) 10)  (:v "__type_prop"),
        (assert (:(:v "__type_method") is-a (? (tt is class) function),
        (assert (? (tt is class) 110)  (:v __type_method 100),
      ),
    ),
).
