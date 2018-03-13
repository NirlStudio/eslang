(define "Identity" (= ()
  (should "type is and only is type." (= ()
    (assert (type is type),
    (assert false (type is-not type),

    (assert false (type is),
    (assert false (type is null),
    (assert (type is-not),
    (assert (type is-not null),

    (assert false (type is bool),
    (assert (type is-not bool),
    (assert false (type is false),
    (assert (type is-not false),
    (assert false (type is true),
    (assert (type is-not true),

    (assert false (type is string),
    (assert (type is-not string),
    (assert false (type is (string empty),
    (assert (type is-not (string empty),
    (assert false (type is "A"),
    (assert (type is-not "A"),

    (assert false (type is number),
    (assert (type is-not number),
    (assert false (type is 0),
    (assert (type is-not 0),
    (assert false (type is 1),
    (assert (type is-not 1),
    (assert false (type is -1),
    (assert (type is-not -1),
    (assert false (type is (number invalid),
    (assert (type is-not (number invalid),
    (assert false (type is (number infinite),
    (assert (type is-not (number infinite),
    (assert false (type is (number -infinite),
    (assert (type is-not (number -infinite),

    (assert false (type is date),
    (assert (type is-not date),
    (assert false (type is (date empty),
    (assert (type is-not (date empty),
    (assert false (type is (date now),
    (assert (type is-not (date now),

    (assert false (type is range),
    (assert (type is-not range),
    (assert false (type is (range empty),
    (assert (type is-not (range empty),
    (assert false (type is (1 10),
    (assert (type is-not (1 10),

    (assert false (type is symbol),
    (assert (type is-not symbol),
    (assert false (type is (symbol empty),
    (assert (type is-not (symbol empty),
    (assert false (type is (` x),
    (assert (type is-not (` x),

    (assert false (type is tuple),
    (assert (type is-not tuple),
    (assert false (type is (tuple empty),
    (assert (type is-not (tuple empty),
    (assert false (type is (` (x y),
    (assert (type is-not (` (x y),

    (assert false (type is operator),
    (assert (type is-not operator),
    (assert false (type is (operator empty),
    (assert (type is-not (operator empty),
    (assert false (type is (=? X (X),
    (assert (type is-not (=? X (X),

    (assert false (type is lambda),
    (assert (type is-not lambda),
    (assert false (type is (lambda empty),
    (assert (type is-not (lambda empty),
    (assert false (type is (= x x),
    (assert (type is-not (= x x),

    (assert false (type is function),
    (assert (type is-not function),
    (assert false (type is (function empty),
    (assert (type is-not (function empty),
    (assert false (type is (=> x x),
    (assert (type is-not (=> x x),

    (assert false (type is array),
    (assert (type is-not array),
    (assert false (type is (array empty),
    (assert (type is-not (array empty),
    (assert false (type is (@ 1),
    (assert (type is-not (@ 1),

    (assert false (type is object),
    (assert (type is-not object),
    (assert false (type is (object empty),
    (assert (type is-not (object empty),
    (assert false (type is (@ x: 1),
    (assert (type is-not (@ x: 1),

    (assert false (type is class),
    (assert (type is-not class),
    (assert false (type is (class empty),
    (assert (type is-not (class empty),

    (var summer (@:class add: (= (x y) (+ x y),
    (assert false (type is summer),
    (assert (type is-not summer),
    (assert false (type is (summer empty),
    (assert (type is-not (summer empty),
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

(define "Ordering" (= ()
  (should "type is only comparable with itself." (= ()
    (assert 0 (type compare type),

    (assert null (type compare),
    (assert null (type compare null),

    (assert null (type compare string),
    (assert null (type compare ""),
    (assert null (type compare "A"),

    (assert null (type compare bool),
    (assert null (type compare false),
    (assert null (type compare true),

    (assert null (type compare number),
    (assert null (type compare 0),
    (assert null (type compare 1),
    (assert null (type compare -1),
    (assert null (type compare (number invalid),
    (assert null (type compare (number infinite),
    (assert null (type compare (number -infinite),

    (assert null (type compare date),
    (assert null (type compare (date empty),
    (assert null (type compare (date now),

    (assert null (type compare range),
    (assert null (type compare (range empty),
    (assert null (type compare (1 10),

    (assert null (type compare symbol),
    (assert null (type compare (symbol empty),
    (assert null (type compare (` x),

    (assert null (type compare tuple),
    (assert null (type compare (tuple empty),
    (assert null (type compare (` (x y),

    (assert null (type compare operator),
    (assert null (type compare (operator empty),
    (assert null (type compare (=? X (X),

    (assert null (type compare lambda),
    (assert null (type compare (lambda empty),
    (assert null (type compare (= x x),

    (assert null (type compare function),
    (assert null (type compare (function empty),
    (assert null (type compare (=> x x),

    (assert null (type compare array),
    (assert null (type compare (array empty),
    (assert null (type compare (@ 1),

    (assert null (type compare object),
    (assert null (type compare (object empty),
    (assert null (type compare (@ x: 1),

    (assert null (type compare class),
    (assert null (type compare (class empty),

    (var summer (@:class add: (= (x y) (+ x y),
    (assert null (type compare summer),
    (assert null (type compare (summer empty),
).

(define "Type Verification" (= ()
  (should "type is an instance of its proto." (= ()
    (assert (type is-a type),
    (assert false (type is-not-a type),

    (assert false (type is-a),
    (assert false (type is-a null),
    (assert (type is-not-a),
    (assert (type is-not-a null),

    (assert false (type is-a bool),
    (assert (type is-not-a bool),

    (assert false (type is-a string),
    (assert (type is-not-a string),

    (assert false (type is-a number),
    (assert (type is-not-a number),

    (assert false (type is-a date),
    (assert (type is-not-a date),

    (assert false (type is-a range),
    (assert (type is-not-a range),

    (assert false (type is-a symbol),
    (assert (type is-not-a symbol),

    (assert false (type is-a tuple),
    (assert (type is-not-a tuple),

    (assert false (type is-a operator),
    (assert (type is-not-a operator),

    (assert false (type is-a lambda),
    (assert (type is-not-a lambda),

    (assert false (type is-a function),
    (assert (type is-not-a function),

    (assert false (type is-a object),
    (assert (type is-not-a object),

    (assert false (type is-a class),
    (assert (type is-not-a class),

    (assert false (type is-a (class empty),
    (assert (type is-not-a (class empty),
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

    (assert 5 ((object fields-of s) length),
    (assert ((s name) is "type"),
    (assert ((s empty) is type),
    (assert (:(s "of") is-a lambda),
    (assert (:(s "objectify") is-a lambda),
    (assert (:(s "typify") is-a lambda),
  ),
).

(define "Type Reflection" (= ()
  (should "(type of value) returns the real type of a value." (= ()
    (assert ((type of null) is null),
    (assert ((type of type) is type),

    (assert ((type of bool) is type),
    (assert ((type of false) is bool),
    (assert ((type of true) is bool),

    (assert ((type of string) is type),
    (assert ((type of "") is string),
    (assert ((type of "A") is string),

    (assert ((type of number) is type),
    (assert ((type of 0) is number),
    (assert ((type of 1) is number),
    (assert ((type of -1) is number),
    (assert ((type of (number invalid)) is number),
    (assert ((type of (number infinite)) is number),
    (assert ((type of (number -infinite)) is number),

    (assert ((type of date) is type),
    (assert ((type of (date empty)) is date),
    (assert ((type of (date now)) is date),

    (assert ((type of range) is type),
    (assert ((type of (range empty)) is range),
    (assert ((type of (1 10)) is range),

    (assert ((type of symbol) is type),
    (assert ((type of (symbol empty)) is symbol),
    (assert ((type of (` x)) is symbol),

    (assert ((type of tuple) is type),
    (assert ((type of (tuple empty)) is tuple),
    (assert ((type of (` (x y))) is tuple),

    (assert ((type of lambda) is type),
    (assert ((type of (lambda empty)) is lambda),
    (assert ((type of (= x x)) is lambda),

    (assert ((type of function) is type),
    (assert ((type of (function empty)) is function),
    (assert ((type of (=> x x)) is function),

    (assert ((type of operator) is type),
    (assert ((type of (operator empty)) is operator),
    (assert ((type of (=? X (X))) is operator),

    (assert ((type of array) is type),
    (assert ((type of (array empty)) is array),
    (assert ((type of (@ 1 2)) is array),

    (assert ((type of object) is type),
    (assert ((type of (object empty)) is object),
    (assert ((type of (@ x: 1 y: 2)) is object),
    (assert ((type of (@ type: string)) is object),
    # indexer returns the field value.
    (assert (((@ type: string) type) is string),

    (assert ((type of class) is type),
    (assert ((type of (class empty)) is class),

    (var summer (@:class type: string add: (= (x y) (+ x y),
    (assert ((summer type) is class),
    (assert ((type of summer) is class),

    (var sum (summer default),
    (assert ((sum type) is summer),
    (assert ((type of sum) is summer),

    (sum "type" bool)
    (assert ((sum type) is bool),
    (assert ((type of sum) is summer),
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
    (assert 5 ((object fields-of s) length),

    (assert ((s name) is "type"),
    (assert ((s empty) is type),

    (assert (:(s "of") is-a lambda),
    (assert (:(s "objectify") is-a lambda),
    (assert (:(s "typify") is-a lambda),
  ),
  (should "((type \"objectify\") ) returns all universal operations defined on null." (= ()
    (var t ((type "objectify") ),

    (var fields (object fields-of t),
    (assert 20 (fields length),

    (for field in fields
      (assert (null :field) (object get t field),
    ),
  ),
  (should "(type typify ...) extends type with type descriptor(s)." (= ()
    (assert null (type "__type_prop"),
    (assert null (type "__type_method"),

    (assert null (bool "__inst_prop"),
    (assert null (bool "__inst_method"),

    (type typify (@
      __inst_prop: 1
      __inst_method: (= x (+ x (this __inst_prop),
      static: (@
        __type_prop: 10
        __type_method: (=> y (+ y (this __type_prop),
    ),

    (assert 10 (type "__type_prop"),
    (assert (:(type "__type_method") is-a function),
    (assert 110 (type __type_method 100),

    (assert 1 (bool "__inst_prop"),
    (assert (:(bool "__inst_method") is-a lambda),
    (assert 11 (bool __inst_method 10),

    (assert 1 (string "__inst_prop"),
    (assert (:(string "__inst_method") is-a lambda),
    (assert 11 (string __inst_method 10),

    (assert 1 (number "__inst_prop"),
    (assert (:(number "__inst_method") is-a lambda),
    (assert 11 (number __inst_method 10),

    (assert 1 (date "__inst_prop"),
    (assert (:(date "__inst_method") is-a lambda),
    (assert 11 (date __inst_method 10),

    (assert 1 (range "__inst_prop"),
    (assert (:(range "__inst_method") is-a lambda),
    (assert 11 (range __inst_method 10),

    (assert 1 (symbol "__inst_prop"),
    (assert (:(symbol "__inst_method") is-a lambda),
    (assert 11 (symbol __inst_method 10),

    (assert 1 (tuple "__inst_prop"),
    (assert (:(tuple "__inst_method") is-a lambda),
    (assert 11 (tuple __inst_method 10),

    (assert 1 (operator "__inst_prop"),
    (assert (:(operator "__inst_method") is-a lambda),
    (assert 11 (operator __inst_method 10),

    (assert 1 (lambda "__inst_prop"),
    (assert (:(lambda "__inst_method") is-a lambda),
    (assert 11 (lambda __inst_method 10),

    (assert 1 (function "__inst_prop"),
    (assert (:(function "__inst_method") is-a lambda),
    (assert 11 (function __inst_method 10),

    (assert 1 (array "__inst_prop"),
    (assert (:(array "__inst_method") is-a lambda),
    (assert 11 (array __inst_method 10),

    (assert 1 (object "__inst_prop"),
    (assert (:(object "__inst_method") is-a lambda),
    (assert 11 (object __inst_method 10),

    (assert 1 (class "__inst_prop"),
    (assert (:(class "__inst_method") is-a lambda),
    (assert 11 (class __inst_method 10),

    (assert 1 ((class empty) "__inst_prop"),
    (assert (:((class empty) "__inst_method") is-a lambda),
    (assert 11 ((class empty) __inst_method 10),

).
