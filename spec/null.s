(define "Identity" (= ()
  (should "null is and only is itself." (= ()
    (assert (null is),
    (assert (null is null),
    (assert false (null is-not),
    (assert false (null is-not null),

    (assert false (null is type),
    (assert (null is-not type),

    (assert false (null is bool),
    (assert (null is-not bool),
    (assert false (null is false),
    (assert (null is-not false),
    (assert false (null is true),
    (assert (null is-not true),

    (assert false (null is string),
    (assert (null is-not string),
    (assert false (null is (string empty),
    (assert (null is-not (string empty),
    (assert false (null is "A"),
    (assert (null is-not "A"),

    (assert false (null is number),
    (assert (null is-not number),
    (assert false (null is 0),
    (assert (null is-not 0),
    (assert false (null is 1),
    (assert (null is-not 1),
    (assert false (null is -1),
    (assert (null is-not -1),
    (assert false (null is (number invalid),
    (assert (null is-not (number invalid),
    (assert false (null is (number infinite),
    (assert (null is-not (number infinite),
    (assert false (null is (number -infinite),
    (assert (null is-not (number -infinite),

    (assert false (null is date),
    (assert (null is-not date),
    (assert false (null is (date empty),
    (assert (null is-not (date empty),
    (assert false (null is (date now),
    (assert (null is-not (date now),

    (assert false (null is range),
    (assert (null is-not range),
    (assert false (null is (range empty),
    (assert (null is-not (range empty),
    (assert false (null is (1 10),
    (assert (null is-not (1 10),

    (assert false (null is symbol),
    (assert (null is-not symbol),
    (assert false (null is (symbol empty),
    (assert (null is-not (symbol empty),
    (assert false (null is (` x),
    (assert (null is-not (` x),

    (assert false (null is tuple),
    (assert (null is-not tuple),
    (assert false (null is (tuple empty),
    (assert (null is-not (tuple empty),
    (assert false (null is (` (x y),
    (assert (null is-not (` (x y),

    (assert false (null is operator),
    (assert (null is-not operator),
    (assert false (null is (operator empty),
    (assert (null is-not (operator empty),
    (assert false (null is (=? X (X),
    (assert (null is-not (=? X (X),

    (assert false (null is lambda),
    (assert (null is-not lambda),
    (assert false (null is (lambda empty),
    (assert (null is-not (lambda empty),
    (assert false (null is (= x x),
    (assert (null is-not (= x x),

    (assert false (null is function),
    (assert (null is-not function),
    (assert false (null is (function empty),
    (assert (null is-not (function empty),
    (assert false (null is (=> x x),
    (assert (null is-not (=> x x),

    (assert false (null is array),
    (assert (null is-not array),
    (assert false (null is (array empty),
    (assert (null is-not (array empty),
    (assert false (null is (@ 1),
    (assert (null is-not (@ 1),

    (assert false (null is object),
    (assert (null is-not object),
    (assert false (null is (object empty),
    (assert (null is-not (object empty),
    (assert false (null is (@ x: 1),
    (assert (null is-not (@ x: 1),

    (assert false (null is class),
    (assert (null is-not class),
    (assert false (null is (class empty),
    (assert (null is-not (class empty),

    (var summer (@:class add: (= (x y) (+ x y),
    (assert false (null is summer),
    (assert (null is-not summer),
    (assert false (null is (summer empty),
    (assert (null is-not (summer empty),
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

(define "Ordering" (= ()
  (should "null is only comparable with itself." (= ()
    (assert 0 (null compare),
    (assert 0 (null compare null),

    (assert null (null compare type),

    (assert null (null compare string),
    (assert null (null compare ""),
    (assert null (null compare "A"),

    (assert null (null compare bool),
    (assert null (null compare false),
    (assert null (null compare true),

    (assert null (null compare number),
    (assert null (null compare 0),
    (assert null (null compare 1),
    (assert null (null compare -1),
    (assert null (null compare (number invalid),
    (assert null (null compare (number infinite),
    (assert null (null compare (number -infinite),

    (assert null (null compare date),
    (assert null (null compare (date empty),
    (assert null (null compare (date now),

    (assert null (null compare range),
    (assert null (null compare (range empty),
    (assert null (null compare (1 10),

    (assert null (null compare symbol),
    (assert null (null compare (symbol empty),
    (assert null (null compare (` x),

    (assert null (null compare tuple),
    (assert null (null compare (tuple empty),
    (assert null (null compare (` (x y),

    (assert null (null compare operator),
    (assert null (null compare (operator empty),
    (assert null (null compare (=? X (X),

    (assert null (null compare lambda),
    (assert null (null compare (lambda empty),
    (assert null (null compare (= x x),

    (assert null (null compare function),
    (assert null (null compare (function empty),
    (assert null (null compare (=> x x),

    (assert null (null compare array),
    (assert null (null compare (array empty),
    (assert null (null compare (@ 1),

    (assert null (null compare object),
    (assert null (null compare (object empty),
    (assert null (null compare (@ x: 1),

    (assert null (null compare class),
    (assert null (null compare (class empty),

    (var summer (@:class add: (= (x y) (+ x y),
    (assert null (null compare summer),
    (assert null (null compare (summer empty),
).

(define "Type Verification" (= ()
  (should "null is the type of itself." (= ()
    (assert (null is-a),
    (assert (null is-a null),
    (assert false (null is-not-a),
    (assert false (null is-not-a null),

    (assert false (null is-a type),
    (assert (null is-not-a type),

    (assert false (null is-a bool),
    (assert (null is-not-a bool),

    (assert false (null is-a string),
    (assert (null is-not-a string),

    (assert false (null is-a number),
    (assert (null is-not-a number),

    (assert false (null is-a date),
    (assert (null is-not-a date),

    (assert false (null is-a range),
    (assert (null is-not-a range),

    (assert false (null is-a symbol),
    (assert (null is-not-a symbol),

    (assert false (null is-a tuple),
    (assert (null is-not-a tuple),

    (assert false (null is-a operator),
    (assert (null is-not-a operator),

    (assert false (null is-a lambda),
    (assert (null is-not-a lambda),

    (assert false (null is-a function),
    (assert (null is-not-a function),

    (assert false (null is-a object),
    (assert (null is-not-a object),

    (assert false (null is-a class),
    (assert (null is-not-a class),

    (assert false (null is-a (class empty),
    (assert (null is-not-a (class empty),
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

(define "Evaluation" (= ()
  (should "null is evaluated to null." (= ()
    (assert null (null),
    (assert null (null null),
    (assert null (null type),
    (assert null (null false),
    (assert null (null ""),
    (assert null (null 0),
    (assert null (null (date empty),
    (assert null (null (range empty),
    (assert null (null (tuple empty),
    (assert null (null (operator empty),
    (assert null (null (lambda empty),
    (assert null (null (function empty),
    (assert null (null (array empty),
    (assert null (null (object empty),
    (assert null (null (class empty),
    (assert null (null ((class empty) empty),
  ),
).
