# the shared test code for types
# the-type: the type to be tested
# the-value: a sample value to be tested.

(let the-type-name (the-type name).

(define (the-type-name + " type") (=> ()
  (define "Identity" (=> ()
    (should "a type is only itself" (= ()
      (assert (the-type  is the-type),
      (assert false (the-type  is-not the-type),

    (should "a type is not null" (=> ()
      (assert false (the-type  is null),
      (assert (the-type  is-not null),

    (should "a type is not type" (=> ()
      (assert false (the-type  is type),
      (assert (the-type  is-not type),
  ),

  (define "Equivalence" (=> ()
    (should "type is equivalent with itself" (=> ()
      (assert (the-type  equals the-type),
      (assert false (the-type  not-equals the-type),

      (assert false (the-type  equals null),
      (assert (the-type  not-equals null),

      (assert false (the-type  equals type),
      (assert (the-type  not-equals type),
  ),

  (define "Equivalence (operators)" (=> ()
    (should "type is equivalent with itself" (=> ()
      (assert (the-type  == the-type),
      (assert false (the-type  != the-type),

      (assert false (the-type  == null),
      (assert (the-type  != null),

      (assert false (the-type  == type),
      (assert (the-type  != type),
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
      (assert (the-type  is-a type),
      (assert false (the-type  is-not-a type),
    ),
    (should "a type is not an instance of itself." (=> ()
      (assert false (the-type  is-a the-type),
      (assert (the-type  is-not-a the-type),
  ),

  (define "Emptiness" (=> ()
    (should "a type is not an empty value." (=> ()
      (assert false (the-type  is-empty),
      (assert (the-type  not-empty),
  ),

  (define "Encoding" (=> ()
    (should "a type is encoded to a symbol." (=> ()
      (assert (symbol of (the-type  name)) (the-type  to-code),
  ),

  (define "Description" (=> ()
    (should "a type is described as its name." (=> ()
      (assert (the-type  name) (the-type  to-string),
  ),

  (define "Indexer" (=> ()
    (should "the indexer is not readable directly." (=> ()
      (assert null (the-type  ":"),
    ),
    (should "a type's type is type." (=> ()
      (assert type (the-type  "type"),
  ),
  (define "Value" (=> ()
    (should "the sample value is an instance of this type" (= ()
      (assert (the-value is-a the-type),
      (assert false (the-value is-not-a the-type)
    ),
    (should "the sample value's type is this type" (= ()
      (assert the-type (the-value type),
    ),
    (should "the sample value's indexer is not readable directly" (= ()
      (assert null (the-value ":"),
    ),
).
