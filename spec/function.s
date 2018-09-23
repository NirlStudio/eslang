(var the-type function)
(include "share/type")

(define "Function Common Behaviours" (=> ()
  (define "Identity" (= ()
    (should "an empty function is always the same." (= ()
      (var l1 (=>),
      (var l2 (=> (),
      (var l3 (=> x),
      (var l4 (=> (x),
      (assert (:l1 is-a function),
      (assert (:l2 is-a function),
      (assert (:l3 is-a function),
      (assert (:l4 is-a function),
      (assert (:l1 is l2),
      (assert false (:l1 is-not l2),

      (assert (:l1 is-not l3),
      (assert (:l2 is-not l3),
      (assert (:l1 is-not l4),
      (assert (:l2 is-not l4),

      (assert (:l3 is-not l4),
      (assert (:l4 is-not l3),
    ),
    (should "non-empty function code generates different function in each evaluation." (= ()
      (var code (` (=> x x),
      (var l1 (code),
      (var l2 (code),
      (:l1 is-a function)
      (:l2 is-a function)
      (assert (:l1 is-not l2),
      (assert false (:l1 is l2),
    ),
  ),

  (define "Equivalence" (= ()
    (should "a function's equivalence is defined as its identity." (= ()
      (var l (=> x x),
      (assert (:l is-a function),
      (assert (:(:l "is") is (:l "equals"),
      (assert (:(:l "is-not") is (:l "not-equals"),
    ),
  ),

  (define "Ordering" (= ()
    (should "comparing a function with itself returns 0." (= ()
      (var l (=> x x),
      (assert (:l is-a function),
      (assert 0 (:l compare l),
      (assert 0 (:(function empty) compare (function empty),
    ),
    (should "comparison of two functions returns null." (=> ()
      (var l1 (=> () null),
      (var l2 (=> () null),
      (assert (:l1 is-a function),
      (assert (:l2 is-a function),
      (assert null (:l1 compare l2),

      (let l1 (=> x x),
      (let l2 (=> x x),
      (assert (:l1 is-a function),
      (assert (:l2 is-a function),
      (assert null (:l1 compare l2),
    ),
  ),

  (define "Emptiness" (= ()
    (should "a function is defined as empty when its body is empty." (= ()
      (assert (:(=>) is-empty),
      (assert false (:(=>) not-empty),

      (assert (:(=> x) is-empty),
      (assert false (:(=> x) not-empty),

      (assert (:(=> (x y)) is-empty),
      (assert false (:(=> (x y)) not-empty),

      (assert false (:(=> () null) is-empty),
      (assert (:(=> () null) not-empty),

      (assert false (:(=> () 0) is-empty),
      (assert (:(=> () 0) not-empty),

      (assert false (:(=> x x) is-empty),
      (assert (:(=> x x) not-empty),

      (assert false (:(=> (x y) (+ x y)) is-empty),
      (assert (:(=> (x y) (+ x y)) not-empty),
    )
  ),

  (define "Encoding" (=> ()
    (should "a function is encoded to its code." (=> ()
      (for value
          in (the-values concat (function empty),
        (var code (:value to-code),
        (assert (code is-a tuple),
        (assert 3 (code length),
        (assert (symbol function) (code 0),
        (assert (((code 1) is-a tuple) ?
          ((code 1) not-plain)
          ((code 1) is-a symbol)
        ),
        (assert ((code 2) is-a tuple),
        (assert ((code 2) is-plain),
      ),
    ),
  ),

  (define "Representation" (=> ()
    (should "(function empty) is represented as (=> ())." (= ()
      (assert "(=> ())" (:(function empty) to-string),
    ),
    (should "a function is represented as its string value of its code." (=> ()
      (for value
          in (the-values concat (function empty),
        (var code (:value to-code),
        (assert (code to-string) (:value to-string),
      ),
    ),
  ),
),

(define "Constant Value" (= ()
  (define "(function noop)" (= ()
    (should "(function \"noop\") is a function with an empty parameters and an empty body." (= ()
      (assert (:(function "noop") is-a function),
      (assert "noop" (:(function "noop") name),

      (assert ((:(function "noop") parameters) is-a tuple),
      (assert ((:(function "noop") parameters) not-plain),
      (assert 0 ((:(function "noop") parameters) length),

      (assert ((:(function "noop") body) is-a tuple),
      (assert ((:(function "noop") body) is-plain),
      (assert 0 ((:(function "noop") parameters) length),
    ),
    (should "(function noop) always return null." (= ()
      (assert null (function noop),
      (var noop (function "noop"),
      (assert null (noop),
    ),
    (should "(function noop) is encoded to (tuple function)." (= ()
      (assert ((:(function "noop") to-code) is (tuple function),
    ),
  ),
),

(define "(function empty)" (= ()
  (should "(function \"empty\") is a generic lambda." (= ()
    (assert (:(function "empty") is-a lambda),
    (assert "empty" (:(function "empty") name),

    (assert (:(function "empty") is-generic),
    (assert false (:(function "empty") not-generic),
  ),
  (should "(function empty) returns (function \"noop\")." (= ()
    (assert (:(function empty) is (function "noop"),

    (var empty (function "empty"),
    (assert (:(empty) is (function "noop"),
  ),
),

(define "(function of)" (= ()
  (should "(function of) is only a placeholder generator and actually an alias of (function empty)." (= ()
    (assert (:(function of) is (function empty),
  ),
  (should "a local function can be dynamically generated by evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol function) (`x) (`(c + x),
    (var f (t),
    (assert (:f is-a function),
    (assert "value: null" (f),
    (assert "value: true" (f true),
    (assert "value: 100" (f 100),
  ),
  (should "an unsafe function can be dynamically generated by explicitly evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol function) (`x) (`((c ?? ": ") + x),
    (var f (eval t),
    (assert (:f is-a function),
    (assert ": null" (f),
    (assert ": true" (f true),
    (assert ": 100" (f 100),
  ),
),

(define "(a-func name)" (= ()
  (should "(:a-func name) returns (string empty) for an anonymous function." (= ()
    (assert "" (:(=> x) name),
  ),
  (should "(:a-func name) returns the function's name." (= ()
    (var f (=> x),
    (var ff f),
    (assert "f" (:f name),
    (assert "f" (:ff name),
  ),
),

(define "(a-func parameters)" (= ()
  (should "(:a-func parameters) returns (tuple empty) for a function without any parameter." (= ()
    (assert ((:(=> () null) parameters) is (tuple empty),
  ),
  (should "(:a-func parameters) returns a symbol when the function has only one parameter." (= ()
    (assert ((:(=> x) parameters) is (`x),
    (assert ((:(=> x x) parameters) is (`x),
    (assert ((:(=> (x)) parameters) is (`x),
    (assert ((:(=> (x) x) parameters) is (`x),
  ),
  (should "(:a-func parameters) returns a tuple when the function has multiple parameters." (= ()
    (assert (`(x y)) (:(=> (x y)) parameters),
    (assert (`(x y)) (:(=> (x  y) (+ x y)) parameters),
  ),
),

(define "(a-func body)" (= ()
  (should "(:a-func body) returns (tuple blank) for an empty function." (= ()
    (assert ((:(=>) body) is (tuple blank),
    (assert ((:(=> ()) body) is (tuple blank),
    (assert ((:(=> x) body) is (tuple blank),
  ),
  (should "(:a-func body) returns a plain tuple when the function is not empty." (= ()
    (assert ((`(null)) as-plain) (:(=> () null) body),
    (assert ((`((+ x y))) as-plain) (:(=> (x  y) (+ x y)) body),
    (assert ((`((var z 100 )(+ x y  z))) as-plain) (:(=> (x  y) (var z 100) (+ x y z)) body),
  ),
),

(define "(a-func is-generic)" (= ()
  (should "(:a-func is-generic) returns true for most runtime global functions." (= ()
    (assert (:eval is-a function),
    (assert (:eval is-generic),
    (assert (:print is-a function),
    (assert (:print is-generic),
  ),
  (should "(:a-func is-generic) returns false for functions generated by code." (= ()
    (assert false (:(=> () null) is-generic),
    (assert false (:(=> x) is-generic),
    (assert false (:(=> x x) is-generic),
    (assert false (:(=> (x y)) is-generic),
    (assert false (:(=> (x y) (+ x y)) is-generic),
  ),
),

(define "(a-func not-generic)" (= ()
  (should "(:a-func not-generic) returns false for some runtime functions." (= ()
    (assert (:eval is-a function),
    (assert false (:eval not-generic),
    (assert (:print is-a function),
    (assert false (:print not-generic),
  ),
  (should "(:a-func is-generic) returns true for functions generated by code." (= ()
    (assert (:(=> () null) not-generic),
    (assert (:(=> x) not-generic),
    (assert (:(=> x x) not-generic),
    (assert (:(=> (x y)) not-generic),
    (assert (:(=> (x y) (+ x y)) not-generic),
  ),
),

(define "(a-func apply ...)" (= ()
  (should "(:a-func apply) call the function with null as this and an empty argument list." (= ()
    (var f (=> x
      (assert (:do is-a function),
      (assert null this)
      (assert 0 (arguments length),
    ),
    (:f apply),
  ),
  (should "(:a-func apply this-value) call the function with this-value as this." (= ()
    (var obj (@ x: 1),
    (var f (=> x
      (assert (:do is-a function),
      (assert obj this)
      (assert 0 (arguments length),
    ),
    (:f apply obj),
  ),
  (should "(:a-func apply this-value args) call the function with this-value as this and elements in args as arguments." (= ()
    (var obj (@ x: 1),
    (var f (=> (x y)
      (assert (:do is-a function),
      (assert obj this)
      (assert 1 x)
      (assert 2 y)
      (assert 3 (arguments length),
      (assert 1 (arguments 0),
      (assert 2 (arguments 1),
      (assert 3 (arguments 2),
    ),
    (:f apply obj (@ 1 2 3),
  ),
  (should "(:a-func apply this-value value) call the function with this-value as this and value as the only argument if value is not an array." (= ()
    (var obj (@ x: 1),
    (var f (=> (x y)
      (assert (:do is-a function),
      (assert obj this)
      (assert 1 x)
      (assert null y)
      (assert 1 (arguments length),
      (assert 1 (arguments 0),
    ),
    (:f apply obj 1 true "x"),
  ),
),

(define "direct evaluation" (= ()
  (should "(a-func value ...) evaluates the function with null as this and all argument values." (= ()
    (var f (=> x
      (assert (:do is-a function),
      (assert null this)
      (assert true x)
      (assert 10 (arguments length),
      (assert true (arguments 0),
      (assert null (arguments 1),
      (assert 1 (arguments 2),
      (assert "x" (arguments 3),
      (assert (range empty) (arguments 4),
      (assert (symbol empty) (arguments 5),
      (assert (tuple empty) (arguments 6),
      (assert (operator empty) (arguments 7),
      (assert (lambda empty) (arguments 8),
      (assert (function empty) (arguments 9),
    ),
    (f true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
  ),
  (should "(s (:a-func) value ...) evaluates the function with s as this and all argument values." (= ()
    (var obj (@ x: 1),
    (var f (=> x
      (assert (:do is-a function),
      (assert obj this)
      (assert true x)
      (assert 10 (arguments length),
      (assert true (arguments 0),
      (assert null (arguments 1),
      (assert 1 (arguments 2),
      (assert "x" (arguments 3),
      (assert (range empty) (arguments 4),
      (assert (symbol empty) (arguments 5),
      (assert (tuple empty) (arguments 6),
      (assert (operator empty) (arguments 7),
      (assert (lambda empty) (arguments 8),
      (assert (function empty) (arguments 9),
    ),
    (assert f (:f),
    (assert (:(:f) is f),
    (obj (:f) true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
  ),
  (should "(s (= ...) value ...) evaluates the anonymous function with s as this and all argument values." (= ()
    (var obj (@ x: 1),
    (obj
      (=> x
        (assert (:do is-a function),
        (assert obj this)
        (assert true x)
        (assert 10 (arguments length),
        (assert true (arguments 0),
        (assert null (arguments 1),
        (assert 1 (arguments 2),
        (assert "x" (arguments 3),
        (assert (range empty) (arguments 4),
        (assert (symbol empty) (arguments 5),
        (assert (tuple empty) (arguments 6),
        (assert (operator empty) (arguments 7),
        (assert (lambda empty) (arguments 8),
        (assert (function empty) (arguments 9),
      ),
      true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty)
    ),
  ),
),

(define "anonymous evaluation" (= ()
  (should "(=:() ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> :()
      (assert (:do is-a function),
      (assert null this)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=():() ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> ():()
      (assert (:do is-a function),
      (assert null this)
      (assert null x)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=:x ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> :x
      (assert (:do is-a function),
      (assert null this)
      (assert null x)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=():x ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> ():x
      (assert (:do is-a function),
      (assert null this)
      (assert null x)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=():(x ...) ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=>():(x y)
      (assert (:do is-a function),
      (assert null this)
      (assert null x)
      (assert null y)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=(value ...):x ...) evaluates the anonymous function with null as this and all argument values." (= ()
    (=>
      (true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
    : x
      (assert (:do is-a function),
      (assert null this)
      (assert true x)
      (assert 10 (arguments length),
      (assert true (arguments 0),
      (assert null (arguments 1),
      (assert 1 (arguments 2),
      (assert "x" (arguments 3),
      (assert (range empty) (arguments 4),
      (assert (symbol empty) (arguments 5),
      (assert (tuple empty) (arguments 6),
      (assert (operator empty) (arguments 7),
      (assert (lambda empty) (arguments 8),
      (assert (function empty) (arguments 9),
    ),
  ),
  (should "(=(value ...):(x ...) ...) evaluates the anonymous function with null as this and all argument values." (= ()
    (=>
      (true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
    : (x y z)
      (assert (:do is-a function),
      (assert null this)
      (assert true x)
      (assert null y)
      (assert 1 z)
      (assert 10 (arguments length),
      (assert true (arguments 0),
      (assert null (arguments 1),
      (assert 1 (arguments 2),
      (assert "x" (arguments 3),
      (assert (range empty) (arguments 4),
      (assert (symbol empty) (arguments 5),
      (assert (tuple empty) (arguments 6),
      (assert (operator empty) (arguments 7),
      (assert (lambda empty) (arguments 8),
      (assert (function empty) (arguments 9),
    ),
  ),
),

(define "(do ...): recusive call" (= ()
  (should "variable 'do' refers to current callee function." (= ()
    (var f (=> ()
      (assert (:do is-a function),
      (assert (:do is f),
      (assert null this),
    ),
    (f)
  ),
  (should "'do' can be used to implementation recursive call in a function." (= ()
    (var base 0)
    (assert 5050 (=> 100: x
      (base += x)
      ((x <= 1) ? base (do (x - 1),
    ),
    (assert 5050 base)
    (var sum (=> x
      (base += x)
      ((x <= 1) ? base (do (x - 1),
    ),
    (let base 1)
    (assert 5051 (sum 100),
    (assert 5051 base)
  ),
),

(define "(redo ...): tail recusion elimination" (= ()
  (should "'redo' is a special global operator, so is a pure symbol." (= ()
    (var f (=> ()
      (assert (:redo is redo),
      (assert (:redo is (`redo),
      (assert null this),
    ),
    (f)
  ),
  (should "'redo' can be used to elminate tail recursion call." (= ()
    (var base 0)
    (assert 5000050000 (=> 100000: x
      (base += x)
      ((x <= 1) ? base (redo (x - 1),
    ),
    (assert 5000050000 base)
    (var sum (=> x
      (base += x)
      ((x <= 1) ? base (redo (x - 1),
    ),
    (let base 1)
    (assert 5000050001 (sum 100000),
    (assert 5000050001 base)
  ),
),

(define "variable scope" (= ()
  (should "a function is impacted by variables in its owner scope." (= ()
    (var x 1)
    (=>:() (assert 1 x),
  ),
  (should "a function is impacted by variables in its owner scope." (= ()
    (var x 1)
    (=>:() (assert 1 x),
  ),
  (should "a function is impacted by variables in its outer owner scope." (= ()
    (var x 1)
    (=>:()
      (var y 2)
      (=>:()
        (assert 1 x)
        (assert 2 y)
      ),
    ),
  ),
  (should "a function may impact other variables in its own scope." (= ()
    (var x 1)
    (var y)
    (var result (=>:()
      (var xx x)
      (let x 100)
      (let y 200)
      (let z 300)
      xx
    ),
    (assert 100 x)
    (assert 200 y)
    (assert null z)
    (assert 1 result)
  ),
  (should "a function may impact other variables in its outer own scope." (= ()
    (var x 1)
    (var x_ 1)
    (var result (=>:()
      (var xx x)
      (assert 1 x "inner x(1) should be 1.")
      (assert 1 x_ "inner x_(1) should be 1.")
      (var x_)
      (assert null x_ "inner x_(2) should be null.")
      (let x_ 100)
      (assert 100 x_ "inner x_(3) should be 100.")
      (var y 2)
      (let x 100)
      (assert 100 x "inner x(2) should be 100.")
      (=>:()
        (let xxx x)
        (let x 1000)
        (assert 1000 x "inner most x should be 1000.")
        (let y 2000)
        (assert 2000 y "inner most y should be 2000.")
        (let z 3000)
        (assert 3000 z "inner most z should be 3000.")
      ),
    ),
    (assert null result)
    (assert 1000 x)
    (assert 1 x_)
    (assert null xx)
    (assert null xxx)
    (assert null y)
    (assert null z)
  ),
),
