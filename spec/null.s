(define "Identity" (= ()
  (should "null is only itself." (= ()
    (assert (null is null),
    (assert false (null is-not null),

    (assert false (null is false),
    (assert (null is-not false),

    (assert false (null is 0),
    (assert (null is-not 0),

    (assert false (null is ""),
    (assert (null is-not ""),

    (assert false (null is (@:),
    (assert (null is-not (@:),
).

(define "Equivalence" (= ()
  (should "null is only equivalent with itself." (= ()
    (assert (null equals null),
    (assert false (null not-equals null),

    (assert false (null equals false),
    (assert (null not-equals false),

    (assert false (null equals 0),
    (assert (null not-equals 0),

    (assert false (null equals ""),
    (assert (null not-equals ""),

    (assert false (null equals (= ),
    (assert (null not-equals (= ),

    (assert false (null equals (@:),
    (assert (null not-equals (@:),
).

(define "Equivalence (operators)" (= ()
  (should "null is only equivalent with itself." (= ()
    (assert (null == null),
    (assert false (null != null),

    (assert false (null == false),
    (assert (null != false),

    (assert false (null == 0),
    (assert (null != 0),

    (assert false (null == ""),
    (assert (null != ""),

    (assert false (null == (@:),
    (assert (null != (@:),
).

(define "Ordering" (= ()
  (should "null is only comparable with itself." (= ()
    (assert 0 (null compare null),
    (assert null (null compare false),
    (assert null (null compare 0),
    (assert null (null compare ""),
    (assert null (null compare (@:),
).

(define "Type Verification" (= ()
  (should "null is the type of itself." (= ()
    (assert (null is-a null),
    (assert false (null is-not-a null),

    (assert false (null is-a bool),
    (assert (null is-not-a bool),

    (assert false (null is-a number),
    (assert (null is-not-a number),

    (assert false (null is-a string),
    (assert (null is-not-a string),

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
  (should "null's type is null." (= ()
    (assert null (null "type"),
).
