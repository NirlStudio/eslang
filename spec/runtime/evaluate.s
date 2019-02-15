(define "()" (= ()
  (should "() returns null." (= ()
    (assert (() is null).
  ).
).

(define "(?)" (= ()
  (should "(a-symbol) returns its value resolved in current context." (= ()
    (var x 1)
    (assert 1 ((`x).

    (let y 2)
    (assert 2 ((`y).

    (local z 3)
    (assert 3 ((`z).

    (var f (=() ((`this).
    (var t (100 ($f).
  ).
  (should "(a-tuple) evaluates the tuple in current context." (= ()
    (var x 1)
    (let y 2)
    (local z 3)
    (assert 106 ((quote + x y z (let x 100).
    (assert 100 x)
  ).
  (should "(a-plain-tuple) evaluates each statement in current context." (= ()
    (var x 1)
    (let y 2)
    (local z 3)
    (assert 4 ((unquote (+ x y) (+ y z) (let y 102) (+ z x).
    (assert 102 y)
  ).
  (should "(a-lambda) calls the lambda without argument." (= ()
    (var x 1)
    (assert 110 ((=> (x y) (+ (x ?? 100) (y ?? 10).
  ).
  (should "(a-function) calls the function without argument." (= ()
    (var x 1)
    (assert 101 ((=> y (+ x (y ?? 100).
  ).
  (should "(an-operator) returns null." (= ()
    (var x 1)
    (let y 2)
    (local z 3)
    (assert 106 ((=? C (+ x y z (C ?? 100).
  ).
  (should "(a-value) returns the original value." (= ()
    (var values (@
      null type
      bool true false
      string "" " " "A"
      number 0 -0 -1 1
      date (date of 0) (date of 1) (date of -1)
      range (1 1) (1 10)
      symbol tuple operator lambda function
      array (@) (@ 1 2)
      object (@:) (@ x:1)
      class (class empty) (@:class x:1)
      ((class empty) default)
    ).
    (for value in values
      (assert ((value) is value).
    ).
  ).
).

(var cat (@:class
  type: (@
    indexer: (=() (arguments copy).
  ).
  z: 10
  +: (= (x y) (+ x y z).
  f: (=> (x y) (+ x y z).
  op: (=? (X Y) (+ (X) (Y) (that z).
).

(define "(? ? ...)" (=> ()
  (should "(an-operator arg ...) invokes the operator with the argument(s)." (= ()
    (var sum (=? (X Y) (+ (X) (Y ?? 100).
    (assert 101 (sum 1).
    (assert 3 (sum 1 2).
  ).
  (should "(a-lambda arg ...) call the lambda with the argument(s)." (= ()
    (var z 3)
    (var sum (= (x y) (+ x (y ?? 10) (z ?? 100).
    (assert 111 (sum 1).
    (assert 103 (sum 1 2).
    (assert 103 (sum 1 2 3).
  ).
  (should "(a-function arg ...) calls the function with the argument(s)." (= ()
    (var z 3)
    (var sum (=> (x y) (+ x (y ?? 10) (z ?? 100).
    (assert 14 (sum 1).
    (assert 6 (sum 1 2).
    (assert 6 (sum 1 2 3).
  ).
  (define "(a-value a-string)" (=> ()
    (should "(a-value field) returns the value of field or null." (=> ()
      (var obj (@ z: 10).
      (assert 10 ($obj "z").

      (let obj (cat default).
      (assert 10 ($obj "z").
    ).
    (should "(a-value method) returns the bound method if it's an instance method." (=> ()
      (var length ("123" "length").
      (assert ($length is-a lambda).
      (assert ($length is-bound).
      (assert 3 (length).

      (var obj (cat default).
      (var sum (obj "+").
      (assert ($sum is-a lambda).
      (assert ($sum is-bound).
      (assert 13 (sum 1 2).
      (obj "z" 100).
      (assert 103 (sum 1 2).
    ).
    (should "(a-value method) returns the original method if it's not an instance method." (=> ()
      (var obj (@ z: 10 sum: (= (x y) (+ x y (this "z").
      (var sum (obj "sum").
      (assert ($sum is-a lambda).
      (assert ($sum not-bound).
      (assert 3 (sum 1 2).
      (obj "z": 100)
      (assert 3 (sum 1 2).

      (let obj (@:cat
        sum: (=> (x y) (+ x y (this "z")
      ).
      (let sum (obj "sum").
      (assert ($sum is-a function).
      (assert ($sum not-bound).
      (assert 3 (sum 1 2).
      (obj "z": 100)
      (assert 3 (sum 1 2).
    ).
    (should "(an-object key a-value) sets the member value of key to a-value." (=> ()
      (var obj (@ z: 10 sum: (= (x y) (+ x y (this "z").
      (var z (obj "z" 100).
      (assert 100 z).
      (assert 100 (obj "z").

      (var sum (obj "sum" (= x (+ x x).
      (assert 2 (obj sum 1).
      (assert 2 (obj sum 1 2).

      (let obj (cat default).
      (let z (obj "z" 100).
      (assert 100 z).
      (assert 100 (obj "z").

      (let sum (obj "sum" (= x (+ x x).
      (assert 2 (obj sum 1).
      (assert 2 (obj sum 1 2).
    ).
  ).
  (define "(a-value a-symbol)" (=> ()
    (should "(a-value member-field ...) returns the value of the field." (=> ()
      (var obj (@ z: 10).
      (assert 10 ($obj z).

      (let obj (cat default).
      (assert 10 ($obj z).
    ).
    (should "(a-value member-operator ...) calls the member operator with all arguments." (=> ()
      (var obj (@ z: 10
        op: (=? (X Y) (+ (X) (Y) (that z).
      ).
      (assert 13 (obj op 1 2).
      (obj "z" 100).
      (assert 103 (obj op 1 2 1000).

      (let obj (cat default).
      (assert 13 (obj op 1 2).
      (obj "z" 100).
      (assert 103 (obj op 1 2 1000).
    ).
    (should "(a-value member-lambda ...) calls the member lambda with all arguments." (=> ()
      (assert 3 ("123" length).
      (assert 3 ("123" length 100).

      (var obj (@ z: 10
        +: (= (x y) (+ x y z).
      ).
      (assert 13 (obj + 1 2).
      (obj "z" 100).
      (assert 103 (obj + 1 2 1000).

      (let obj (cat default).
      (assert 13 (obj + 1 2).
      (obj "z" 100).
      (assert 103 (obj + 1 2 1000).
    ).
    (should "(a-value member-function ...) calls the member function with all arguments." (=> ()
      (var obj (@
        f: (=> (x y) (+ x y z).
      ).
      (var z 10)
      (assert 13 (obj f 1 2).
      (let z 100).
      (assert 103 (obj f 1 2 1000).

      (var obj (cat default).
      (assert 13 (obj f 1 2).
      (obj "z" 100).
      (assert 103 (obj f 1 2 1000).
    ).
  ).
  (should "(a-value an-operator ...) invokes the operator on the value and with the argument(s)." (= ()
    (var sum (=? (X Y) (+ that (X) (Y ?? 100).
    (assert 1101 (1000 ($sum) 1).
    (assert 1003 (1000 ($sum) 1 2).
  ).
  (should "(a-value a-lambda ...) call the lambda on the value with the argument(s)." (= ()
    (var z 3)
    (var sum (= (x y) (+ this x (y ?? 10) (z ?? 100).
    (assert 1111 (1000 ($sum) 1).
    (assert 1103 (1000 ($sum) 1 2).
    (assert 1103 (1000 ($sum) 1 2 3).
  ).
  (should "(a-value a-function ...) calls the function on the value with the argument(s)." (= ()
    (var z 3)
    (var sum (=> (x y) (+ this x (y ?? 10) (z ?? 100).
    (assert 1014 (1000 ($sum) 1).
    (assert 1006 (1000 ($sum) 1 2).
    (assert 1006 (1000 ($sum) 1 2 3).
  ).
  (should "(a-value values ...) passes all values to inner indexer." (=> ()
    (var values (@
      null type
      bool true false
      string
      number 0 -0 -1 1
      date (date of 0) (date of 1) (date of -1)
      range (1 1) (1 10)
      symbol
      tuple (quote) (quote x y)
      operator lambda function
      array (@) (@ 1 2)
      object (@:) (@ x:1)
      class (class empty) (@:class x:1)
      ((class empty) default)
    ).
    (var obj (cat default).
    (for value in values
      (var args (obj ($value) value 1).
      (assert (args is-a array).
      (assert 3 (args length).
      (assert value (args 0).
      (assert value (args 1).
      (assert 1 (args 2).
    ).
  ).
).

(define "($?) - noop" (= ()
  (should "($) returns null." (= ()
    (assert (($) is null).
  ).
  (should "($a-value) always returns the value." (= ()
    (var values (@
      null type
      bool true false
      string "" " " "x"
      number 0 -0 -1 1
      date (date of 0) (date of 1) (date of -1)
      range (1 1) (1 10)
      symbol (symbol empty) (`x)
      tuple (quote) (quote x y)
      operator (operator empty) (=? (X Y) (+ (X) (Y).
      lambda (lambda empty) (= (x y) (+ x y).
      function (function empty) (=> (x y) (+ x y).
      array (@) (@ 1 2)
      object (@:) (@ x:1)
      class (class empty) (@:class x:1)
      ((class empty) default)
    ).
    (for value in values
      (assert value ($value).
    ).
  ).
).

(define "($? ? ...) - explicit subject" (=> ()
  (define "($an-entity a-string)" (=> ()
    (should "($an-entity field) returns the value of field or null." (=> ()
      (var obj (@ z: 10).
      (assert 10 ($obj "z").

      (let obj (cat default).
      (assert 10 ($obj "z").
    ).
    (should "($an-entity method) returns the bound method if it's an instance method." (=> ()
      (var length ($"123" "length").
      (assert ($length is-a lambda).
      (assert ($length is-bound).
      (assert 3 (length).

      (var obj (cat default).
      (var sum ($obj "+").
      (assert ($sum is-a lambda).
      (assert ($sum is-bound).
      (assert 13 (sum 1 2).
      (obj "z" 100).
      (assert 103 (sum 1 2).

      (let sum ($obj "f").
      (assert ($sum is-a function).
      (assert ($sum is-bound).
      (assert 103 (sum 1 2).
      (obj "z" 10).
      (assert 13 (sum 1 2).

      (let sum (= x).
      (var name ($sum "name").
      (assert ($name is-a lambda).
      (assert ($name is-bound).
      (assert "sum" (name).

      (let sum (=> x).
      (let name ($sum "name").
      (assert ($name is-a lambda).
      (assert ($name is-bound).
      (assert "sum" (name).

      (let sum (=? X).
      (let name ($sum "name").
      (assert ($name is-a lambda).
      (assert ($name is-bound).
      (assert "sum" (name).
    ).
    (should "($an-entity method) returns the original method if it's not an instance method." (=> ()
      (var obj (@ z: 10 sum: (= (x y) (+ x y (this "z").
      (var sum ($obj "sum").
      (assert ($sum is-a lambda).
      (assert ($sum not-bound).
      (assert 3 (sum 1 2).
      (obj "z": 100)
      (assert 3 (sum 1 2).

      (let obj (@:cat
        sum: (=> (x y) (+ x y (this "z")
      ).
      (let sum ($obj "sum").
      (assert ($sum is-a function).
      (assert ($sum not-bound).
      (assert 3 (sum 1 2).
      (obj "z": 100)
      (assert 3 (sum 1 2).
    ).
    (should "($an-object key a-value) sets the member value of key to a-value." (=> ()
      (var obj (@ z: 10 sum: (= (x y) (+ x y (this "z").
      (var z ($obj "z" 100).
      (assert 100 z).
      (assert 100 (obj "z").

      (var sum ($obj "sum" (= x (+ x x).
      (assert 2 (obj sum 1).
      (assert 2 (obj sum 1 2).

      (let obj (cat default).
      (let z ($obj "z" 100).
      (assert 100 z).
      (assert 100 (obj "z").

      (let sum ($obj "sum" (= x (+ x x).
      (assert 2 (obj sum 1).
      (assert 2 (obj sum 1 2).
    ).
  ).
  (define "($an-entity a-symbol)" (=> ()
    (should "($an-entity member-field ...) returns the value of the field." (=> ()
      (var obj (@ z: 10).
      (assert 10 ($obj z).

      (let obj (cat default).
      (assert 10 ($obj z).
    ).
    (should "($an-entity member-operator ...) calls the member operator with all arguments." (=> ()
      (var obj (@ z: 10
        op: (=? (X Y) (+ (X) (Y) (that z).
      ).
      (assert obj ($obj ?? 100).
      (assert 13 ($obj op 1 2).
      (obj "z" 100).
      (assert 103 ($obj op 1 2 1000).

      (let obj (cat default).
      (assert obj ($obj ?? 100).
      (assert 13 ($obj op 1 2).
      (obj "z" 100).
      (assert 103 ($obj op 1 2 1000).
    ).
    (should "($an-entity member-lambda ...) calls the member lambda with all arguments." (=> ()
      (assert 3 ("123" length).
      (assert 3 ("123" length 100).

      (var obj (@ z: 10
        +: (= (x y) (+ x y z).
      ).
      (assert ($obj is obj).
      (assert 13 ($obj + 1 2).
      (obj "z" 100).
      (assert 103 ($obj + 1 2 1000).

      (let obj (cat default).
      (assert ($obj is obj).
      (assert 13 ($obj + 1 2).
      (obj "z" 100).
      (assert 103 ($obj + 1 2 1000).
    ).
    (should "($an-entity member-function ...) calls the member function with all arguments." (=> ()
      (var obj (@
        f: (=> (x y) (+ x y z).
      ).
      (var z 10)
      (assert 13 ($obj f 1 2).
      (let z 100).
      (assert 103 ($obj f 1 2 1000).

      (var obj (cat default).
      (assert 13 ($obj f 1 2).
      (obj "z" 100).
      (assert 103 ($obj f 1 2 1000).
    ).
  ).
  (should "($an-entity an-operator ...) invokes the operator on the value and with the argument(s)." (= ()
    (var sum (=? (X Y) (+ that (X) (Y ?? 100).
    (assert 1101 ($1000 ($sum) 1).
    (assert 1003 ($1000 ($sum) 1 2).

    (let sum (=? (X Y) (+ (X) (Y).
    (var call (=? (A B) (that A B).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).

    (let sum (= (x y) (+ x y).
    (let call (=? (A B) (that (A) (B).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).

    (let sum (=> (x y) (+ x y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).
  ).
  (should "($an-entity a-lambda ...) call the lambda on the value with the argument(s)." (= ()
    (var z 3)
    (var sum (= (x y) (+ this x (y ?? 10) (z ?? 100).
    (assert 1111 ($1000 ($sum) 1).
    (assert 1103 ($1000 ($sum) 1 2).
    (assert 1103 ($1000 ($sum) 1 2 3).

    (let sum (=? (X Y) (+ (X) (Y).
    (var call (= (x y) (this x y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).

    (let sum (= (x y) (+ x y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).

    (let sum (=> (x y) (+ x y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).
  ).
  (should "($an-entity a-function ...) calls the function on the value with the argument(s)." (= ()
    (var z 3)
    (var sum (=> (x y) (+ this x (y ?? 10) (z ?? 100).
    (assert 1014 ($1000 ($sum) 1).
    (assert 1006 ($1000 ($sum) 1 2).
    (assert 1006 ($1000 ($sum) 1 2 3).

    (var call (=> (x y) (this x y).
    (let sum (=? (X Y) (+ (X) (Y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).

    (let sum (= (x y) (+ x y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).

    (let sum (=> (x y) (+ x y).
    (assert 1 ($sum ($call) 1).
    (assert 3 ($sum ($call) 1 2).
  ).
  (should "($an-entity values ...) passes all values to inner indexer." (=> ()
    (var values (@
      null type
      bool true false
      string
      number 0 -0 -1 1
      date (date of 0) (date of 1) (date of -1)
      range (1 1) (1 10)
      symbol
      tuple (quote) (quote x y)
      operator lambda function
      array (@) (@ 1 2)
      object (@:) (@ x:1)
      class (class empty) (@:class x:1)
      ((class empty) default)
    ).
    (var obj (cat default).
    (for value in values
      (var args ($obj ($value) value 1).
      (assert (args is-a array).
      (assert 3 (args length).
      (assert value (args 0).
      (assert value (args 1).
      (assert 1 (args 2).
    ).
  ).
).
