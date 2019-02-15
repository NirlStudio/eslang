################################################################################
# the shared test code for all types
(the-type ?? (warn "the type to be tested is not defined.").
(var (the-values the-empty other-types) (=>:()
  (var (choose) (import "../samples/types").
  (var (target others) (choose the-type the-values).
  (@ (target values) (target "empty") others)
).
################################################################################
(define ((the-type name) + " type") (=> ()
  (define "Identity" (=> ()
    (should "a type is itself." (=> ()
      (assert (the-type is the-type).
      (assert false (the-type is-not the-type).
    ).
    (should "a type is not null." (=> ()
      (assert false (the-type is null).
      (assert (the-type is-not null).

      (assert false (the-type is).
      (assert (the-type is-not).
    ).
    (should "a type is not the type." (=> ()
      (assert false (the-type is type).
      (assert (the-type is-not type).
    ).
    (should "a type is not any other type or value." (=> ()
      (for t in types
        (assert false (the-type is (t the-type).
        (assert (the-type is-not (t the-type).

        (assert false (the-type is (t "empty").
        (assert (the-type is-not (t "empty").

        (for v in (t values)
          (assert false (the-type is v).
          (assert (the-type is-not v).
        ).
  ).

  (define "Identity Operators" (= ()
    (should "'===' is 'is'." (= ()
      (assert ($(the-type "===") is (the-type "is").
    ).
    (should "'!==' is 'is-not'." (= ()
      (assert ($(the-type "!==") is (the-type "is-not").
    ).
  ).

  (define "Equivalence" (=> ()
    (should "type equals with itself." (=> ()
      (assert (the-type equals the-type).
      (assert false (the-type not-equals the-type).
    ).
    (should "type does not equal with null." (=> ()
      (assert false (the-type equals).
      (assert (the-type not-equals).

      (assert false (the-type equals null).
      (assert (the-type not-equals null).
    ).
    (should "type does not equal with type." (=> ()
      (assert false (the-type equals type).
      (assert (the-type not-equals type).
    ).
    (should "a type does not equal any other type or value." (=> ()
      (for t in types
        (assert false (the-type equals (t the-type).
        (assert (the-type not-equals (t the-type).

        (assert false (the-type equals (t "empty").
        (assert (the-type not-equals (t "empty").

        (for v in (t values)
          (assert false (the-type equals v).
          (assert (the-type not-equals v).
        ).
  ).

  (define "Equivalence Operators" (=> ()
    (should "'==' is 'equals'." (= ()
      (assert ($(the-type "==") is (the-type "equals").
    ).
    (should "'!=' is 'not-equals'." (= ()
      (assert ($(the-type "!=") is (the-type "not-equals").
    ).
  ).

  (define "Ordering" (=> ()
    (should "type is only comparable with itself." (=> ()
      (assert 0 (the-type compare the-type).

      (assert null (the-type compare).
      (assert null (the-type compare null).
      (assert null (null compare the-type).

      (assert null (the-type compare type).
      (assert null (type compare the-type).

      (for t in types
        (assert null (the-type compare (t the-type).
        (assert null ((t the-type) compare the-type).

        (assert null (the-type compare (t "empty").
        (assert null ((t "empty") compare the-type).

        (for v in (t values)
          (assert null (the-type compare v).
          (assert null (v compare the-type).
        ).
  ).

  (define "Type Verification" (=> ()
    (should "a common type's type is the type." (=> ()
      (assert (the-type is-a type).
      (assert false (the-type is-not-a type).

      (if (the-type is-not-a class)
        (assert ((the-type type) is type).
        (assert false ((the-type type) is-not type).
      else
        (assert ((the-type type) is class).
        (assert false ((the-type type) is-not class).
    ).
    (should "a common type is not an instance of itself." (=> ()
      (assert false (the-type is-a the-type).
      (assert (the-type is-not-a the-type).
    ).
    (should "a common type's type is not null." (=> ()
      (assert false (the-type is-a null).
      (assert (the-type is-not-a null).

      (assert false (the-type is-a).
      (assert (the-type is-not-a).
    ).
    (should "a common type's type is not any other type or value." (=> ()
      (for t in other-types
        (assert false (the-type is (t the-type).
        (assert (the-type is-not (t the-type).

        (assert false (the-type is-a (t the-type).
        (assert (the-type is-not-a (t the-type).

        (assert false ((the-type type) is-a (t the-type).
        (assert ((the-type type) is-not-a (t the-type).
      ).
    ).
    (should "the type of the value is the type." (=> ()
      (for v in the-values
        (assert ($v is-a the-type).
        (assert false ($v is-not-a the-type).

        (assert (($v type) is the-type).
        (assert false (($v type) is-not the-type).
      ).
    ).
    (should "any other type's value's type is not the type." (=> ()
      (for t in other-types
        (if ((the-type is-not object) || ((t the-type) is-not-a class))
          (for v in (t values)
            (assert false ($v is-a the-type).
            (assert ($v is-not-a the-type).

            (assert false (($v type) is the-type).
            (assert (($v type) is-not the-type).
          ).
        ).
      ).
    ).
    (should "the type of the empty value is the type." (=> ()
      (assert ($the-empty is-a the-type).
      (assert false ($the-empty is-not-a the-type).

      (assert (($the-empty type) is the-type).
      (assert false (($the-empty type) is-not the-type).
    ).
    (should "any other type's empty value's type is not the type." (=> ()
      (for t in other-types
        (if ((the-type is-not object) || ((t the-type) is-not-a class))
          (var e (t "empty").
          (assert false ($e is-a the-type).
          (assert ($e is-not-a the-type).

          (assert false (($e type) is the-type).
          (assert (($e type) is-not the-type).
        ).
      ).
    ).
  ).

  (define "Emptiness" (=> ()
    (should "a common type is not taken as an empty entity." (=> ()
      (assert false (the-type is-empty).
      (assert (the-type not-empty).
    ).
    (should "a common type's empty value must be an empty value." (=> ()
      (assert ($the-empty is-empty).
      (assert false ($the-empty not-empty).
    )
  ).

  (define "Encoding" (=> ()
    (should "a common type is encoded to a symbol of its name." (=> ()
      (assert ((the-type to-code) is-a symbol).
      (assert (((the-type to-code) key) is (the-type name).
  ).

  (define "Description" (=> ()
    (should "a type is described as its name." (=> ()
      (assert ((the-type to-string) is-a string).
      (assert ((the-type to-string) is (the-type name).
  ).

  (define "Indexer" (=> ()
    (should "the indexer is a lambda." (=> ()
      (assert ($(the-type ":") is-a lambda).
      (assert ($(the-type ":") equals (type ":").
    ).
    (should "the indexer is a readonly accessor." (=> ()
      (assert null (the-type :"__new_prop" 1).
      (assert ((the-type "__new_prop") is null).

      (assert null (the-type :"__new_method" (= x x).
      (assert ($(the-type "__new_method") is null).
    ).
    ((the-type is-a class) ?
      (should "a class's type is class." (=> ()
        (assert class (the-type type).

        (assert class (the-type "type").
        (assert class (the-type (`type).

        (assert class (the-type :"type").
        (assert class (the-type :(`type).

        (assert class (the-type :"type" x).
        (assert class (the-type :(`type) x).
      ).
      (should "type's type is type." (=> ()
        (assert type (the-type type).

        (assert type (the-type "type").
        (assert type (the-type (`type).

        (assert type (the-type :"type").
        (assert type (the-type :(`type).

        (assert type (the-type :"type" x).
        (assert type (the-type :(`type) x).
      ).
    ).
    (should "type's proto is a descriptor object." (=> ()
      (assert ((the-type proto) is-a object).

      (assert ((the-type "proto") is-a object).
      (assert ((the-type (`proto)) is-a object).

      (assert ((the-type :"proto") is-a object).
      (assert ((the-type :(`proto)) is-a object).

      (assert ((the-type :"proto" x) is-a object).
      (assert ((the-type :(`proto) x) is-a object).
    ).
    (should "type's proto returns the objectified type." (=> ()
      (var t (the-type proto).
      # a type descriptor is an common object.
      (assert (t is-a object).
      (assert ((type of t) is object).
      (assert ((t type) is-a object).
      (assert the-type ((t type) indexer "type").

      (var s (t type).
      # a type's type descriptor is an common object.
      (assert (s is-a object).
      (assert ((s type) is object).
      # proto is not directly visible.
      (assert ((s proto) is null).

      (assert ((s name) is-a string).
      (assert ($(s empty) is-a the-type).
      (assert ($(s "of") is-a lambda).
      (assert ($(s "indexer") is-a lambda).
      (assert ($(s "reflect") is-a lambda).
      (assert ($(s "seal") is-a lambda).
      (assert ($(s "is-sealed") is-a lambda).
    ).
  ).

  (define "Proto Indexer" (=> ()
    (should "(a-type \"indexer\") is a lambda." (=> ()
      (assert ($(the-type "indexer") is-a lambda).
    ).
  ).

  (define "Evaluation" (=> ()
    (should "a type is evaluated to itself." (=> ()
      (assert the-type (the-type).
    ).
  ).

  (define "Arithmetic Operators" (=> ()
    (should "(++ the-type) returns 1." (=> ()
      (var x the-type)
      (assert 1 (++ x).
      (assert 1 x).
    ).
    (should "(-- the-type) returns -1." (=> ()
      (var x the-type)
      (assert -1 (-- x).
      (assert -1 x).
    ).
  ).

  (define "Bitwise Operators" (=> ()
    (should "(~ the-type) returns (~ 0)." (=> ()
      (assert (~ 0) (~ the-type).
      (var x the-type)
      (assert (~ 0) (~ x).
    ).
  ).

  (define "General Operators" (=> ()
    (should "(+ the-type) returns the-type's name." (=> ()
      (var name (the-type name).
      (assert name (+ the-type).
      (assert (+ name name) (+ the-type the-type).

      (var x the-type)
      (assert name (+ x).
      (assert (+ name name) (+ x x).
    ).
  ).

  (define "Logical Operators" (=> ()
    (define "Logical NOT: (! the-type)" (=> ()
      (should "(! the-type) returns false." (=> ()
        (assert false (! the-type).
        (var x the-type)
        (assert false (! x).
      ).
      (should "(not the-type) returns false." (=> ()
        (assert false (not the-type).
        (var x the-type)
        (assert false (not x).
      ).
    ).
    (define "Logical AND: (the-type && ...)" (=> ()
      (should "(the-type &&) returns the-type." (=> ()
        (assert the-type (the-type &&).
        (var x the-type)
        (assert the-type (x &&).
      ).
      (should "(type && x) returns x." (=> ()
        (assert true (the-type && true).
        (var x the-type)
        (assert true (x && true).
      ).
      (should "(type && x y) returns y." (=> ()
        (assert false (the-type && true false).
        (var x the-type)
        (assert false (x && true false).
      ).
    ).
    (define "Logical OR: (the-type || ...)" (=> ()
      (should "(the-type ||) returns the-type." (=> ()
        (assert the-type (the-type ||).
        (var x the-type)
        (assert the-type (x ||).
      ).
      (should "(the-type || x) returns the-type." (=> ()
        (assert the-type (the-type || 1).
        (var x the-type)
        (assert the-type (x || 1).
      ).
      (should "(the-type || x y) returns the-type." (=> ()
        (assert the-type (the-type || 1 2).
        (var x the-type)
        (assert the-type (x || 1 2).
      ).
    ).
    (define "Boolean Test: (the-type ? ...)" (=> ()
      (should "Booeanize: (the-type ?) returns true." (=> ()
        (assert true (the-type ?).
        (var x the-type)
        (assert true (x ?).
      ).
      (should "Boolean Fallback: (the-type ? x) returns the-type." (=> ()
        (assert the-type (the-type ? 1).
        (assert the-type (the-type ? (1).
        (var x the-type)
        (assert the-type (x ? 1).
        (assert the-type (x ? (1).
      ).
      (should "Boolean Switch: (the-type ? x y) returns x." (=> ()
        (var x -1)
        (var y  1)
        (assert -1 (the-type ? x (++ y).
        (assert 1 y)

        (assert -2 (the-type ? (-- x) (++ y).
        (assert -2 x)
        (assert 1 y)
      ).
    ).
  ).

  (define "Global Operators" (=> ()
    (define "Null fallback: (the-type ?? ...)" (=> ()
      (should "(the-type ??) returns the-type." (=> ()
        (assert the-type (the-type ??).
        (var x the-type)
        (assert the-type (x ??).
      ).
      (should "(the-type ?? x) returns the-type." (=> ()
        (var c 0)
        (assert the-type (the-type ?? 1).
        (assert the-type (the-type ?? (++ c).
        (assert 0 c)

        (var x the-type)
        (assert the-type (x ?? 1).
        (assert the-type (x ?? (++ c).
        (assert 0 c)
      ).
      (should "(the-type ?? x y) returns the-type." (=> ()
        (let x 1)
        (let y -1)
        (assert the-type (the-type ?? x y).
        (assert the-type (the-type ?? (++ x) (-- y).
        (assert 1 x)
        (assert -1 y)
      ).
    ).
  ).

  (define "General Behaviours" (=> ()
    (should "(a-type empty) returns an empty value." (=> ()
      (assert ($(the-type empty) is-not null).
      (assert false ($(the-type empty) is null).

      (assert ($(the-type empty) is-a the-type).
      (assert false ($(the-type empty) is-not-a the-type).

      (assert ($(the-type empty) is-empty).
      (assert false($(the-type empty) not-empty).
    ).
    (should "(a-type of) function returns an empty value." (=> ()
      (assert ($(the-type of) is-empty).
      (assert false ($(the-type of) not-empty).

      (assert ($(the-type of) is-a the-type).
      (assert false ($(the-type of) is-not-a the-type).
    ).
    (if (the-type is-not class)
      (should "each primary type has its own instance indexer." (=> ()
        (assert ($(the-type "indexer") is-not (type "indexer").
    ).
    (should "a common type's reflect function inherits type's." (=> ()
      (assert ($(the-type "reflect") equals (type "reflect").
    ).
    (if (the-type is-not object:: && (the-type is-not-a class))
      (should "a common type's seal function inherits type's." (=> ()
        (assert ($(the-type "seal") equals (type "seal").
      ).
      (should "a common type's is-sealed function inherits type's." (=> ()
        (assert ($(the-type "is-sealed") equals (type "is-sealed").
      ).
    ).
  ).
).

(define "Type Reflection" (=> ()
  (should "(type reflect) returns the object representation of type." (=> ()
    (var t (the-type reflect).
    (assert (t is-a object).
    (assert ((type of t) is object).
    (for (k v) in t
      (if ($v is-a lambda) (assert ($v is-bound).
      (if ($v is-a function) (assert ($v is-bound).
    ).

    (assert ((t type) is-a object).
    (for (k v) in (t type)
      (if ($v is-a lambda) (assert ($v is-bound).
      (if ($v is-a function) (assert ($v is-bound).
    ).
  ).
).

(if (the-type is-not-a class)
  (define "Mutability" (=> ()
    (should "(type is-sealed) returns true." (=> ()
      (assert true (the-type is-sealed).
    ).
    (should "(type seal) returns the type." (=> ()
      (assert the-type (the-type seal).
    ).
  ).
).

# verify general logic for sample values.
(var all-values (the-values concat (the-type empty).
(for i in (0 (all-values length))
  (var the-value (all-values:i))
  (var other-values ((all-values copy) delete i).
  (define (+ "value: " the-value) (=> ()
    (load "value" (@:@
      the-type the-values the-empty other-types
      the-value other-values
    ).
  ).
).

# export results
(@:@ the-type the-values the-empty other-types).
