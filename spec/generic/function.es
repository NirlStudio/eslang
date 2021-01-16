(var * (load "share/type" (@ the-type: function).

(define "Function Common Behaviors" (=> ()
  (define "Identity" (= ()
    (should "an empty function without parameters is always the same." (= ()
      (var f1 (=>).
      (var f2 (=> ().
      (var f3 (=> x).
      (var f4 (=> (x).
      (assert ($f1 is-a function).
      (assert ($f2 is-a function).
      (assert ($f3 is-a function).
      (assert ($f4 is-a function).
      (assert ($f1 is f2).
      (assert false ($l1 is-not l2).

      (assert ($f1 is-not f3).
      (assert ($f2 is-not f3).
      (assert ($f1 is-not f4).
      (assert ($f2 is-not f4).

      (assert ($f3 is-not f4).
      (assert ($f4 is-not f3).
    ).
    (should "non-empty function code generates different operators in each evaluation." (= ()
      (var code (` (=> x x).
      (var f1 (code).
      (var f2 (code).
      (assert ($f1 is-a function).
      (assert ($f2 is-a function).
      (assert ($f1 is-not f2).
      (assert false ($f1 is f2).
    ).
  ).

  (define "Equivalence" (= ()
    (should "al bound functions are equivalent with the original bound target and each others." (= ()
      (var f (=> () this).
      (var f1 ($f bind 1).
      (var f2 ($f bind 2).

      (assert null (f).
      (assert 1 (f1).
      (assert 2 (f2).

      (assert ($f is-a function).
      (assert ($f1 is-a function).
      (assert ($f2 is-a function).

      (assert ($f equals f).
      (assert false ($f not-equals f).

      (assert ($f equals f1).
      (assert false ($f not-equals f1).

      (assert ($f1 equals f).
      (assert false ($f1 not-equals f).

      (assert ($f1 equals f2).
      (assert false ($f1 not-equals f2).
    ).
  ).

  (define "Ordering" (= ()
    (should "comparing a function with itself returns 0." (= ()
      (var f (=> x x).
      (assert ($f is-a function).
      (assert 0 ($f compare f).
      (assert 0 ($(function empty) compare (function empty).
    ).
    (should "comparison of two functions returns null." (=> ()
      (var f1 (=> () null).
      (var f2 (=> () null).
      (assert ($f1 is-a function).
      (assert ($f2 is-a function).
      (assert null ($f1 compare f2).

      (let f1 (=> x x).
      (let f2 (=> x x).
      (assert ($f1 is-a function).
      (assert ($f2 is-a function).
      (assert null ($f1 compare f2).
    ).
  ).

  (define "Emptiness" (= ()
    (should "a function is defined as empty when its body is empty." (= ()
      (assert ($(=>) is-empty).
      (assert false ($(=>) not-empty).

      (assert ($(=> x) is-empty).
      (assert false ($(=> x) not-empty).

      (assert ($(=> (x y)) is-empty).
      (assert false ($(=> (x y)) not-empty).

      (assert false ($(=> () null) is-empty).
      (assert ($(=> () null) not-empty).

      (assert false ($(=> () 0) is-empty).
      (assert ($(=> () 0) not-empty).

      (assert false ($(=> x x) is-empty).
      (assert ($(=> x x) not-empty).

      (assert false ($(=> (x y) (+ x y)) is-empty).
      (assert ($(=> (x y) (+ x y)) not-empty).
    )
  ).

  (define "Encoding" (=> ()
    (should "a function is encoded to its code." (=> ()
      (for value
          in (the-values concat (function empty).
        (var code ($value to-code).
        (assert (code is-a tuple).
        (assert 3 (code length).
        (assert (symbol function) (code 0).
        (assert (((code 1) is-a tuple) ?
          ((code 1) not-plain)
          ((code 1) is-a symbol)
        ).
        (assert ((code 2) is-a tuple).
        (assert ((code 2) is-plain).
      ).
    ).
  ).

  (define "Representation" (=> ()
    (should "(function empty) is represented as (=> ())." (= ()
      (assert "(=> ())" ($(function empty) to-string).
    ).
    (should "a function is represented as its string value of its code." (=> ()
      (for value
          in (the-values concat (function empty).
        (assert ($value is-a function).
        (var code ($value to-code).
        (assert (code to-string) ($value to-string).
      ).
    ).
  ).
).

(define "Constant Value" (= ()
  (define "(function noop)" (= ()
    (should "(function \"noop\") is a function with empty parameters and an empty body." (= ()
      (assert ($(function "noop") is-a function).
      (assert "noop" ($(function "noop") name).

      (assert (($(function "noop") parameters) is-a tuple).
      (assert (($(function "noop") parameters) not-plain).
      (assert 0 (($(function "noop") parameters) length).

      (assert (($(function "noop") body) is-a tuple).
      (assert (($(function "noop") body) is-plain).
      (assert 0 (($(function "noop") parameters) length).
    ).
    (should "(function noop) always return null." (= ()
      (assert null (function noop).
      (var noop (function "noop").
      (assert null (noop).
    ).
    (should "(function noop) is encoded to (tuple function)." (= ()
      (assert (($(function "noop") to-code) is (tuple function).
    ).
  ).
).

(define "(function empty)" (= ()
  (should "(function \"empty\") is a generic lambda." (= ()
    (assert ($(function "empty") is-a lambda).
    (assert "empty" ($(function "empty") name).

    (assert ($(function "empty") is-generic).
    (assert false ($(function "empty") not-generic).
  ).
  (should "(function empty) returns (function \"noop\")." (= ()
    (assert ($(function empty) is (function "noop").

    (var empty (function "empty").
    (assert ($(empty) is (function "noop").
  ).
).

(define "(function of)" (= ()
  (should "(function of) is only a placeholder generator and actually an alias of (function empty)." (= ()
    (assert ($(function of) is (function empty).
  ).
  (should "a local function can be dynamically generated by evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol function) (`x) (`(c + x).
    (var f (t).
    (assert ($f is-a function).
    (assert "value: null" (f).
    (assert "value: true" (f true).
    (assert "value: 100" (f 100).
  ).
  (should "an unsafe function can be dynamically generated by explicitly evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol function) (`x) (`((c ?? ": ") + x).
    (var f (eval t).
    (assert ($f is-a function).
    (assert ": null" (f).
    (assert ": true" (f true).
    (assert ": 100" (f 100).
  ).
).

(define "(a-func name)" (= ()
  (should "($a-func name) returns (string empty) for an anonymous function." (= ()
    (assert "" ($(=> x) name).
  ).
  (should "($a-func name) returns the function's name." (= ()
    (var f (=> x).
    (var ff f).
    (assert "f" ($f name).
    (assert "f" ($ff name).
  ).
).

(define "(a-func parameters)" (= ()
  (should "($a-func parameters) returns (tuple empty) for a function without any parameter." (= ()
    (assert (($(=> () null) parameters) is (tuple empty).
  ).
  (should "($a-func parameters) returns a tuple when the function has only one parameter." (= ()
    (assert (quote x) ($(=> x) parameters).
    (assert (quote x) ($(=> x x) parameters).
    (assert (quote x) ($(=> (x)) parameters).
    (assert (quote x) ($(=> (x) x) parameters).
  ).
  (should "($a-func parameters) returns a tuple when the function has multiple parameters." (= ()
    (assert (quote x y) ($(=> (x y)) parameters).
    (assert (quote x y) ($(=> (x  y) (+ x y)) parameters).
  ).
).

(define "(a-func body)" (= ()
  (should "($a-func body) returns (tuple blank) for an empty function." (= ()
    (assert (($(=>) body) is (tuple blank).
    (assert (($(=> ()) body) is (tuple blank).
    (assert (($(=> x) body) is (tuple blank).
  ).
  (should "($a-func body) returns a plain tuple when the function is not empty." (= ()
    (assert ((`(null)) as-plain) ($(=> () null) body).
    (assert ((`((+ x y))) as-plain) ($(=> (x  y) (+ x y)) body).
    (assert ((`((var z 100 )(+ x y  z))) as-plain) ($(=> (x  y) (var z 100) (+ x y z)) body).
  ).
).

(define "(a-func is-generic)" (= ()
  (should "($a-func is-generic) returns true for most runtime global functions." (= ()
    (assert ($eval is-a function).
    (assert ($eval is-generic).
    (assert ($print is-a function).
    (assert ($print is-generic).
  ).
  (should "($a-func is-generic) returns false for functions generated by code." (= ()
    (assert false ($(=> () null) is-generic).
    (assert false ($(=> x) is-generic).
    (assert false ($(=> x x) is-generic).
    (assert false ($(=> (x y)) is-generic).
    (assert false ($(=> (x y) (+ x y)) is-generic).
  ).
).

(define "(a-func not-generic)" (= ()
  (should "($a-func not-generic) returns false for some runtime functions." (= ()
    (assert ($eval is-a function).
    (assert false ($eval not-generic).
    (assert ($print is-a function).
    (assert false ($print not-generic).
  ).
  (should "($a-func not-generic) returns true for functions generated by code." (= ()
    (assert ($(=> () null) not-generic).
    (assert ($(=> x) not-generic).
    (assert ($(=> x x) not-generic).
    (assert ($(=> (x y)) not-generic).
    (assert ($(=> (x y) (+ x y)) not-generic).
  ).
).

(define "($a-func is-bound)" (= ()
  (should "($a-func is-bound) returns false if the function has not been bound with a subject." (= ()
    (assert false ($(=> () null) is-bound).
    (assert false ($(=> x (x ++)) is-bound).
  ).
  (should "($a-func is-bound) returns true if the function is bound with a subject." (= ()
    (var s (@ y: 1).
    (assert ($($(=> () null) bind s) is-bound).
    (assert ($($(=> x (x ++)) bind s) is-bound).
  ).
).

(define "($a-func not-bound)" (= ()
  (should "($a-func not-bound) returns true for a free function." (= ()
    (assert ($(=> () null) not-bound).
    (assert ($(=> x (x ++)) not-bound).
  ).
  (should "($a-func not-bound) returns false for a bound function." (= ()
    (var s (@ y: 1).
    (assert false ($($(=> () null) bind s) not-bound).
    (assert false ($($(=> x (x ++)) bind s) not-bound).
  ).
).

(define "($a-func this)" (= ()
  (should "($a-func this) returns null for a free function." (= ()
    (assert null ($(=> () null) this).
    (assert null ($(=> x (x ++)) this).
  ).
  (should "($a-func this) returns null if it's bound to null." (= ()
    (var l ($(=> () null) bind null).
    (assert ($l is-bound).
    (assert null ($l this).

    (let l ($(=> x (x ++)) bind null).
    (assert ($l is-bound).
    (assert null ($l this).
  ).
  (should "($a-func this) returns the bound subject if it's bound." (= ()
    (var s (@ x: 1).
    (var l ($(=> () null) bind s).
    (assert ($l is-bound).
    (assert s ($l this).

    (let l ($(=> x (x ++)) bind s).
    (assert ($l is-bound).
    (assert s ($l this).
  ).
).

(define "($a-func apply ...)" (= ()
  (should "($a-func apply) call the function with null as this and an empty argument list." (= ()
    (var f (=> x
      (assert ($do is-a function).
      (assert null this)
      (assert 0 (arguments length).
    ).
    ($f apply).
  ).
  (should "($a-func apply this-value) call the function with this-value as this." (= ()
    (var obj (@ x: 1).
    (var f (=> x
      (assert ($do is-a function).
      (assert obj this)
      (assert 0 (arguments length).
    ).
    ($f apply obj).
  ).
  (should "($a-func apply this-value args) call the function with this-value as this and elements in args as arguments." (= ()
    (var obj (@ x: 1).
    (var f (=> (x y)
      (assert ($do is-a function).
      (assert obj this)
      (assert 1 x)
      (assert 2 y)
      (assert 3 (arguments length).
      (assert 1 (arguments 0).
      (assert 2 (arguments 1).
      (assert 3 (arguments 2).
    ).
    ($f apply obj (@ 1 2 3).
  ).
  (should "($a-func apply this-value value) call the function with this-value as this and value as the only argument if value is not an array." (= ()
    (var obj (@ x: 1).
    (var f (=> (x y)
      (assert ($do is-a function).
      (assert obj this)
      (assert 1 x)
      (assert null y)
      (assert 1 (arguments length).
      (assert 1 (arguments 0).
    ).
    ($f apply obj 1 true "x").
  ).
).

(define "($a-func bind ...)" (= ()
  (should "($a-func bind) returns the original function." (= ()
    (var f (=> x (+ 1 x).
    (var b ($f bind).
    (assert f b).
    (assert false ($b is f).

    (assert ($b is-bound).
    (assert null ($b this).
  ).
  (should "($a-func bind null) returns a bound function whose this is fixed to null." (= ()
    (var s (@ y: 100).
    (var l (=> () this).
    (assert false ($l is-bound).
    (assert ($l not-bound).
    (assert null ($l this).
    (assert s (s ($l).

    (var b ($l bind null).
    (assert ($b is-a function).
    (assert ($b is-not l).
    (assert ($b is-bound).
    (assert false ($b not-bound).
    (assert null ($b this).
    (assert null (b ($l).
  ).
  (should "($a-func bind subject) returns a bound function whose this is fixed to subject." (= ()
    (var s1 (@ y: 100).
    (var l (=> x this).
    (assert false ($l is-bound).
    (assert ($l not-bound).
    (assert null ($l this).
    (assert s1 (s1 ($l).

    (var b ($l bind s1).
    (assert ($b is-a function).
    (assert ($b is-not l).
    (assert ($b is-bound).
    (assert false ($b not-bound).
    (assert s1 ($b this).

    (var s2 (@ y: 10).
    (assert s1 (s2 ($b).
  ).
  (should "($a-bound-func bind new-subject) returns the original bound function." (= ()
    (var s1 (@ y: 100).
    (var l (=> x this).
    (let l ($l bind s1).

    (assert ($l is-a function).
    (assert ($l is-bound).
    (assert false ($l not-bound).
    (assert s1 ($l this).

    (var s2 (@ y: 1000).
    (assert l ($l bind s2).
    (assert s1 ($l this).
    (assert s1 (s2 ($l).
  ).
).

(define "($a-func generic)" (= ()
  (should "($a-func generic) returns null if it's not a generic function." (= ()
    (var f (=> x (+ 1 x).
    (assert null ($f generic).
  ).
  (should "($a-func generic) returns an object if it's a generic function." (= ()
    (assert ($print is-a function).
    (assert ($print is-generic).

    (var obj ($print generic).
    (assert (obj is-an object).
    (assert (obj "call":: is-an function).
    (assert (obj "new":: is-an function).
  ).
).

(define "($a-func $)" (= ()
  (should "($a-func $) is an alias of ($a-func generic)." (= ()
    (var f (=> x (+ 1 x).
    (assert ($f "$") ($f "generic").
  ).
).

(define "direct evaluation" (= ()
  (should "(a-func value ...) evaluates the function with null as this and all argument values." (= ()
    (var f (=> x
      (assert ($do is-a function).
      (assert null this)
      (assert true x)
      (assert 10 (arguments length).
      (assert true (arguments 0).
      (assert null (arguments 1).
      (assert 1 (arguments 2).
      (assert "x" (arguments 3).
      (assert (range empty) (arguments 4).
      (assert (symbol empty) (arguments 5).
      (assert (tuple empty) (arguments 6).
      (assert (operator empty) (arguments 7).
      (assert (lambda empty) (arguments 8).
      (assert (function empty) (arguments 9).
    ).
    (f true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty).
  ).
  (should "(s ($a-func) value ...) evaluates the function with s as this and all argument values." (= ()
    (var obj (@ x: 1).
    (var f (=> x
      (assert ($do is-a function).
      (assert obj this)
      (assert true x)
      (assert 10 (arguments length).
      (assert true (arguments 0).
      (assert null (arguments 1).
      (assert 1 (arguments 2).
      (assert "x" (arguments 3).
      (assert (range empty) (arguments 4).
      (assert (symbol empty) (arguments 5).
      (assert (tuple empty) (arguments 6).
      (assert (operator empty) (arguments 7).
      (assert (lambda empty) (arguments 8).
      (assert (function empty) (arguments 9).
    ).
    (assert f ($f).
    (assert ($($f) is f).
    (obj ($f) true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty).
  ).
  (should "(s (= ...) value ...) evaluates the anonymous function with s as this and all argument values." (= ()
    (var obj (@ x: 1).
    (obj
      (=> x
        (assert ($do is-a function).
        (assert obj this)
        (assert true x)
        (assert 10 (arguments length).
        (assert true (arguments 0).
        (assert null (arguments 1).
        (assert 1 (arguments 2).
        (assert "x" (arguments 3).
        (assert (range empty) (arguments 4).
        (assert (symbol empty) (arguments 5).
        (assert (tuple empty) (arguments 6).
        (assert (operator empty) (arguments 7).
        (assert (lambda empty) (arguments 8).
        (assert (function empty) (arguments 9).
      ).
      true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty)
    ).
  ).
).

(define "anonymous evaluation" (= ()
  (should "(=:() ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> :()
      (assert ($do is-a function).
      (assert null this)
      (assert 0 (arguments length).
    ).
  ).
  (should "(=():() ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> ():()
      (assert ($do is-a function).
      (assert null this)
      (assert null x)
      (assert 0 (arguments length).
    ).
  ).
  (should "(=:() ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=>:()
      (assert ($do is-a function).
      (assert null this)
      (assert 0 (arguments length).
    ).
  ).
  (should "(=:x ...) evaluates the anonymous function with null as this and x as an argument." (= ()
    (var x 123)
    (=>:x
      (assert ($do is-a function).
      (assert null this)
      (assert 123 x)
      (assert 1 (arguments length).
    ).
  ).
  (should "(=:(x, y) ...) evaluates the anonymous function with null as this and both x and y as arguments." (= ()
    (var x 100)
    (var y 200)
    (=>:(x, y)
      (assert ($do is-a function).
      (assert null this)
      (assert 100 x)
      (assert 200 y)
      (assert 2 (arguments length).
    ).
  ).
  (should "(=():x ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=> ():x
      (assert ($do is-a function).
      (assert null this)
      (assert null x)
      (assert 0 (arguments length).
    ).
  ).
  (should "(=():(x ...) ...) evaluates the anonymous function with null as this and no argument." (= ()
    (=>():(x y)
      (assert ($do is-a function).
      (assert null this)
      (assert null x)
      (assert null y)
      (assert 0 (arguments length).
    ).
  ).
  (should "(=(value ...):x ...) evaluates the anonymous function with null as this and all argument values." (= ()
    (=>
      (true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty).
    : x
      (assert ($do is-a function).
      (assert null this)
      (assert true x)
      (assert 10 (arguments length).
      (assert true (arguments 0).
      (assert null (arguments 1).
      (assert 1 (arguments 2).
      (assert "x" (arguments 3).
      (assert (range empty) (arguments 4).
      (assert (symbol empty) (arguments 5).
      (assert (tuple empty) (arguments 6).
      (assert (operator empty) (arguments 7).
      (assert (lambda empty) (arguments 8).
      (assert (function empty) (arguments 9).
    ).
  ).
  (should "(=(value ...):(x ...) ...) evaluates the anonymous function with null as this and all argument values." (= ()
    (=>
      (true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty).
    : (x y z)
      (assert ($do is-a function).
      (assert null this)
      (assert true x)
      (assert null y)
      (assert 1 z)
      (assert 10 (arguments length).
      (assert true (arguments 0).
      (assert null (arguments 1).
      (assert 1 (arguments 2).
      (assert "x" (arguments 3).
      (assert (range empty) (arguments 4).
      (assert (symbol empty) (arguments 5).
      (assert (tuple empty) (arguments 6).
      (assert (operator empty) (arguments 7).
      (assert (lambda empty) (arguments 8).
      (assert (function empty) (arguments 9).
    ).
  ).
).

(define "(do ...): recursive call" (= ()
  (should "variable 'do' refers to current callee function." (= ()
    (var f (=> ()
      (assert ($do is-a function).
      (assert ($do is f).
      (assert null this).
    ).
    (f)
  ).
  (should "'do' can be used to implementation recursive call in a function." (= ()
    (var base 0)
    (assert 5050 (=> 100: x
      (base += x)
      ((x <= 1) ? base (do (x - 1).
    ).
    (assert 5050 base)
    (var sum (=> x
      (base += x)
      ((x <= 1) ? base (do (x - 1).
    ).
    (let base 1)
    (assert 5051 (sum 100).
    (assert 5051 base)
  ).
).

(define "(redo ...): tail recursion elimination" (= ()
  (should "'redo' is a special global operator, so is a pure symbol." (= ()
    (var f (=> ()
      (assert ($redo is redo).
      (assert ($redo is (`redo).
      (assert null this).
    ).
    (f)
  ).
  (should "'redo' can be used to eliminate tail recursion call." (= ()
    (var base 0)
    (assert 50005000 (=> 10000: x
      (base += x)
      ((x <= 1) ? base (redo (x - 1).
    ).
    (assert 50005000 base)
    (var sum (=> x
      (base += x)
      ((x <= 1) ? base (redo (x - 1).
    ).
    (let base 1)
    (assert 50005001 (sum 10000).
    (assert 50005001 base)
  ).
).

(define "resolve function context symbols" (= ()
  (should "'this' is resolved to the subject value of calling expression." (= ()
    (var f (=> () (+ this 2).
    (assert "null2" (f).
    (assert "null2" (f 1).
    (assert 3 (1 ($f).
    (assert 3 (1 ($f) 2).
    (assert "x2" ("x" ($f).
    (assert "x2" ("x" ($f) 2 "y").
  ).
  (should "'arguments' is resolved according to the arguments used in calling current function." (= ()
    (var f (=> () arguments).
    (assert 0 ((f) length).
    (assert null ((f) 0).
    (assert 1 ((f 2) length).
    (assert 2 ((f 2) 0).
    (assert null ((f 2) 1).
    (assert 2 ((f 2 "x") length).
    (assert 2 ((f 2 "x") 0).
    (assert "x" ((f 2 "x") 1).
    (assert null ((f 2 "x") 2).
  ).
  (should "'do' is resolved to the calling function itself." (= ()
    (var f (= () do).
    (assert ($(f) is f).
    (assert ($(1 ($f)) is f).
    (assert ($("x" ($f) 2) is f).
    (assert ($((@) ($f) 2 "x") is f).
  ).
).

(define "resolve other symbols" (= ()
  (should "a function encloses its creating scope." (= ()
    (var x 100)
    (assert 1000 (=>:() (10 * (x ?? 11).
    (assert 1000 (=>:() (=>:() (10 * (x ?? 11).
    (assert 1000 (=>:() (=>:() (=>:() (10 * (x ?? 11).

    (assert 110 (=:() (=>:() (10 * (x ?? 11).
    (assert 110 (=>:() (=:() (=>:() (10 * (x ?? 11).
  ).
  (should "all symbols are resolved in function's own and its parent scopes." (= ()
    (var x 1)
    (assert 1 (=>:() (x + y).

    (assert 3 (=>:()
      (var y 2)
      (=>:() (x + y).
    ).

    (assert 6 (=>:()
      (var y 2)
      (=>:()
        (var z 3)
        (=>:() (x + y z).
    ).
  ).
).

(define "(var ...): variable declaration" (= ()
  (should "(var \"x\" value) defines a new local variable 'x' in current function's scope." (= ()
    (var x 1)

    (assert 10 (=>:() (var x 10) x).
    (assert 1 x)

    (assert 100 (=>:()
      (var x 100)
      (=>:() (var x 101).
      x
    ).
    (assert 1 x)

    (assert 1000 (=>:()
      (var x 1000)
      (=>:() (=>:() (var x 1001).
      x
    ).
    (assert 1 x)
  ).
  (should "(var \"x\" value) can update an existing local variable 'x' in current function's scope." (= ()
    (var x 1)

    (assert 10 (=>(x):(x) (var x (x * 10)) x).
    (assert 1 x)

    (assert 10 (=>:()
      (var x (x * 10).
      x
    ).
    (assert 1 x)

    (assert 10 (=>:()
      (var x (x * 10).
      x
    ).
    (assert 1 x)
  ).
).

(define "(let ...): value assignment" (= ()
  (should "(let \"x\" value) defines a new local variable 'x' in current function." (= ()
    (var x 1)
    (assert 10 (=>:() (let y (x * 10).
    (assert 1 x).
    (assert null y).

    (assert 10 (=>:() (=>:() (let y (x * 10).
    (assert 1 x).
    (assert null y).

    (assert 10 (=>:() (=>:() (=>:() (let y (x * 10).
    (assert 1 x).
    (assert null y).
  ).
  (should "(let \"x\" value) in an operator updates the existing variable 'x' in its calling function." (= ()
    (var x 1)
    (assert 10 (=>:() (let x (x * 10).
    (assert 10 x).

    (assert 100 (=>:() (=>:() (let x (x * 10).
    (assert 100 x).

    (assert 1000 (=>:() (=>:() (=>:() (let x (x * 10).
    (assert 1000 x).
  ).
  (should "an enclosed scope is shared by all the functions generated in the same call." (= ()
    (var gen (=()
      (var x 10). (@
        (=> () (let x (x + 1).
        (=> () (let x (x + 2).
      ).
    ).
    (var (add11 add12) (gen).
    (assert 11 (add11).
    (assert 13 (add12).
    (assert 14 (add11).
    (assert 16 (add12).

    (var (add21 add22) (gen).
    (assert 11 (add21).
    (assert 13 (add22).
    (assert 14 (add21).
    (assert 16 (add22).

    (assert 17 (add11).
    (assert 19 (add12).
    (assert 20 (add11).
    (assert 22 (add12).
  ).
).

(define "(local retval ...)" (= ()
  (should "(local retval) defines the default return value as null." (= ()
    (assert null (=>:() (local retval) 200).
  ).
  (should "(local retval value) defines the default return value as value." (= ()
    (assert null (=>:() (local retval null) 200).
    (assert 200 (=>:() (var retval null) 200).

    (assert type (=>:() (local retval type) 200).
    (assert 200 (=>:() (var retval type) 200).

    (assert true (=>:() (local retval true) 200).
    (assert 200 (=>:() (var retval true) 200).

    (assert false (=>:() (local retval false) 200).
    (assert 200 (=>:() (var retval false) 200).

    (assert 1 (=>:() (local retval 1) 200).
    (assert 200 (=>:() (var retval 1) 200).

    (assert 0 (=>:() (local retval 0) 200).
    (assert 200 (=>:() (var retval 0) 200).

    (assert -1 (=>:() (local retval -1) 200).
    (assert 200 (=>:() (var retval -1) 200).
  ).
  (should "default return value can be overridden by an explicit (return value)." (= ()
    (assert 200 (=>:() (local retval null) (return 200).
    (assert 200 (=>:() (local retval type) (return 200).

    (assert 200 (=>:() (local retval true) (return 200).
    (assert 200 (=>:() (local retval false) (return 200).

    (assert 200 (=>:() (local retval 1) (return 200).
    (assert 200 (=>:() (local retval 0) (return 200).
    (assert 200 (=>:() (local retval -1) (return 200).
  ).
).

(define "y-combinator" (= ()
  (should "y-combinator can implement recursive call for anonymous functions." (= ()
    (var Y (= f
      ((= x (x x))
        (=> x
          (f (=> y
            ((x x) y).
    ).
    (var factorial (Y
      (= f
        (=> n
          ((n == 0) ? 1 (n * (f (n - 1).
    ).
    (assert 120 (factorial 5).
    (assert 1307674368000 (factorial 15).
  ).
).
