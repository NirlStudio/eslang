(define "Identity" (= ()
  (should "type is only itself" (= ()
    (assert (type is type),
    (assert false (type is-not type),
  (should "type is not null" (= ()
    (assert false (type is),
    (assert false (type is null),
    (assert (type is-not),
    (assert (type is-not null),
).

(define "Equivalence" (= ()
  (should "type is equivalent with itself" (= ()
    (assert (type equals type),
    (assert false (type not-equals type),

    (assert false (type equals null),
    (assert (type not-equals null),
).

(define "Equivalence (operators)" (= ()
  (should "type is equivalent with itself" (= ()
    (assert (type == type),
    (assert false (type != type),

    (assert false (type == null),
    (assert (type != null),
).

(define "Ordering" (= ()
  (should "type is only comparable with itself." (= ()
    (assert 0 (type compare type),
    (assert null (type compare null),
    (assert null (type compare false),
    (assert null (type compare 0),
    (assert null (type compare ""),
    (assert null (type compare (@:),
).

(define "Type Verification" (= ()
  (should "type is an instance of its proto." (= ()
    (assert (type is-a type),
    (assert false (type is-not-a type)
).

(define "Emptiness" (= ()
  (should "type is not an empty value." (= ()
    (assert (type is-empty),
    (assert false (type not-empty),
).

(define "Encoding" (= ()
  (should "type is encoded to a symbol." (= ()
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
    (assert type (type "type"),
).
