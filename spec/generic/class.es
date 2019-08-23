(var * (load "share/type" (@ the-type: class).

(define "Class (Type) Common Behaviors" (=> ()
  (define "Identity" (=> ()
    (should "an empty class is identified by its instance." (= ()
      (assert ((@:class) is-not (@:class).
      (assert false ((@:class) is (@:class).

      (assert ((class empty) is-not (class empty).
      (assert false ((class empty) is (class empty).

      (assert ((class of) is-not (class of).
      (assert false ((class of) is (class of).
    ).
  ).

  (define "Equivalence" (= ()
    (should "a class's equivalence is defined as the same of its identity." (= ()
      (var c (@:class x:1 y:10).
      (assert ($(c "is") is (c "equals").
      (assert ($(c "is-not") is (c "not-equals").
    ).
  ).

  (define "Ordering" (=> ()
    (should "comparison of a class with itself returns 0." (=> ()
      (for a in (the-values concat (@:class) (@:class))
        (assert 0 (a compare a).
      ).
    ).
    (should "comparison of two different classes return null." (=> ()
      (var values (the-values concat (@:) (@:).
      (for a in values
        (for b in values
          (if (a is-not b)
            (assert null (a compare b).
      ).
    ).
  ).

  (define "Type Verification" (=> ()
    (should "a-class is a type." (=> ()
      (for cls in (the-values concat (class empty) (class of))
        (assert (cls is-a type).
      ).
    ).
    (should "a-class is a class." (=> ()
      (for cls in (the-values concat (class empty) (class of))
        (assert (cls is-a class).
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "a class is not empty if it has any instance member." (= ()
      (assert ((@:class) is-empty).
      (assert false ((@:class) not-empty).

      (assert false ((@:class constructor: (=)) is-empty).
      (assert ((@:class constructor: (=)) not-empty).

      (assert false ((@:class x:1) is-empty).
      (assert ((@:class x:1) not-empty).

      (assert ((class empty) is-empty).
      (assert false ((class empty) not-empty).

      (assert ((class of) is-empty).
      (assert false ((class of) not-empty).

      (assert ((class empty) is-empty).
      (assert false ((class empty) not-empty).
    ).
    (should "a class is not empty if it has any type member." (= ()
      (assert ((@:class type: null) is-empty).
      (assert false ((@:class type: null) not-empty).

      (assert ((@:class type: (@:)) is-empty).
      (assert false ((@:class type: (@:)) not-empty).

      (var cls (@:class type: (@ x: 1)))
      (assert (cls is-a class).
      (assert (cls not-empty).
      (assert false (cls is-empty).

      (assert ((@:class type: (@ x: 1)) not-empty).
      (assert false ((@:class type: (@ x: 1)) is-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "a class is encoded to a symbol if it's not anonymous." (=> ()
      (for value in the-values
        (assert (symbol of (value name)) (value to-code).
      ).
    ).
    (should "a class is encoded to (symbol empty) if it's anonymous." (=> ()
      (assert (symbol empty) ((@:class) to-code).
      (assert (symbol empty) ((class empty) to-code).
      (assert (symbol empty) ((class of) to-code).
    ).
  ).

  (define "Representation" (=> ()
    (should "An anonymous empty class is represented as (@:class)." (=> ()
      (assert "(@:class)" ((@:class) to-string).
      (assert "(@:class)" ((class empty) to-string).
      (assert "(@:class)" ((class of) to-string).
    ).
    (should "An anonymous non-empty class is represented by its declaration." (=> ()
      (assert "(@:class x: 1)" ((@:class x: 1) to-string).
      (assert "(@:class x: 1)" ((class of (@ x: 1)) to-string).
    ).
    (should "An anonymous class with nested values is represented as (class of (@ ...))." (=> ()
      (var obj (@ x: 1).
      (assert (((@:class type: (@ o1: obj o2: obj)) to-string) starts-with "(class of ").

      (obj "self" obj).
      (assert (((@:class type: (@ o: obj)) to-string) starts-with "(class of ").
    ).
    (should "A named class is represented by its name." (=> ()
      (var Cat (@:class).
      (assert "Cat" (Cat to-string).

      (var Dog (@:class x: 1).
      (assert "Dog" (Dog to-string).

      (assert "Horse" ((@:class type: (@ name: "Horse")) to-string).

      (var H (@:class type: (@ name: "Horse").
      (assert "Horse" (H to-string).
    ).
  ).
).

(define "(class empty)" (= ()
  (should "(class empty) returns a new empty class." (= ()
    (var cls1 (class empty).
    (assert (cls1 is-empty).

    (var cls2 (class empty).
    (assert (obj2 is-empty).

    (assert (cls1 is-not cls2).
  ).
).

(define "(class of ...)" (= ()
  (should "(class of) returns a new empty class." (= ()
    (var cls1 (class of).
    (assert (cls1 is-empty).

    (var cls2 (class of).
    (assert (cls2 is-empty).

    (assert (cls1 is-not cls2).
  ).
  (should "(class of def-obj) returns a new class by the definition object." (= ()
    (var cls (class of (@ x: 1
      type: (@ y: 2 add: (= z (+ (this y) z).
      constructor: (= x (if x (this: "x" x).
      add: (= z (+ (this x) z).
    ).
    (assert (cls not-empty).
    (assert false (cls is-empty).

    (assert 2 (cls y).
    (assert 12 (cls add 10).

    (var inst1 (cls of).
    (assert 1 (inst1 x).
    (assert 11 (inst1 add 10).

    (assert 2 ((inst1 type) y).
    (assert 12 ((inst1 type) add 10).

    (var inst2 (cls of 11).
    (assert 11 (inst2 x).
    (assert 21 (inst2 add 10).

    (assert 2 ((inst2 type) y).
    (assert 12 ((inst2 type) add 10).
  ).
  (should "(class of def-objects ...) returns a new class by the definition objects." (= ()
    (var cls (class of
      (@ x: 1
        type: (@
          y: 2
          add: (= z (+ y z).
        ).
        constructor: (= x (if x (this: "x" x).
        add: (= z (+ x z).
      ) (@:class x: 2
        type: (@
          y: 20
        ).
        add: (= z (+ x z 100).
      ).
    ).
    (assert (cls not-empty).
    (assert false (cls is-empty).

    (assert 2 (cls y).
    (assert 12 (cls add 10).

    (var inst1 (cls of).
    (assert 1 (inst1 x).
    (assert 11 (inst1 add 10).

    (assert 2 ((inst1 type) y).
    (assert 12 ((inst1 type) add 10).

    (var inst2 (cls of 11).
    (assert 11 (inst2 x).
    (assert 21 (inst2 add 10).

    (assert 2 ((inst2 type) y).
    (assert 12 ((inst2 type) add 10).
  ).
).

(define "(class attach ...)" (= ()
  (should "(class attach) returns null." (= ()
    (assert null (class attach).
    (assert null (class attach null).
  ).
  (should "(class attach obj ...) falls back to (object assign) if obj is a common object." (= ()
    (var obj (@:).
    (assert obj (class attach obj).

    (let obj (@ x: 1).
    (assert obj (class attach obj).
    (assert obj (class attach obj (@ y: 2).
    (assert 1 (obj x).
    (assert 2 (obj y).
  ).
  (should "(class attach inst) returns inst if inst is an instance of any class." (= ()
    (var inst ((class empty) empty).
    (assert inst (class attach inst).

    (let inst ((@:class x: 1) empty).
    (assert inst (class attach inst).
  ).
  (should "(class attach value) returns null if value is not an instance of a class." (= ()
    (assert null (class attach null).
    (assert null (class attach type).
    (assert null (class attach string).
    (assert null (class attach number).
    (assert null (class attach bool).
    (assert null (class attach date).
    (assert null (class attach range).
    (assert null (class attach symbol).
    (assert null (class attach tuple).
    (assert null (class attach operator).
    (assert null (class attach lambda).
    (assert null (class attach function).
    (assert null (class attach array).
    (assert null (class attach object).
    (assert null (class attach class).

    (assert null (class attach "xyz").
    (assert null (class attach 100).
    (assert null (class attach true).
    (assert null (class attach (date of 1000)).
    (assert null (class attach (1 100).
    (assert null (class attach (` x).
    (assert null (class attach (` (x y).
    (assert null (class attach (=).
    (assert null (class attach (=>).
    (assert null (class attach (=?).
    (assert null (class attach (@:array 1: 2).
    (assert null (class attach (@:class x: 1).
  ).
  (should "(class attach inst obj) copies all fields of obj to inst, then activates and returns it." (= ()
    (var inst ((class empty) empty).
    (assert inst (class attach inst (@ x: 100).
    (assert 100 (inst x).

    (let inst ((@:class x: 1
        activator: (= src (this "activated" (src x).
      ) empty
    ).
    (assert 1 (inst x).
    (assert inst (class attach inst(@ x: 100).
    (assert 100 (inst activated).
    (assert 100 (inst x).
  ).
  (should "(class attach inst objects ...) copies all fields of every obj to inst, then activates and returns it." (= ()
    (var inst ((class empty) empty).
    (assert inst (class attach inst (@ x: 100).
    (assert 100 (inst x).

    (let inst ((@:class x: 1 activated: 0
        activator: (= src (activated += (src x).
      ) empty
    ).
    (assert 1 (inst x).
    (assert inst (class attach inst (@ x: 10) (@ x: 100).
    (assert 110 (inst activated).
    (assert 100 (inst x).
  ).
).

(define "(a-class empty)" (= ()
  (should "(a-class empty) returns a new empty and uninitialized instance." (= ()
    (var cls (class empty).
    (var inst1 (cls empty).
    (assert (inst1 is-an object).
    (assert (inst1 is-a cls).
    (assert (inst1 is-empty).

    (let inst2 (cls empty).
    (assert (inst2 is-an object).
    (assert (inst2 is-a cls).
    (assert (inst2 is-empty).

    (assert (inst1 is-not inst2).
  ).
  (should "(a-class empty) does not call either constructor or activator." (= ()
    (var cls (@:class c: 1 a: 1
      constructor: (= () (c ++).
      activator: (= () (a ++).
    ).
    (var inst (cls empty).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert 1 (inst c).
    (assert 1 (inst a).
    (assert (inst is-empty).
  ).
).

(define "(a-class default)" (= ()
  (should "(a-class default) returns a new default instance without construct argument." (= ()
    (var cls (class empty).
    (var inst1 (cls default).
    (assert (inst1 is-an object).
    (assert (inst1 is-a cls).
    (assert (inst1 is-empty).

    (let inst2 (cls default).
    (assert (inst2 is-an object).
    (assert (inst2 is-a cls).
    (assert (inst2 is-empty).

    (assert (inst1 is-not inst2).
  ).
  (should "(a-class default) calls constructor without argument." (= ()
    (var cls (@:class c: 1 a: 1
      constructor: (= ()
        (c ++)
        (this "args" (arguments length).
      ).
      activator: (= () (a ++).
    ).
    (var inst (cls default).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert 2 (inst c).
    (assert 0 (inst args).
    (assert 1 (inst a).
    (assert (inst not-empty).
  ).
).

(define "(a-class of ...)" (= ()
  (should "(a-class of) returns a new instance of the class." (= ()
    (var cls (class empty).
    (var inst1 (cls of).
    (assert (inst1 is-an object).
    (assert (inst1 is-a cls).
    (assert (inst1 is-empty).

    (var inst2 (cls of).
    (assert (inst2 is-an object).
    (assert (inst2 is-a cls).
    (assert (inst2 is-empty).

    (assert (inst1 is-not inst2).
  ).
  (should "(a-class of obj) copies all fields of obj into a new instance of the class if it has not a constructor." (= ()
    (var cls (class empty).
    (var inst (cls of (@ x: 1).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 1 (inst x).

    (let cls (@:class x: 1).
    (let inst (cls of (@ x: 2).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 2 (inst x).
  ).
  (should "(a-class of objects ...) copies all fields of all objects into a new instance of the class if it has not a constructor." (= ()
    (var cls (class empty).
    (var inst (cls of (@ x: 1) (@ y: 2).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 1 (inst x).
    (assert 2 (inst y).

    (let cls (@:class x: 1).
    (let inst (cls of (@ x: 2) (@ y: 3).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 2 (inst x).
    (assert 3 (inst y).
  ).
  (should "(a-class of args ...) creates a new instance, and calls the constructor on it with args." (= ()
    (var cls (@:class c: 1 a: 1
      constructor: (= (x y)
        (c ++)
        (this "x" x)
        (this "y" y)
      ).
      activator: (= ()
        (a ++).
      ).
    ).
    (var inst (cls of 1 (@ y:2).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert 2 (inst c).
    (assert 1 (inst a).
    (assert 1 (inst x).
    (assert ((inst y) is-an object).
    (assert 2 ((inst y) y).
    (assert (inst not-empty).
  ).
).

(define "(a-class from ...)" (= ()
  (should "(a-class from) returns a new empty instance of the class." (= ()
    (var cls (class empty).
    (var inst1 (cls from).
    (assert (inst1 is-an object).
    (assert (inst1 is-a cls).
    (assert (inst1 is-empty).

    (var inst2 (cls from).
    (assert (inst2 is-an object).
    (assert (inst2 is-a cls).
    (assert (inst2 is-empty).

    (assert (inst1 is-not inst2).
  ).
  (should "(a-class from obj) copies all fields of obj into a new empty instance and calls the activator on obj." (= ()
    (var cls (class empty).
    (var inst (cls from (@ x: 1).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 1 (inst x).

    (let cls (@:class c: 1 a: 1
      constructor: (= (x y) (c ++).
      activator: (= ()
        (a ++)
        (this "args" (arguments length).
    ).
    (let inst (cls from (@ x: 1).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 1 (inst x).
    (assert 1 (inst c).
    (assert 2 (inst a).
    (assert 1 (inst args).
  ).
  (should "(a-class from objects ...) copies all fields of all objects into a new instance and calls activator on each." (= ()
    (var cls (class empty).
    (var inst (cls of (@ x: 1) (@ y: 2).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 1 (inst x).
    (assert 2 (inst y).

    (let cls (@:class c: 1 a: 1
      constructor: (= (x y) (c ++).
      activator: (= ()
        (a ++).
        (this "args" (arguments length).
    ).
    (let inst (cls from (@ x: 2) (@ y: 3).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst not-empty).
    (assert 2 (inst x).
    (assert 3 (inst y).
    (assert 1 (inst c).
    (assert 3 (inst a).
    (assert 1 (inst args).
  ).
).

(define "(a-class as ...)" (= ()
  (should "(a-class as) returns the original class without modification." (= ()
    (var cls (class empty).
    (assert cls (cls as).
  ).
  (should "(a-class as def-obj) applies def-obj on the class and returns it." (= ()
    (var cls (class empty).
    (assert cls (cls as (@ x: 1 type: (@ y: 2).
    (assert 2 (cls y).

    (var inst (cls default).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst is-empty).
    (assert 1 (inst x).
    (assert null (inst y).
  ).
  (should "(a-class as another-class) applies the other class on this class and returns it." (= ()
    (var cls (class empty).
    (assert cls (cls as (@:class x: 1 type: (@ y: 2).
    (assert 2 (cls y).

    (var inst (cls default).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst is-empty).
    (assert 1 (inst x).
    (assert null (inst y).
  ).
  (should "(a-class as extensions ...) applies all extensions on this class and returns it." (= ()
    (var cls (@:class y: 1 type: (@ q: 1).
    (assert cls (cls as
      (@ x: 1 y: 2 type: (@ p: 3 q: 4).
      (@:class x: 10 xx: 11 type: (@ p: 30 pp: 33).
    ).
    (assert 1 (cls q).
    (assert 3 (cls p).
    (assert 33 (cls pp).

    (var inst (cls default).
    (assert (inst is-an object).
    (assert (inst is-a cls).
    (assert (inst is-empty).
    (assert 1 (inst x).
    (assert 11 (inst xx).
    (assert 1 (inst y).
    (assert null (inst p).
    (assert null (inst pp).
    (assert null (inst q).
  ).
).

(define "(a-class to-object ...)" (= ()
  (should "(a-class to-object) returns an empty object if this class is an empty class." (= ()
    (var obj ((class empty) to-object).
    (assert (obj is-an object).
    (assert (obj is-empty).
  ).
  (should "(a-class to-object) returns an object holding both type and instance members." (= ()
    (var cls (@:class x: 1 type: (@ y: 2).
    (var obj (cls to-object).
    (assert (obj is-an object).
    (assert (obj not-empty).
    (assert 2 ((obj type) y).
    (assert 1 (obj x).
    (assert null (obj y).
  ).
).

(define "(a-class is-sealed)" (= ()
  (should "(a-class is-sealed) returns true if the class is read-only." (= ()
    (var cat (@:class name: "Tom").
    (assert false (cat is-sealed).
    (cat seal)
    (assert (cat is-sealed).
  ).
).

(define "(a-class seal)" (= ()
  (should "(a-class seals) makes the class read-only and returns it." (= ()
    (var cat (@:class name: "Tom").
    (assert null (cat breed).
    (assert null (cat default:: age).
    (assert false (cat is-sealed).

    (cat as (@:class age: 10 type: (@ breed: 1).
    (assert 1 (cat breed).
    (assert 10 (cat default:: age).

    (cat seal)
    (assert (cat is-sealed).

    (cat as (@:class color: "red" type: (@ legs: 4).
    (assert 1 (cat breed).
    (assert null (cat legs).
    (assert 10 (cat default:: age).
    (assert null (cat default:: color).
  ).
).
