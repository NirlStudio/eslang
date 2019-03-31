(define "(@ ...) - implicit literal" (= ()
  (should "(@) returns an empty array." (= ()
    (assert ((@) is-an array).
    (assert ((@) is-empty).
    (assert ((@) is-not (@).
  ).
  (should "(@ name: ...) returns an object." (= ()
    (assert ((@ name:) is-an object).
    (assert ((@ name:) not-empty).
    (assert ((@ name:) is-not (@ name:).
    (assert (object owns (@ name:) "name").
    (assert null ((@ name:) "name")
  ).
  (should "(@ \"name\": ...) returns an object." (= ()
    (assert ((@ "name": 1) is-an object).
    (assert ((@ "name": 1) not-empty).
    (assert ((@ "name": 1) is-not (@ "name": 1).
    (assert (object owns (@ "name": 1) "name").
    (assert 1 ((@ "name": 1) "name")
  ).
  (should "an implicit object supports variable as field." (= ()
    (var y 2).
    (var obj (@ x: 1 y z a:10).
    (assert (obj is-an object).
    (assert (obj not-empty).

    (assert (object owns obj "x").
    (assert (object owns obj "y").
    (assert (object owns obj "z").
    (assert (object owns obj "a").

    (assert 1 (obj x).
    (assert 2 (obj y).
    (assert null (obj z).
    (assert 10 (obj a).
  ).
  (should "(@ offset: ...) returns a discrete or normal array." (= ()
    (var a (@ 10:).
    (assert (a is-an array).
    (assert (a not-empty).
    (assert 11 (a length).
    (assert 1 (a count).
    (assert null (a 10).
  ).
  (should "(@ ...) returns a normal array." (= ()
    (var a (@ (` x): 1 2). # (` x) is neither a symbol nor a string.
    (assert (a is-an array).
    (assert (a not-empty).
    (assert 2 (a length).
    (assert 2 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
  ).
  (should "an implicit array can be a discrete array." (= ()
    (var a (@ 1 2 10:10 11 100:100).
    (assert (a is-an array).
    (assert (a not-empty).
    (assert 101 (a length).
    (assert 5 (a count).
    (assert 1 (a 0).
    (assert 2 (a 1).
    (assert null (a 2).

    (assert 10 (a 10).
    (assert 11 (a 11).
    (assert null (a 12).

    (assert 100 (a 100).
    (assert null (a 101).
  ).
).

(define "(@: ...) - explicit literal" (= ()
  (should "(@:) returns an empty object" (= ()
    (assert ((@:) is-an object).
    (assert ((@:) is-empty).
    (assert ((@:) is-not (@:).
  ).
  (define "(@:@ ...) - compact object" (= ()
    (should "(@:@) returns an empty object" (= ()
      (assert ((@:@) is-an object).
      (assert ((@:@) is-empty).
      (assert ((@:@) is-not (@:@).
    ).
    (should "(@:@ ...) supports variable field." (= ()
      (var y 2)
      (var obj (@:@ x y z: 3).
      (assert (obj is-an object).
      (assert (obj not-empty).

      (assert (object owns obj "x").
      (assert (object owns obj "y").
      (assert (object owns obj "z").
      (assert false (object owns obj "a").

      (assert null (obj x).
      (assert 2 (obj y).
      (assert 3 (obj z).
      (assert null (obj a).
    ).
    (should "(@:@ ...) supports dynamic field name." (= ()
      (var y 2)
      (var obj (@:@
        0: 0
        ("x" + "-"): 1
        (`y)
        (symbol of "z"): 3
      ).
      (assert (obj is-an object).
      (assert (obj not-empty).

      (assert (object owns obj "0").
      (assert (object owns obj "x-").
      (assert (object owns obj "y").
      (assert (object owns obj "z").
      (assert false (object owns obj "a").

      (assert 0 (obj "0").
      (assert 1 (obj x-).
      (assert 2 (obj y).
      (assert 3 (obj z).
      (assert null (obj a).
    ).
  ).
  (define "(@:object ...) - explicit object" (= ()
    (should "(@:object) returns an empty object." (= ()
      (assert ((@:object) is-an object).
      (assert ((@:object) is-empty).
      (assert ((@:object) is-not (@:object).
    ).
    (should "(@:object ...) supports variable field." (= ()
      (var y 2)
      (var obj (@:object x y z: 3).
      (assert (obj is-an object).
      (assert (obj not-empty).

      (assert (object owns obj "x").
      (assert (object owns obj "y").
      (assert (object owns obj "z").
      (assert false (object owns obj "a").

      (assert null (obj x).
      (assert 2 (obj y).
      (assert 3 (obj z).
      (assert null (obj a).
    ).
    (should "(@:object ...) supports dynamic field name." (= ()
      (var y 2)
      (var obj (@:object
        0: 0
        ("x" + "-"): 1
        (`y)
        (symbol of "z"): 3
      ).
      (assert (obj is-an object).
      (assert (obj not-empty).

      (assert (object owns obj "0").
      (assert (object owns obj "x-").
      (assert (object owns obj "y").
      (assert (object owns obj "z").
      (assert false (object owns obj "a").

      (assert 0 (obj "0").
      (assert 1 (obj x-).
      (assert 2 (obj y).
      (assert 3 (obj z).
      (assert null (obj a).
    ).
  ).
  (define "(@:* ...) - compact array" (= ()
    (should "(@:*) returns an empty array." (= ()
      (assert ((@:*) is-an array).
      (assert ((@:*) is-empty).
      (assert ((@:*) is-not (@:*).
    ).
    (should "(@:* ...) supports discrete array" (= ()
      (var a (@:* x:1 y:2 10:10 z:11 100:100).
      (assert (a is-an array).
      (assert (a not-empty).
      (assert 101 (a length).
      (assert 5 (a count).
      (assert 1 (a 0).
      (assert 2 (a 1).
      (assert null (a 2).

      (assert 10 (a 10).
      (assert 11 (a 11).
      (assert null (a 12).

      (assert 100 (a 100).
      (assert null (a 101).
    ).
  ).
  (define "(@:array ...) - explicit array" (= ()
    (should "(@:array) returns an empty array." (= ()
      (assert ((@:array) is-an array).
      (assert ((@:array) is-empty).
      (assert ((@:array) is-not (@:array).
    ).
    (should "(@:array ...) supports discrete array" (= ()
      (var a (@:array x:1 y:2 10:10 z:11 100:100).
      (assert (a is-an array).
      (assert (a not-empty).
      (assert 101 (a length).
      (assert 5 (a count).
      (assert 1 (a 0).
      (assert 2 (a 1).
      (assert null (a 2).

      (assert 10 (a 10).
      (assert 11 (a 11).
      (assert null (a 12).

      (assert 100 (a 100).
      (assert null (a 101).
    ).
  ).
  (define "(@:class ...) - class literal" (= ()
    (should "(@:class) returns an empty class." (= ()
      (var c (@:class).
      (assert (c is-a class).
      (assert (c is-a type).
      (assert (c is-empty).
    ).
    (should "(@:class ...) returns a non-empty class." (= ()
      (var c (@:class prop: 1 method: (= x x).
      (assert (c is-a class).
      (assert (c is-a type).
      (assert (c not-empty).

      (var inst (c default).
      (assert 1 (inst prop).
      (assert 100 (inst method 100).
    ).
    (should "(@:class type: (@ member: ...)) adds type members for the new class." (= ()
      (var c (@:class
        type: (@ t-prop: 1 t-method: (= x x).
        prop: 1
        method: (= x x).
      ).
      (assert (c is-a class).
      (assert (c is-a type).
      (assert (c not-empty).

      (assert 1 (c t-prop).
      (assert 99 (c t-method 99).

      (var inst (c default).
      (assert 1 (inst prop).
      (assert 3 (inst method 3).
    ).
    (should "(@:class type: (@ name: cls-name ...)) creates a new class named as cls-name." (= ()
      (var c (@:class
        type: (@ name: "an-explicit-name").
        prop: 1
        method: (= x x).
      ).
      (assert (c is-a class).
      (assert (c is-a type).
      (assert (c not-empty).
      (assert "an-explicit-name" (c name).

      (var inst (c default).
      (assert 1 (inst prop).
      (assert 3 (inst method 3).
    ).
    (should "(@:class type: parent-class) creates a new class with members from parent." (= ()
      (var p (@:class
        type: (@ name: "parent" const: 100)
        prop: 1
        dummy: (= x x).
      ).
      (var c (@:class type: p
         prop: 10
         smart: (= x (x + x).
      ).
      (assert (c is-a class).
      (assert (c is-a type).
      (assert (c not-empty).

      (assert "c" (c name).
      (assert 100 (c const).

      (var inst (c default).
      (assert 10 (inst prop).
      (assert 3 (inst dummy 3).
      (assert 6 (inst smart 3).
    ).
  ).
  (define "(@:a-class ...) - instance literal" (= ()
    (var activated false)
    (var constructed false)
    (var cat (@:class
      type: (@
        reset: (=> ()
          (let constructed false)
          (let activated false)
      ).
      activator: (=> () (let activated true).
      constructor: (=> () (let constructed true).

    ).
    (should "(@:a-class) returns an activated empty instance of the class." (=> ()
      (cat reset)
      (assert false constructed).
      (assert false activated).

      (var kitty (@:cat).
      (assert false constructed).
      (assert true activated).

      (assert (kitty is-a cat).
      (assert (kitty is-an object).
      (assert (kitty is-empty).
    ).
    (should "(@:a-class ...) returns an activated instance with given properties." (=> ()
      (cat reset)
      (assert false constructed).
      (assert false activated).

      (var kitty (@:cat name: "Charles" age: 12).
      (assert false constructed).
      (assert true activated).

      (assert (kitty is-a cat).
      (assert (kitty is-an object).
      (assert (kitty not-empty).

      (assert "Charles" (kitty name).
      (assert 12 (kitty age).
    ).
  ).
  (define "general behaviours" (= ()
    (should "(@:? ...) always returns a common object if the type cannot be recognised as any above type." (= ()
      (var invalid-types (@
        null type bool string number date range symbol tuple
        operator lambda function
        array iterator object class
        true false 1 -1 0 -0
        (=?) (= (=>) (@ 1 2 3) (@ x:1)
      ).
      (var y 2)
      (for t in invalid-types
        (var obj (@:t x: 1 y z).
        (assert (obj is-an object).
        (assert ((obj type) is object).
        (assert (obj not-empty).
        (assert 1 (obj x).
        (assert 2 (obj y).
        (assert null (obj z).

        (var obj (@:(t) x: 1 y z).
        (assert (obj is-an object).
        (assert ((obj type) is object).
        (assert (obj not-empty).

        (assert 1 (obj x).
        (assert 2 (obj y).
        (assert null (obj z).
      ).
    ).
    (should "constant values and type names can be used as field name." (= ()
      (var obj (@
        *:* ...
        null true false
        type bool string number date range symbol tuple
        operator lambda function
        array iterator object class
        in else
      ).
      (assert null (obj "*").
      (assert (object owns obj "*").

      (assert null (obj "...").
      (assert (object owns obj "...").

      (assert null (obj "null").
      (assert (object owns obj "null").

      (assert true (obj "true").
      (assert false (obj "false").

      (assert type (obj "type").
      (assert bool (obj "bool").
      (assert string (obj "string").
      (assert number (obj "number").
      (assert date (obj "date").
      (assert range (obj "range").
      (assert symbol (obj "symbol").
      (assert tuple (obj "tuple").

      (assert operator (obj "operator").
      (assert lambda (obj "lambda").
      (assert function (obj "function").
      (assert array (obj "array").
      (assert iterator (obj "iterator").
      (assert object (obj "object").
      (assert class (obj "class").

      (assert in (obj "in").
      (assert else (obj "else").
    ).
  ).
).
