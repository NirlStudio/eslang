################################################################################
# the shared test code for all types
(the-type ?? (warn "the type to be tested is not defined.").
(var (the-value the-empty other-types) (=> :()
  (var (choose) (import "samples/types"),
  (var (target others) (choose the-type),
  (@ ((target values) :0) (target "empty") others)
).
################################################################################
(define ((the-type name) + " type") (=> ()
  (define "Type & Value." (=> ()
    (should "a type's type is the type." (=> ()
      (assert (the-type is-a type),
      (assert false (the-type is-not-a type),

      (assert false (the-type is-a null),
      (assert (the-type is-not-a null),

      (assert false (the-type is-a),
      (assert (the-type is-not-a),
    ),
    (should "the type of the value is the type." (=> ()
      (assert (:the-value is-a the-type),
      (assert false (:the-value is-not-a the-type),

      (assert ((:the-value type) is the-type),
      (assert false ((:the-value type) is-not the-type),
    ),
    (should "the type of the empty value is the type." (=> ()
      (assert (:the-empty is-a the-type),
      (assert false (:the-empty is-not-a the-type),

      (assert ((:the-empty type) is the-type),
      (assert false ((:the-empty type) is-not the-type),
    ),
  ),

  (define "Identity" (=> ()
    (should "a type is itself." (=> ()
      (assert (the-type is the-type),
      (assert false (the-type is-not the-type),
    ),
    (should "a type is not null." (=> ()
      (assert false (the-type is null),
      (assert (the-type is-not null),

      (assert false (the-type is),
      (assert (the-type is-not),
    ),
    (should "a type is not the type." (=> ()
      (assert false (the-type is type),
      (assert (the-type is-not type),
    ),
  ),

  (define "Identity Operators" (= ()
    (should "'===' is 'is'." (= ()
      (assert (:(the-type "===") is (the-type "is"),
    ),
    (should "'!==' is 'is-not'." (= ()
      (assert (:(the-type "!==") is (the-type "is-not"),
    ),
  ),

  (define "Equivalence" (=> ()
    (should "type is equivalent with itself." (=> ()
      (assert (the-type equals the-type),
      (assert false (the-type not-equals the-type),

      (assert false (the-type equals null),
      (assert (the-type not-equals null),

      (assert false (the-type equals type),
      (assert (the-type not-equals type),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "type is equivalent with itself" (=> ()
      (assert (the-type == the-type),
      (assert false (the-type != the-type),

      (assert false (the-type == null),
      (assert (the-type != null),

      (assert false (the-type == type),
      (assert (the-type != type),
  ),

  (define "Ordering" (=> ()
    (should "type is only comparable with itself." (=> ()
      (assert 0 (the-type compare the-type),
      (assert null (the-type compare type),
      (assert null (the-type compare null),
      (assert null (the-type compare false),
      (assert null (the-type compare 0),
      (assert null (the-type compare ""),
      (assert null (the-type compare (@:),
  ),

  (define "Type Verification" (=> ()
    (should "a type is an instance of type." (=> ()
      (assert (the-type is-a type),
      (assert false (the-type is-not-a type),
    ),
    (should "a type is not an instance of itself." (=> ()
      (assert false (the-type is-a the-type),
      (assert (the-type is-not-a the-type),
  ),

  (define "Emptiness" (=> ()
    (should "a type is not an empty value." (=> ()
      (assert false (the-type is-empty),
      (assert (the-type not-empty),
  ),

  (define "Encoding" (=> ()
    (should "a type is encoded to a symbol." (=> ()
      (assert (symbol of (the-type name)) (the-type to-code),
  ),

  (define "Description" (=> ()
    (should "a type is described as its name." (=> ()
      (assert (the-type name) (the-type to-string),
  ),

  (define "Indexer" (=> ()
    (should "a type's type is type." (=> ()
      (assert type (the-type "type"),
  ),
  (define "Value" (=> ()
    (should "the sample value is an instance of this type" (=> ()
      (assert (:the-value is-a the-type),
      (assert false (:the-value is-not-a the-type)
    ),
    (should "the sample value's type is this type" (=> ()
      (assert the-type (:the-value type),
    ),
).
