(var * (load "share/type" (@ the-type: object).

(define "Object Common Behaviours" (=> ()
  (define "Identity" (=> ()
    (should "an empty object is also identified by its instance." (= ()
      (assert ((@:) is-not (@:).
      (assert false ((@:) is (@:).

      (assert ((@:@) is-not (@:@).
      (assert false ((@:@) is (@:@).

      (assert ((@:object) is-not (@:object).
      (assert false ((@:object) is (@:object).

      (assert ((object empty) is-not (object empty).
      (assert false ((object empty) is (object empty).

      (assert ((object of) is-not (object of).
      (assert false ((object of) is (object of).
    ).
  ).

  (define "Equivalence" (= ()
    (should "an object's equivalence is defined as the same of its identity." (= ()
      (var a (@ x:1 y:10).
      (assert ($(a "is") is (a "equals").
      (assert ($(a "is-not") is (a "not-equals").
    ).
  ).

  (define "Ordering" (=> ()
    (should "comparison of an object with itself returns 0." (=> ()
      (for a in (the-values concat (@:) (@:))
        (assert 0 (a compare a).
      ).
    ).
    (should "comparison of two different objects return null." (=> ()
      (var values (the-values concat (@:) (@:).
      (for a in values
        (for b in values
          (if (a is-not b)
            (assert null (a compare b).
      ).
    ).
  ).

  (define "Emptiness" (= ()
    (should "an object is defined as empty if it has not field." (= ()
      (assert ((@:) is-empty).
      (assert false ((@:) not-empty).

      (assert ((object empty) is-empty).
      (assert false ((object empty) not-empty).

      (assert ((object of) is-empty).
      (assert false ((object of) not-empty).
    ).
  ).

  (define "Encoding" (=> ()
    (should "an object is encoded to a tuple." (=> ()
      (for value in (the-values concat (@:))
        (assert ((value to-code) is-a tuple).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "(object empty) is represented as (@:)." (=> ()
      (assert "(@:)" ((object empty) to-string).
      (assert "(@:)" ((object empty) to-string " ").
      (assert "(@:)" ((object empty) to-string "  ").
      (assert "(@:)" ((object empty) to-string "   ").
      (assert "(@:)" ((object empty) to-string " " " ").
      (assert "(@:)" ((object empty) to-string " " "  ").
      (assert "(@:)" ((object empty) to-string " " "   ").
    ).
  ).
).

(define "(object empty)" (= ()
  (should "(object empty) returns a new empty object." (= ()
    (var obj1 (object empty).
    (assert (obj1 is-empty).
    (assert 0 ((object fields-of obj1) length).

    (var obj2 (object empty).
    (assert (obj2 is-empty).
    (assert 0 ((object fields-of obj2) length).

    (assert (obj1 is-not obj2).
  ).
).

(define "(object of ...)" (= ()
  (should "(object of) returns a new empty object." (= ()
    (var obj (object of).
    (assert (obj is-empty).
    (assert 0 ((object fields-of obj) length).
  ).
  (should "(object of source ...) returns a new object with fields of all source objects." (= ()
    (var obj (object of (@ x: null).
    (var x "x").
    (assert null (obj x).
    (assert null (obj: x).
    (assert null (obj "x").
    (assert null (obj: "x").

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 1 (fields length).
    (assert "x" (fields 0).

    (let obj (object of (@ x: 1 y: 2).
    (assert 1 (obj x).
    (assert 1 (obj: x).
    (assert 1 (obj "x").
    (assert 1 (obj: "x").
    (var y "y").
    (assert 2 (obj y).
    (assert 2 (obj: y).
    (assert 2 (obj "y").
    (assert 2 (obj: "y").

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).

    (let obj (object of (@ x: 1 y: 2) (@ z: 3 y: 12).
    (assert 1 (obj x).
    (assert 1 (obj: x).
    (assert 1 (obj "x").
    (assert 1 (obj: "x").
    (var y "y").
    (assert 12 (obj y).
    (assert 12 (obj: y).
    (assert 12 (obj "y").
    (assert 12 (obj: "y").
    (var z "z").
    (assert 3 (obj z).
    (assert 3 (obj: z).
    (assert 3 (obj "z").
    (assert 3 (obj: "z").

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 3 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).
    (assert "z" (fields 2).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (object of (pair of 2).
    (assert null (obj x).
    (assert null (obj: x).
    (assert null (obj "x").
    (assert null (obj: "x").
    (var y "y").
    (assert 2 (obj y).
    (assert 2 (obj: y).
    (assert 2 (obj "y").
    (assert 2 (obj: "y").

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 1 (fields length).
    (assert "y" (fields 0).
  ).
).

(define "(object of-generic ...)" (= ()
  (should "(object of-generic) returns a new generic empty object." (= ()
    (var obj (object of-generic).
    (assert (obj is-empty).
    (assert 0 ((object fields-of obj) length).
  ).
  (should "(object of-generic source ...) returns a new generic object with fields of all source objects." (= ()
    (var obj (object of-generic (@ x: null).
    (var x "x").
    (assert null (obj x).
    (assert null (obj: x).
    (assert null (obj "x").
    (assert null (obj: "x").

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 1 (fields length).
    (assert "x" (fields 0).

    (let obj (object of-generic (@ x: 1 y: 2).
    (let fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).

    (let obj (object of-generic (@ x: 1 y: 2), (@ z: 3).
    (let fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 3 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).
    (assert "z" (fields 2).
).

(define "(object is-generic ...)" (= ()
  (should "(object is-generic) returns false." (= ()
    (assert false (object is-generic).
  ).
  (should "(object is-generic generic-obj) returns true." (= ()
    (assert true (object is-generic (object of-generic).
  ).
  (should "(object is-generic plain-obj) returns true." (= ()
    (assert false (object is-generic (object of-plain).
  ).
  (should "(object is-generic obj) returns false." (= ()
    (assert false (object is-generic (@:).
  ).
  (should "(object is-generic non-obj) returns false." (= ()
    (assert false (object is-generic null).
    (assert false (object is-generic type).

    (assert false (object is-generic true).
    (assert false (object is-generic false).

    (assert false (object is-generic -1).
    (assert false (object is-generic 0).
    (assert false (object is-generic 1).

    (assert false (object is-generic (string empty).
    (assert false (object is-generic (number empty).
    (assert false (object is-generic (date empty).
    (assert false (object is-generic (range empty).

    (assert false (object is-generic (symbol empty).
    (assert false (object is-generic (tuple empty).

    (assert false (object is-generic (lambda empty).
    (assert false (object is-generic (function empty).
    (assert false (object is-generic (operator empty).

    (assert false (object is-generic (iterator empty).
    (assert false (object is-generic (promise empty).

    (assert false (object is-generic (array empty).
    (assert false (object is-generic (object empty).
    (assert false (object is-generic (class empty).
    (assert false (object is-generic (class empty:: empty).
  ).
).

(define "(object not-generic ...)" (= ()
  (should "(object not-generic) returns true." (= ()
    (assert (object not-generic).
  ).
  (should "(object not-generic generic-obj) returns false." (= ()
    (assert false (object not-generic (object of-generic).
  ).
  (should "(object not-generic plain-obj) returns true." (= ()
    (assert (object not-generic (object of-plain).
  ).
  (should "(object not-generic obj) returns true." (= ()
    (assert (object not-generic (@:).
  ).
  (should "(object not-generic non-obj) returns true." (= ()
    (assert (object not-generic null).
    (assert (object not-generic type).

    (assert (object not-generic true).
    (assert (object not-generic false).

    (assert (object not-generic -1).
    (assert (object not-generic 0).
    (assert (object not-generic 1).

    (assert (object not-generic (string empty).
    (assert (object not-generic (number empty).
    (assert (object not-generic (date empty).
    (assert (object not-generic (range empty).

    (assert (object not-generic (symbol empty).
    (assert (object not-generic (tuple empty).

    (assert (object not-generic (lambda empty).
    (assert (object not-generic (function empty).
    (assert (object not-generic (operator empty).

    (assert (object not-generic (iterator empty).
    (assert (object not-generic (promise empty).

    (assert (object not-generic (array empty).
    (assert (object not-generic (object empty).
    (assert (object not-generic (class empty).
    (assert (object not-generic (class empty:: empty).
  ).
).

(define "(object of-plain ...)" (= ()
  (should "(object of-plain) returns a new generic empty object with null as the prototype." (= ()
    (var obj (object of-plain).
    (assert (obj is-empty).
    (assert 0 ((object fields-of obj) length).
  ).
  (should "(object of-plain source ...) returns a new generic object with fields of all source objects." (= ()
    (var obj (object of-plain (@ x: null).
    (var x "x").
    (assert null (obj x).
    (assert null (obj: x).
    (assert null (obj "x").
    (assert null (obj: "x").

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 1 (fields length).
    (assert "x" (fields 0).

    (let obj (object of-plain (@ x: 1 y: 2).
    (let fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).

    (let obj (object of-plain (@ x: 1 y: 2), (@ z: 3).
    (let fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 3 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).
    (assert "z" (fields 2).
).

(define "(object is-plain ...)" (= ()
  (should "(object is-plain) returns false." (= ()
    (assert false (object is-plain).
  ).
  (should "(object is-plain plain-obj) returns true." (= ()
    (assert true (object is-plain (object of-plain).
  ).
  (should "(object is-plain generic-obj) returns false." (= ()
    (assert false (object is-plain (object of-generic).
  ).
  (should "(object is-plain obj) returns false." (= ()
    (assert false (object is-plain (@:).
  ).
  (should "(object is-plain non-obj) returns false." (= ()
    (assert false (object is-plain null).
    (assert false (object is-plain type).

    (assert false (object is-plain true).
    (assert false (object is-plain false).

    (assert false (object is-plain -1).
    (assert false (object is-plain 0).
    (assert false (object is-plain 1).

    (assert false (object is-plain (string empty).
    (assert false (object is-plain (number empty).
    (assert false (object is-plain (date empty).
    (assert false (object is-plain (range empty).

    (assert false (object is-plain (symbol empty).
    (assert false (object is-plain (tuple empty).

    (assert false (object is-plain (lambda empty).
    (assert false (object is-plain (function empty).
    (assert false (object is-plain (operator empty).

    (assert false (object is-plain (iterator empty).
    (assert false (object is-plain (promise empty).

    (assert false (object is-plain (array empty).
    (assert false (object is-plain (object empty).
    (assert false (object is-plain (class empty).
    (assert false (object is-plain (class empty:: empty).
  ).
).

(define "(object not-plain ...)" (= ()
  (should "(object not-plain) returns true." (= ()
    (assert (object not-plain).
  ).
  (should "(object not-plain plain-obj) returns false." (= ()
    (assert false (object not-plain (object of-plain).
  ).
  (should "(object not-plain generic-obj) returns true." (= ()
    (assert (object not-plain (object of-generic).
  ).
  (should "(object not-plain obj) returns true." (= ()
    (assert (object not-plain (@:).
  ).
  (should "(object not-plain non-obj) returns true." (= ()
    (assert (object not-plain null).
    (assert (object not-plain type).

    (assert (object not-plain true).
    (assert (object not-plain false).

    (assert (object not-plain -1).
    (assert (object not-plain 0).
    (assert (object not-plain 1).

    (assert (object not-plain (string empty).
    (assert (object not-plain (number empty).
    (assert (object not-plain (date empty).
    (assert (object not-plain (range empty).

    (assert (object not-plain (symbol empty).
    (assert (object not-plain (tuple empty).

    (assert (object not-plain (lambda empty).
    (assert (object not-plain (function empty).
    (assert (object not-plain (operator empty).

    (assert (object not-plain (iterator empty).
    (assert (object not-plain (promise empty).

    (assert (object not-plain (array empty).
    (assert (object not-plain (object empty).
    (assert (object not-plain (class empty).
    (assert (object not-plain (class empty:: empty).
  ).
).

(define "(object assign ...)" (= ()
  (should "(object assign) returns null." (= ()
    (assert null (object assign).
  ).
  (should "(object assign target) returns target if target is an object." (= ()
    (var obj (@ x: 1).
    (assert obj (object assign obj).
  ).
  (should "(object assign target) returns null if target is not an object." (= ()
    (assert null (object assign (@).
    (assert null (object assign true).
    (assert null (object assign 100).
    (assert null (object assign (date of 100).
    (assert null (object assign (`x).
    (assert null (object assign (`(x y).
    (assert null (object assign (=).
    (assert null (object assign (=>).
    (assert null (object assign (=?).
  ).
  (should "(object assign target source ...) returns an updated target with fields of all source objects." (= ()
    (var obj (object of (@ x: 1).
    (assert 1 (obj x).
    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 1 (fields length).
    (assert "x" (fields 0).

    (assert obj (object assign obj (@ y: 2).
    (assert 1 (obj x).
    (assert 2 (obj y).

    (let fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).

    (assert obj (object assign obj (@ z: 3 y: 12).
    (assert 1 (obj x).
    (assert 12 (obj y).
    (assert 3 (obj z).

    (let fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 3 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).
    (assert "z" (fields 2).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert obj (object assign obj (@ z: 3).
    (assert 1 (obj x).
    (assert 2 (obj y).
    (assert 3 (obj z).

    (var fields (object fields-of obj).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "y" (fields 0).
    (assert "z" (fields 1).
  ).
).

(define "(object get ...)" (= ()
  (should "(object get) returns null." (= ()
    (assert null (object get).
  ).
  (should "(object get obj) returns null." (= ()
    (var obj (@ x: 1).
    (assert null (object get obj).
  ).
  (should "(object get target field) returns null if the target is not an object." (= ()
    (assert null (object get type "empty").
    (assert null (object get string "empty").
    (assert null (object get number "empty").
    (assert null (object get bool "empty").
    (assert null (object get date "empty").
    (assert null (object get range "empty").
    (assert null (object get symbol "empty").
    (assert null (object get tuple "empty").
    (assert null (object get operator "empty").
    (assert null (object get lambda "empty").
    (assert null (object get function "empty").
    (assert null (object get array "empty").
    (assert null (object get object "empty").
    (assert null (object get class "empty").

    (assert null (object get "xyz" "length").
    (assert null (object get 100 "equals").
    (assert null (object get true "equals").
    (assert null (object get (date of 1000) "equals").
    (assert null (object get (1 100) "begin").
    (assert null (object get (` x) "key").
    (assert null (object get (` (x y)) "length").
    (assert null (object get (=) "code").
    (assert null (object get (=>) "code").
    (assert null (object get (=?) "code").
    (assert null (object get (@ 1 2) "length").
  ).
  (should "(object get obj field) returns the value of field if it exists." (= ()
    (var obj (@ x: null y: 1).
    (assert null (object get obj "x").
    (assert null (object get obj (`x).
    (assert null (object get obj x).

    (assert 1 (object get obj "y").
    (assert 1 (object get obj (`y).
    (assert null (object get obj y).

    (var pair (@:class x: 1 z: null
      constructor: (= y (this "y" y) (let z 3).
    ).
    (let obj (pair of 2).
    (assert 1 (obj "x").
    (assert 1 (obj x).
    (assert 1 (object get obj "x").
    (assert 2 (object get obj (`y).
    (assert 3 (object get obj "z").

    (assert null (object get obj true).
    (assert null (object get obj 1).
    (assert null (object get obj (@).
    (assert null (object get obj (@:).
    (assert null (object get obj (=).
  ).
  (should "(object get obj field default-value) returns the default value if the field does not exist." (= ()
    (var obj (@ x: null y: 1).
    (assert 12 (object get obj "z" 12).
    (assert 15 (object get obj (`z) 15).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert 15 (object get obj (`z) 15).

    (assert 100 (object get obj true 100).
    (assert 100 (object get obj 1 100).
    (assert 100 (object get obj (@) 100).
    (assert 100 (object get obj (@:) 100).
    (assert 100 (object get obj (=) 100).
  ).
).

(define "(object set ...)" (= ()
  (should "(object set) returns null." (= ()
    (assert null (object set).
  ).
  (should "(object set obj) returns null." (= ()
    (var obj (@ x: 1).
    (assert null (object set obj).
  ).
  (should "(object set obj field) sets the value of field to null and returns null." (= ()
    (var obj (@ x: 1 y: 2).
    (assert null (object set obj "x").
    (assert null (obj x).
    (assert null (object set obj (`y).
    (assert null (obj y).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert null (object set obj "x").
    (assert null (obj x).
    (assert null (object set obj (`y).
    (assert null (obj y).
  ).
  (should "(object set obj field value) sets the value of field to value and returns it." (= ()
    (var obj (@ x: null y: 1).
    (assert 1 (object set obj "x" 1).
    (assert 1 (obj x).
    (assert 2 (object set obj (`y) 2).
    (assert 2 (obj y).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert 10 (object set obj "x" 10).
    (assert 10 (obj x).
    (assert 100 (object set obj (`y) 100).
    (assert 100 (obj y).
  ).
).

(define "(object reset ...)" (= ()
  (should "(object reset) returns 0." (= ()
    (assert 0 (object reset).
  ).
  (should "(object reset obj) returns 0." (= ()
    (var obj (@ x: 1).
    (assert 0 (object reset obj).
  ).
  (should "(object reset obj field) removes the field if it's owned by obj." (= ()
    (var obj (@ x: 1 y: 2).
    (assert 1 (object reset obj "x").
    (assert false (object owns obj "x").
    (assert false (object has obj "x").
    (assert null (obj x).

    (assert 1 (object reset obj (`y).
    (assert false (object owns obj "y").
    (assert false (object has obj "y").
    (assert null (obj y).

    (assert 1 (object reset obj (`z).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert 1 (object reset obj "x").
    (assert false (object owns obj "x").
    (assert (object has obj "x").
    (assert 1 (obj x).
    (assert 1 (object reset obj (`y).
    (assert false (object owns obj "y").
    (assert false (object has obj "y").
    (assert null (obj y).
  ).
  (should "(object reset obj field ...) resets multiple fields of obj." (= ()
    (var obj (@ x: null y: 1 p: 11).
    (assert 2 (object reset obj "x" "z").
    (assert false (object owns obj "x").
    (assert false (object has obj "x").
    (assert null (obj x).
    (assert 1 (obj y).

    (assert 3 (object reset obj (`y) "p" "q").
    (assert false (object owns obj "y").
    (assert false (object has obj "y").
    (assert null (obj y).
    (assert false (object owns obj "p").
    (assert false (object has obj "p").
    (assert null (obj p).

    (var pair (@:class x: 1 z: 3
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert 2 (object reset obj "x" (`y).
    (assert false (object owns obj "x").
    (assert (object has obj "x").
    (assert 1 (obj x).
    (assert false (object owns obj "y").
    (assert false (object has obj "y").
    (assert null (obj y).
    (assert false (object owns obj "z").
    (assert (object has obj "z").
    (assert 3 (obj z).
  ).
).

(define "(object copy ...)" (= ()
  (should "(object copy) returns null." (= ()
    (assert null (object copy).
  ).
  (should "(object copy src) returns null if src is not an object." (= ()
    (assert null (object copy null).
    (assert null (object copy type).
    (assert null (object copy string).
    (assert null (object copy number).
    (assert null (object copy bool).
    (assert null (object copy date).
    (assert null (object copy range).
    (assert null (object copy symbol).
    (assert null (object copy tuple).
    (assert null (object copy operator).
    (assert null (object copy lambda).
    (assert null (object copy function).
    (assert null (object copy array).
    (assert null (object copy object).
    (assert null (object copy class).

    (assert null (object copy "xyz").
    (assert null (object copy 100).
    (assert null (object copy true).
    (assert null (object copy (date of 1000)).
    (assert null (object copy (1 100).
    (assert null (object copy (` x).
    (assert null (object copy (` (x y).
    (assert null (object copy (=).
    (assert null (object copy (=>).
    (assert null (object copy (=?).
    (assert null (object copy (@:array 1: 2).
  ).
  (should "(object copy src) returns a copy of src with all its fields." (= ()
    (var src (@ x:1 y:null z: 3).
    (var obj (object copy src).
    (assert (obj is-not src).
    (assert (obj is-an object).
    (assert 1 (obj x).
    (assert true (object owns obj "y").
    (assert null (obj y).
    (assert 3 (obj z).
  ).
  (should "(object copy inst) returns a copy of inst and activates it if it's an instance of a class." (= ()
    (var cat (@:class
      name: "kitty"
      constructor: (= (name)
        (this "name" name).
      ).
      activator: (= ()
        (this "cloned" true)
      ).
    ).
    (assert (cat is-a class).
    (var tom (cat of "Tom").
    (assert (tom is-an object).
    (assert null (tom cloned).

    (var tomm (object copy tom).
    (assert (tomm is-not tom).
    (assert (tomm is-an object).

    (assert (tomm is-a cat).
    (assert "Tom" (tomm name).
    (assert (tomm cloned).
  ).
  (should "(object copy src fields ...) returns a copy of src by copying given fields." (= ()
    (var src (@ x:1 y:null z: 3).
    (var obj (object copy src "y" (`z).
    (assert (obj is-not src).
    (assert (obj is-an object).
    (assert false (object owns obj "x").
    (assert (object owns obj "y").
    (assert null (obj y).
    (assert 3 (obj z).
  ).
  (should "(object copy inst fields ...) returns a copy of inst by copying given fields and activates it if it's an instance of a class." (= ()
    (var cat (@:class
      name: "kitty"
      hate: "dog"
      constructor: (= (name)
        (if (name not-empty) (this "name" name).
      ).
      activator: (= ()
        (this "cloned" true)
      ).
    ).
    (assert (cat is-a class).
    (var tom (cat of "Tom").
    (assert (tom is-an object).
    (assert null (tom cloned).

    (var tomm (object copy tom "name" "hate").
    (assert (tomm is-not tom).
    (assert (tomm is-an object).

    (assert (tomm is-a cat).
    (assert (object owns tomm "name").
    (assert (object has tomm "name").
    (assert "Tom" (tomm name).

    (assert (object owns tomm "hate").
    (assert (object has tomm "hate").
    (assert "dog" (tomm hate).

    (assert (object owns tomm "cloned").
    (assert (object has tomm "cloned").
    (assert (tomm cloned).
  ).
).

(define "(object clear ...)" (= ()
  (should "(object clear) returns null." (= ()
    (assert null (object clear).
  ).
  (should "(object clear obj) returns null if obj is not an object." (= ()
    (assert null (object clear null).
    (assert null (object clear type).
    (assert null (object clear string).
    (assert null (object clear number).
    (assert null (object clear bool).
    (assert null (object clear date).
    (assert null (object clear range).
    (assert null (object clear symbol).
    (assert null (object clear tuple).
    (assert null (object clear operator).
    (assert null (object clear lambda).
    (assert null (object clear function).
    (assert null (object clear array).
    (assert null (object clear object).
    (assert null (object clear class).

    (assert null (object clear "xyz").
    (assert null (object clear 100).
    (assert null (object clear true).
    (assert null (object clear (date of 1000)).
    (assert null (object clear (1 100).
    (assert null (object clear (` x).
    (assert null (object clear (` (x y).
    (assert null (object clear (=).
    (assert null (object clear (=>).
    (assert null (object clear (=?).
    (assert null (object clear (@:array 1: 2).
  ).
  (should "(object clear obj) returns obj and removes all its fields." (= ()
    (var obj (@ x:1 y:null z: 3).
    (assert obj (object clear obj).
    (assert false (object owns obj "x").
    (assert false (object owns obj "y").
    (assert false (object owns obj "z").
  ).
  (should "(object clear inst) returns inst and removes all its fields if it's an instance of a class." (= ()
    (var cat (@:class
      name: "kitty"
      constructor: (= (name)
        (this "name" name).
      ).
    ).
    (assert (cat is-a class).
    (var tom (cat of "Tom").
    (assert (tom is-an object).

    (assert tom (object clear tom).
    (assert false (object owns tom "name").
    (assert "kitty" (tom name).
  ).
  (should "(object clear obj fields ...) returns obj and removes given fields." (= ()
    (var obj (@ x:1 y:null z: 3).
    (var obj (object clear obj "y" (`z).
    (assert (object owns obj "x").
    (assert 1 (obj x).
    (assert false (object owns obj "y").
    (assert false (object has obj "y").
    (assert false (object owns obj "z").
    (assert false (object has obj "z").
  ).
  (should "(object clear inst fields ...) returns inst and removes given fields if it's an instance of a class." (= ()
    (var cat (@:class
      name: "kitty"
      hate: "dog"
      constructor: (= (name)
        (this "name" name).
        (this "inner-name" name).
      ).
    ).
    (assert (cat is-a class).
    (var tom (cat of "Tom").
    (assert (tom is-an object).

    (assert tom (object clear tom "name" (` inner-name).
    (assert false (object owns tom "name").
    (assert (object has tom "name").
    (assert "kitty" (tom name).

    (assert false (object owns tom "inner-name").
    (assert false (object has tom "inner-name").
    (assert null (tom inner-name).
  ).
).

(define "(object remove ...)" (= ()
  (should "(object remove) returns null." (= ()
    (assert null (object remove).
  ).
  (should "(object remove src) returns null if src is not an object." (= ()
    (assert null (object remove null).
    (assert null (object remove type).
    (assert null (object remove string).
    (assert null (object remove number).
    (assert null (object remove bool).
    (assert null (object remove date).
    (assert null (object remove range).
    (assert null (object remove symbol).
    (assert null (object remove tuple).
    (assert null (object remove operator).
    (assert null (object remove lambda).
    (assert null (object remove function).
    (assert null (object remove array).
    (assert null (object remove object).
    (assert null (object remove class).

    (assert null (object remove "xyz").
    (assert null (object remove 100).
    (assert null (object remove true).
    (assert null (object remove (date of 1000)).
    (assert null (object remove (1 100).
    (assert null (object remove (` x).
    (assert null (object remove (` (x y).
    (assert null (object remove (=).
    (assert null (object remove (=>).
    (assert null (object remove (=?).
    (assert null (object remove (@:array 1: 2).
  ).
  (should "(object remove src) returns a copy of src with all its fields." (= ()
    (var src (@ x:1 y:null z: 3).
    (var obj (object remove src).
    (assert (obj is-not src).
    (assert (obj is-an object).
    (assert 1 (obj x).
    (assert true (object owns obj "y").
    (assert null (obj y).
    (assert 3 (obj z).
  ).
  (should "(object remove inst) returns a copy of inst and activates it if it's an instance of a class." (= ()
    (var cat (@:class
      name: "kitty"
      constructor: (= (name)
        (this "name" name).
      ).
      activator: (= ()
        (this "cloned" true)
      ).
    ).
    (assert (cat is-a class).
    (var tom (cat of "Tom").
    (assert (tom is-an object).
    (assert null (tom cloned).

    (var tomm (object remove tom).
    (assert (tomm is-not tom).
    (assert (tomm is-an object).

    (assert (tomm is-a cat).
    (assert "Tom" (tomm name).
    (assert (tomm cloned).
  ).
  (should "(object remove src fields ...) returns a copy of src by copying given fields." (= ()
    (var src (@ x:1 y:null z: 3).
    (var obj (object remove src "y" (`z).
    (assert (obj is-not src).
    (assert (obj is-an object).
    (assert (object owns obj "x").
    (assert 1 (obj x).
    (assert false (object owns obj "y").
    (assert null (obj y).
    (assert false (object owns obj "z").
    (assert null (obj z).
  ).
  (should "(object remove inst fields ...) returns a copy of inst by copying given fields and activates it if it's an instance of a class." (= ()
    (var cat (@:class
      name: "kitty"
      hate: "dog"
      constructor: (= (name)
        (if (name not-empty) (this "name" name).
      ).
      activator: (= ()
        (this "cloned" true)
      ).
    ).
    (assert (cat is-a class).
    (var tom (cat of "Tom").
    (assert (tom is-an object).
    (assert null (tom cloned).

    (var tomm (object remove tom "name" "hate").
    (assert (tomm is-not tom).
    (assert (tomm is-an object).

    (assert (tomm is-a cat).
    (assert false (object owns tomm "name").
    (assert (object has tomm "name").
    (assert "kitty" (tomm name).

    (assert false (object owns tomm "hate").
    (assert (object has tomm "hate").
    (assert "dog" (tomm hate).

    (assert (object owns tomm "cloned").
    (assert (object has tomm "cloned").
    (assert (tomm cloned).
  ).
).

(define "(object has ...)" (= ()
  (should "(object has) returns false." (= ()
    (assert false (object has).
  ).
  (should "(object has obj) returns false." (= ()
    (var obj (@ x: 1).
    (assert false (object has obj).
  ).
  (should "(object has target field) returns false if the target is not an object." (= ()
    (assert false (object has type "empty").
    (assert false (object has string "empty").
    (assert false (object has number "empty").
    (assert false (object has bool "empty").
    (assert false (object has date "empty").
    (assert false (object has range "empty").
    (assert false (object has symbol "empty").
    (assert false (object has tuple "empty").
    (assert false (object has operator "empty").
    (assert false (object has lambda "empty").
    (assert false (object has function "empty").
    (assert false (object has array "empty").
    (assert false (object has object "empty").
    (assert false (object has class "empty").

    (assert false (object has "xyz" "length").
    (assert false (object has 100 "equals").
    (assert false (object has true "equals").
    (assert false (object has (date of 1000) "equals").
    (assert false (object has (1 100) "begin").
    (assert false (object has (` x) "key").
    (assert false (object has (` (x y)) "length").
    (assert false (object has (=) "code").
    (assert false (object has (=>) "code").
    (assert false (object has (=?) "code").
    (assert false (object has (@ 1 2) "length").
  ).
  (should "(object has obj field) returns true if the field exists; otherwise returns false." (= ()
    (var obj (@ x: null y: 1).
    (assert true (object has obj "x").
    (assert true (object has obj (`x).
    (assert false (object has obj x).

    (assert true (object has obj "y").
    (assert true (object has obj (`y).
    (assert false (object has obj y).

    (assert false (object has obj "z").
    (assert false (object has obj (`z).
    (assert false (object has obj z).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert true (object has obj "x").
    (assert true (object has obj (`y).
    (assert false (object has obj (`z).

    (assert false (object has obj true).
    (assert false (object has obj 1).
    (assert false (object has obj (@).
    (assert false (object has obj (@:).
    (assert false (object has obj (=).
  ).
).

(define "(object owns ...)" (= ()
  (should "(object owns) returns false." (= ()
    (assert false (object owns).
  ).
  (should "(object owns obj) returns false." (= ()
    (var obj (@ x: 1).
    (assert false (object owns obj).
  ).
  (should "(object has target field) returns false if the target is not an object." (= ()
    (assert false (object owns type "empty").
    (assert false (object owns string "empty").
    (assert false (object owns number "empty").
    (assert false (object owns bool "empty").
    (assert false (object owns date "empty").
    (assert false (object owns range "empty").
    (assert false (object owns symbol "empty").
    (assert false (object owns tuple "empty").
    (assert false (object owns operator "empty").
    (assert false (object owns lambda "empty").
    (assert false (object owns function "empty").
    (assert false (object owns array "empty").
    (assert false (object owns object "empty").
    (assert false (object owns class "empty").

    (assert false (object owns "xyz" "length").
    (assert false (object owns 100 "equals").
    (assert false (object owns true "equals").
    (assert false (object owns (date of 1000) "equals").
    (assert false (object owns (1 100) "begin").
    (assert false (object owns (` x) "key").
    (assert false (object owns (` (x y)) "length").
    (assert false (object owns (=) "code").
    (assert false (object owns (=>) "code").
    (assert false (object owns (=?) "code").
    (assert false (object owns (@ 1 2) "length").
  ).
  (should "(object owns obj field) returns true if the field is directly owned by obj; otherwise returns false." (= ()
    (var obj (@ x: null y: 1).
    (assert true (object owns obj "x").
    (assert true (object owns obj (`x).
    (assert false (object owns obj x).

    (assert true (object owns obj "y").
    (assert true (object owns obj (`y).
    (assert false (object owns obj y).

    (assert false (object owns obj "z").
    (assert false (object owns obj (`z).
    (assert false (object owns obj z).

    (var pair (@:class x: 1
      constructor: (= y (this "y" y).
    ).
    (let obj (pair of 2).
    (assert false (object owns obj "x").
    (assert true (object owns obj (`y).
    (assert false (object owns obj (`z).

    (assert false (object owns obj true).
    (assert false (object owns obj 1).
    (assert false (object owns obj (@).
    (assert false (object owns obj (@:).
    (assert false (object owns obj (=).
  ).
).

(define "(object fields-of ...)" (= ()
  (should "(object fields-of) returns an empty array." (= ()
    (var fields (object fields-of).
    (assert (fields is-an array).
    (assert 0 (fields length).
  ).
  (should "(object fields-of target) returns an empty array if target is not an object." (= ()
    (var targets (@
      null type string number bool date range symbol tuple
      operator lambda function array object class
      "xyz" 100 true (date of 1000) (1 100) (` x) (` (x y))
      (=) (=>) (=?) (@ 1 2).
    ).
    (for target in targets
      (var fields (object fields-of target).
      (assert (fields is-an array).
      (assert 0 (fields length).
    ).
  ).
  (should "(object fields-of obj) returns an empty array if obj is an empty object." (= ()
    (var cat (@:class x: 1).
    (var targets (@ (@:) (object empty) (object of) (object from) (cat of) (cat empty).
    (for target in targets
      (var fields (object fields-of target).
      (assert (fields is-an array).
      (assert 0 (fields length).
    ).
  ).
  (should "(object fields-of obj) returns an array of field names." (= ()
    (var fields (object fields-of (@ x:1 y).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "x" (fields 0).
    (assert "y" (fields 1).

    (var cat (@:class x: 1
      constructor: (= y
        (this "y" y).
        (this "z" null).
      ).
    ).
    (var fields (object fields-of (cat of 2).
    (assert (fields is-an array).
    (assert 2 (fields length).
    (assert "y" (fields 0).
    (assert "z" (fields 1).
  ).
).

(define "(object is-sealed ...)" (=> ()
  (should "(object is-sealed) returns true." (=> ()
    (assert true (object is-sealed).
  ).
  (should "(object is-sealed obj) return true if obj is sealed." (=> ()
    (var obj (@: x:1).
    (assert false (object is-sealed obj).
    (assert obj (object seal obj).
    (assert (object is-sealed obj).
  ).
  (should "(object is-sealed inst) return true if the class instance is sealed." (=> ()
    (var inst (@:class x: 1 :: default).
    (assert false (object is-sealed inst).
    (assert inst (object seal inst).
    (assert (object is-sealed inst).
  ).
  (should "(object is-sealed an-array) return true if the array is sealed." (=> ()
    (var a (@ 1 2).
    (assert false (object is-sealed a).
    (assert a (object seal a).
    (assert (object is-sealed a).
  ).
  (should "(object is-sealed other-values) return false." (=> ()
    (assert false (object is-sealed "").
    (assert false (object is-sealed (=().
  ).
).

(define "(object seal ...)" (=> ()
  (should "(object seal) returns object." (=> ()
    (assert object (object seal).
  ).
  (should "(object seal obj) seals obj to make it read-only and returns it." (=> ()
    (var obj (@ x:1).
    (obj "y" 2)
    (assert 2 (obj y).
    (assert false (object is-sealed obj).

    (assert obj (object seal obj).
    (assert (object is-sealed obj).

    (obj "y" 2.2)
    (obj "z" 3)
    (assert 2 (obj y).
    (assert null (obj z).
  ).
  (should "(object seal inst) seals an instance of a class to make it read-only." (=> ()
    (var inst (@:class x:1 :: default).
    (inst "y" 2)
    (assert 2 (inst y).
    (assert false (object is-sealed inst).

    (assert inst (object seal inst).
    (assert (object is-sealed inst).

    (inst "y" 2.2)
    (inst "z" 3)
    (assert 2 (inst y).
    (assert null (inst z).
  ).
  (should "(object seal an-array) seals an array to make it read-only." (=> ()
    (var a (@ 1).
    (a push 2)
    (assert 2 (a length).
    (assert false (a is-sealed).

    (assert a (object seal a).
    (assert (a is-sealed).

    (a push 3)
    (assert 2 (a length).
  ).
  (should "(object seal other-values) does nothing to other values and returns null." (=> ()
    (var s "abc")
    (assert null (object seal s).
    (assert false (object is-sealed s).

    (var f (= (x, y) (+ x y).
    (assert null (object seal f).
    (assert false (object is-sealed f).
  ).
).

(define "(an-object iterate)" (= ()
  (should "(empty-obj iterate) returns an empty next function." (= ()
    (var next ((@:) iterate).
    (assert ($next is-a function).
    (assert null (next ).
  ).
  (should "(obj iterate) returns a non-empty next function." (= ()
    (var next ((@ x:1 y) iterate).
    (assert ($next is-a function).
    (var (k v) (next).
    (assert "x" k)
    (assert 1 v)
    (let (k v) (next).
    (assert "y" k)
    (assert null v)
  ).
  (should "(obj iterate) returns a non-empty next function." (= ()
    (var cat (@:class x: 1
      constructor: (= y
        (this "y" y).
        (this "z" null).
      ).
    ).
    (var next ((cat of 2) iterate).
    (assert ($next is-a function).
    (var (k v) (next).
    (assert "y" k)
    (assert 2 v)
    (let (k v) (next).
    (assert "z" k)
    (assert null v)
  ).
).

(define "(an-object to-code ...)" (= ()
  (should "(obj to-code) returns the code of an object." (= ()
    (var code ((@ x: 1) to-code).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert "(@ x: 1)" (code to-string).

    (var code ((@ x: 1  y: 2) to-code).
    (assert (code is-a tuple).
    (assert 7 (code length).
    (assert "(@ x: 1 y: 2)" (code to-string).

    (var code ((@ x: 1  y: 2 z: 3) to-code).
    (assert (code is-a tuple).
    (assert 10 (code length).
    (assert "(@ x: 1 y: 2 z: 3)" (code to-string).
  ).
  (should "(obj to-code) represent field name as string if it's any constant value." (= ()
    (for sym in (@ "null" "true" "false")
      (let obj (@:@ (sym): 1).
      (let code (obj to-code).
      (assert (code is-a tuple).
      (assert 4 (code length).
      (assert ((code 1) is-a string).
      (assert sym (code 1).
    ).
  ).
  (should "(obj to-code) represent field name as string if it's any special symbol." (= ()
    (var symbols (@
      "(" "`" "@" ":" "$" "\"" "#" ")" "'" "," ";" "\\" " " "\t" "\n" "\r"
    ).
    (for sym in symbols
      (let obj (@:@ (sym): 1).
      (let code (obj to-code).
      (assert (code is-a tuple).
      (assert 4 (code length).
      (assert ((code 1) is-a string).
      (assert sym (code 1).
    ).
  ).
  (should "(obj to-code) represent field name as string if it represents any number." (= ()
    (var symbols (@
      "0" "-1" ".1" "-.1" "0." ".0" "08" "0x1" "0b10" "12e-12" "12.0e12"
    ).
    (for sym in symbols
      (let obj (@:@ (sym): 1).
      (let code (obj to-code).
      (assert (code is-a tuple).
      (assert 4 (code length).
      (assert ((code 1) is-a string).
      (assert sym (code 1).
    ).
  ).
  (should "(obj to-code) returns the code of a lambda if it contains itself." (= ()
    (var obj (@ x: 1 y: 2).
    (obj "obj" obj).
    (var code (obj to-code).
    (var str (+
      "(=>: ()\n"
      "  (local _ (@ (@:)))\n"
      "  (object assign (_ 0) (@ x: 1 y: 2 obj: (_ 0)))\n"
      ")"
    ).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert 2 ((code 3) length).
    (assert str (code to-string).

    (let obj (code).
    (assert 1 (obj x).
    (assert 2 (obj y).
    (assert obj (obj obj).
  ).
  (should "(obj to-code) returns the code of a lambda if it contains multiple copies of another array." (= ()
    (var val (@ x: 1 y: 2).
    (let obj (@ z: 3 v1: val v2: val).
    (var code (obj to-code).
    (var str (+
      "(=>: ()\n"
      "  (local _ (@ (@:)))\n"
      "  (object assign (_ 0) (@ x: 1 y: 2))\n"
      "  (@ z: 3 v1: (_ 0) v2: (_ 0))\n"
      ")"
    ).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert 3 ((code 3) length).
    (assert str (code to-string).

    (let obj (code).
    (let val (obj v1).
    (assert val (obj v2).
    (assert 3 (obj z).
  ).
  (should "(obj to-code) returns the code of a lambda if it's a composite array." (= ()
    (var obj (@ x: 1).
    (var arr (@ 1 obj 2).
    (obj "arr" arr)
    (obj "obj" (@ y: 2 arr: arr).
    (var code (obj to-code).
    (var str (+
      "(=>: ()\n"
      "  (local _ (@ (@:) (@)))\n"
      "  ((_ 1) append (@ 1 (_ 0) 2))\n"
      "  (object assign (_ 0) (@ x: 1 arr: (_ 1) obj: (@ y: 2 arr: (_ 1))))\n"
      ")"
    ).
    (assert (code is-a tuple).
    (assert 4 (code length).
    (assert 3 ((code 3) length).
    (assert str (code to-string).

    (let obj (code).
    (let arr (obj arr).
    (assert 1 (obj x).
    (assert arr ((obj obj) arr).
    (assert 1 (arr 0).
    (assert obj (arr 1).
    (assert 2 (arr 2).
  ).
).

(define "Behaviour Completeness" (= ()
  (should "Any valid symbol can be used in field setting syntax)." (= ()
    (var obj (@:).
    (assert 1 (obj "is" 1).
    (assert 1 (obj "===" 1).
    (assert 1 (obj "is-not" 1).
    (assert 1 (obj "!==" 1).
    (assert 1 (obj "equals" 1).
    (assert 1 (obj "==" 1).
    (assert 1 (obj "not-equals" 1).
    (assert 1 (obj "!=" 1).
    (assert 1 (obj "compare" 1).
    (assert 1 (obj "is-empty" 1).
    (assert 1 (obj "not-empty" 1).
    (assert 1 (obj "is-a" 1).
    (assert 1 (obj "is-not-a" 1).
    (assert 1 (obj "to-code" 1).
    (assert 1 (obj "to-string" 1).
    (assert 1 (obj ":" 1).
    (assert 1 (obj "type" 1).
    (for field in (@
        "is" "===" "is-not" "!==" "equals" "==" "not-equals" "!="
        "compare" "is-empty" "not-empty" "is-a" "is-not-a"
        "to-code" "to-string" ":" "type"
      )
      (assert 1 (object get obj field).
    ).
  ).
  (should "Any valid symbol can be used as a field name in (object get) and (object set)." (= ()
    (var (obj v1 v2) (@ (@:) 1 2).
    (for field in (@
        "is" "===" "is-not" "!==" "equals" "==" "not-equals" "!="
        "compare" "is-empty" "not-empty" "is-a" "is-not-a"
        "to-code" "to-string" ":" "type"
      )
      (assert v1 (obj: field v1).
      (assert v1 (object get obj field).
      (assert v2 (object set obj field v2).
      (assert v2 (object get obj field).
    ).
  ).
  (should "An object's generic operations cannot be overridden." (= ()
    (var (obj ref) (@ (@:) (@:).
    (for field in (@
        "is" "===" "is-not" "!==" "equals" "==" "not-equals" "!="
        "compare" "is-empty" "not-empty" "is-a" "is-not-a"
        "to-code" "to-string" ":"
      )
      (assert (object has obj field).
      (assert false (object owns obj field).
      (assert 1 (object set obj field 1).
      (assert (object has obj field).
      (assert (object owns obj field).
      (assert ($(obj: field) is-bound).
      (assert ($(obj: field) equals (ref: field).
    ).
  ).
).
