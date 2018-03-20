################################################################################
# the shared test code for all types
(the-type ?? (warn "the type to be tested is not defined.").
(var (the-values the-empty other-types) (=> :()
  (var (choose) (import "samples/types"),
  (var (target others) (choose the-type),
  (@ (target values) (target "empty") others)
).
################################################################################
(define ((the-type name) + " type") (=> ()
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
    (should "a type is not any other type or value." (=> ()
      (for t in types
        (assert false (the-type is (t the-type),
        (assert (the-type is-not (t the-type),

        (assert false (the-type is (t "empty"),
        (assert (the-type is-not (t "empty"),

        (for v in (t values)
          (assert false (the-type is v),
          (assert (the-type is-not v),
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
    (should "type equals with itself." (=> ()
      (assert (the-type equals the-type),
      (assert false (the-type not-equals the-type),
    ),
    (should "type does not equal with null." (=> ()
      (assert false (the-type equals),
      (assert (the-type not-equals),

      (assert false (the-type equals null),
      (assert (the-type not-equals null),
    ),
    (should "type does not equal with type." (=> ()
      (assert false (the-type equals type),
      (assert (the-type not-equals type),
    ),
    (should "a type does not equal any other type or value." (=> ()
      (for t in types
        (assert false (the-type equals (t the-type),
        (assert (the-type not-equals (t the-type),

        (assert false (the-type equals (t "empty"),
        (assert (the-type not-equals (t "empty"),

        (for v in (t values)
          (assert false (the-type equals v),
          (assert (the-type not-equals v),
        ),
  ),

  (define "Equivalence Operators" (=> ()
    (should "'==' is 'equals'." (= ()
      (assert (:(the-type "==") is (the-type "equals"),
    ),
    (should "'!=' is 'not-equals'." (= ()
      (assert (:(the-type "!=") is (the-type "not-equals"),
    ),
  ),

  (define "Ordering" (=> ()
    (should "type is only comparable with itself." (=> ()
      (assert 0 (the-type compare the-type),

      (assert null (the-type compare),
      (assert null (the-type compare null),
      (assert null (null compare the-type),

      (assert null (the-type compare type),
      (assert null (type compare the-type),

      (for t in types
        (assert null (the-type compare (t the-type),
        (assert null ((t the-type) compare the-type),

        (assert null (the-type compare (t "empty"),
        (assert null ((t "empty") compare the-type),

        (for v in (t values)
          (assert null (the-type compare v),
          (assert null (v compare the-type),
        ),
  ),

  (define "Type Verification" (=> ()
    (should "a common type's type is the type." (=> ()
      (assert (the-type is-a type),
      (assert false (the-type is-not-a type),

      (assert ((the-type type) is type),
      (assert false ((the-type type) is-not type),
    ),
    (should "a common type is not an instance of itself." (=> ()
      (assert false (the-type is-a the-type),
      (assert (the-type is-not-a the-type),
    ),
    (should "a common type's type is not null." (=> ()
      (assert false (the-type is-a null),
      (assert (the-type is-not-a null),

      (assert false (the-type is-a),
      (assert (the-type is-not-a),
    ),
    (should "a common type's type is not any other type or value." (=> ()
      (for t in other-types
        (assert false (the-type is (t the-type),
        (assert (the-type is-not (t the-type),

        (assert false (the-type is-a (t the-type),
        (assert (the-type is-not-a (t the-type),

        (assert false ((the-type type) is-a (t the-type),
        (assert ((the-type type) is-not-a (t the-type),
      ),
    ),
    (should "the type of the value is the type." (=> ()
      (for v in the-values
        (assert (:v is-a the-type),
        (assert false (:v is-not-a the-type),

        (assert ((:v type) is the-type),
        (assert false ((:v type) is-not the-type),
      ),
    ),
    (should "any other type's value's type is not the type." (=> ()
      (for t in other-types
        (for v in (t values)
          (assert false (:v is-a the-type),
          (assert (:v is-not-a the-type),

          (assert false ((:v type) is the-type),
          (assert ((:v type) is-not the-type),
        ),
      ),
    ),
    (should "the type of the empty value is the type." (=> ()
      (assert (:the-empty is-a the-type),
      (assert false (:the-empty is-not-a the-type),

      (assert ((:the-empty type) is the-type),
      (assert false ((:the-empty type) is-not the-type),
    ),
    (should "any other type's empty value's type is not the type." (=> ()
      (for t in other-types
        (var e (t "empty"),
        (assert false (:e is-a the-type),
        (assert (:e is-not-a the-type),

        (assert false ((:e type) is the-type),
        (assert ((:e type) is-not the-type),
      ),
    ),
  ),

  (define "Emptiness" (=> ()
    (should "a common type is not taken as an empty entity." (=> ()
      (assert false (the-type is-empty),
      (assert (the-type not-empty),
    ),
    (should "a common type's empty value must be an empty value." (=> ()
      (assert (:the-empty is-empty),
      (assert false (:the-empty not-empty),
  ),

  (define "Encoding" (=> ()
    (should "a common type is encoded to a symbol of its name." (=> ()
      (assert ((the-type to-code) is-a symbol),
      (assert (((the-type to-code) key) is (the-type name),
  ),

  (define "Description" (=> ()
    (should "a type is described as its name." (=> ()
      (assert ((the-type to-string) is-a string),
      (assert ((the-type to-string) is (the-type name),
  ),

  (define "Indexer" (=> ()
    (should "the indexer is a lambda." (=> ()
      (assert (:(the-type ":") is-a lambda),
      (assert (:(the-type ":") is (type ":")),
    ),
    (should "the indexer is a readonly accessor." (=> ()
      (assert null (the-type :"__new_prop" 1),
      (assert ((the-type "__new_prop") is null),

      (assert null (the-type :"__new_method" (= x x),
      (assert (:(the-type "__new_method") is null),
    ),
    (should "type's type is type." (=> ()
      (assert type (the-type type),

      (assert type (the-type "type"),
      (assert type (the-type (`type),

      (assert type (the-type :"type"),
      (assert type (the-type :(`type),

      (assert type (the-type :"type" x),
      (assert type (the-type :(`type) x),
    ),
    (should "type's proto is a descriptor object." (=> ()
      (assert ((the-type proto) is-a object),

      (assert ((the-type "proto") is-a object),
      (assert ((the-type (`proto)) is-a object),

      (assert ((the-type :"proto") is-a object),
      (assert ((the-type :(`proto)) is-a object),

      (assert ((the-type :"proto" x) is-a object),
      (assert ((the-type :(`proto) x) is-a object),
    ),
    (should "type's proto returns the objectified type." (=> ()
      (var t (the-type proto),
      # a type descriptor is an common object.
      (assert (t is-a object),
      (assert ((t type) is object),

      (var s (t static),
      # a type's static descriptor is an common object.
      (assert (s is-a object),
      (assert ((s type) is object),
      # proto is not directly visible.
      (assert ((s proto) is null),

      (assert ((s name) is-a string),
      (assert (:(s empty) is-a the-type),
      (assert (:(s "of") is-a lambda),
      (assert (:(s "indexer") is-a lambda),
      (assert (:(s "objectify") is-a lambda),
      (assert (:(s "typify") is-a lambda),
    ),
  ),

  (define "General Behaviours" (=> ()
    (should "(a-type empty) returns an empty value." (=> ()
      (assert (:(the-type empty) is-not null),
      (assert false (:(the-type empty) is null),

      (assert (:(the-type empty) is-a the-type),
      (assert false (:(the-type empty) is-not-a the-type),

      (assert (:(the-type empty) is-empty),
      (assert false(:(the-type empty) not-empty),
    ),
    (should "(a-type of) function returns an empty value." (=> ()
      (assert (:(the-type of) is-empty),
      (assert false (:(the-type of) not-empty),

      (assert (:(the-type of) is-a the-type),
      (assert false (:(the-type of) is-not-a the-type),
    ),
    (should "each type has its own indexer." (=> ()
      (assert (:(the-type "indexer") is-not (type "indexer"),
    ),
    (should "a common type's objectify function inherits type's." (=> ()
      (assert (:(the-type "objectify") is (type "objectify"),
    ),
    (should "a common type's typify function inherits type's." (=> ()
      (assert (:(the-type "typify") is (type "typify"),
    ),
  ),

  (define "Values" (=> ()
    (should "the values are not the default empty value." (=> ()
      (for v in the-values
        (assert (:v is-not (the-type empty),
        (assert false (:v is (the-type empty),
      ),
    ),
    (should "the values' type is this type." (=> ()
      (for v in the-values
        (assert (:v is-a the-type),
        (assert false (:v is-not-a the-type),
        (assert ((:v type) is the-type),
      ),
    ),
    (should "the other type's values' type is not this type" (=> ()
      (for t in other-types
        (for v in (t values)
          (assert false (:v is-a the-type),
          (assert (:v is-not-a the-type),
          (assert ((:v type) is-not the-type),
        ),
      ),
    ),
    (should "the other type's values' do not equal any of this type's values" (=> ()
      (for t in other-types
        (for v in (t values)
          (assert (:the-empty is-not v),
          (assert (:v is-not the-empty),
          (assert false (:the-empty is v),
          (assert false (:v is the-empty),
        ),
      ),
      (for v1 in the-values
        (for t in other-types
          (assert (:v1 is-not (t empty),
          (assert (:(t empty) is-not v1),
          (assert false (:v1 is (t empty)),
          (assert false (:(t empty) is v1),
          (for v2 in (t values)
            (assert (:v1 is-not v2),
            (assert (:v2 is-not v1),
            (assert false (:v1 is v2),
            (assert false (:v2 is v1),
          ),
        ),
      ),
    ),
  ),
).
