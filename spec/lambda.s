(var the-type lambda)
(include "share/type")

(define "Lambda Common Behaviours" (=> ()
  (define "Identity" (= ()
    (should "an empty lambda is always the same." (= ()
      (var l1 (=),
      (var l2 (= (),
      (var l3 (= x),
      (var l4 (= (x),
      (assert (:l1 is-a lambda),
      (assert (:l2 is-a lambda),
      (assert (:l3 is-a lambda),
      (assert (:l4 is-a lambda),
      (assert (:l1 is l2),
      (assert false (:l1 is-not l2),

      (assert (:l1 is-not l3),
      (assert (:l2 is-not l3),
      (assert (:l1 is-not l4),
      (assert (:l2 is-not l4),

      (assert (:l3 is-not l4),
      (assert (:l4 is-not l3),
    ),
    (should "non-empty lambda code generates different lambdas in each evaluation." (= ()
      (var code (` (= x x),
      (var l1 (code),
      (var l2 (code),
      (:l1 is-a lambda)
      (:l2 is-a lambda)
      (assert (:l1 is-not l2),
      (assert false (:l1 is l2),
    ),
  ),

  (define "Equivalence" (= ()
    (should "a lambda's equivalence is defined as its identity." (= ()
      (var l (= x x),
      (assert (:l is-a lambda),
      (assert (:(:l "is") is (:l "equals"),
      (assert (:(:l "is-not") is (:l "not-equals"),
    ),
  ),

  (define "Ordering" (= ()
    (should "comparing a lambda with itself returns 0." (= ()
      (var l (= x x),
      (assert (:l is-a lambda),
      (assert 0 (:l compare l),
      (assert 0 (:(lambda empty) compare (lambda empty),
    ),
    (should "comparison of two lambdas returns null." (=> ()
      (var l1 (= () null),
      (var l2 (= () null),
      (assert (:l1 is-a lambda),
      (assert (:l2 is-a lambda),
      (assert null (:l1 compare l2),

      (let l1 (= x x),
      (let l2 (= x x),
      (assert (:l1 is-a lambda),
      (assert (:l2 is-a lambda),
      (assert null (:l1 compare l2),
    ),
  ),

  (define "Emptiness" (= ()
    (should "a lambda is defined as empty when its body is empty." (= ()
      (assert (:(=) is-empty),
      (assert false (:(=) not-empty),

      (assert (:(= x) is-empty),
      (assert false (:(= x) not-empty),

      (assert (:(= (x y)) is-empty),
      (assert false (:(= (x y)) not-empty),

      (assert false (:(= () null) is-empty),
      (assert (:(= () null) not-empty),

      (assert false (:(= () 0) is-empty),
      (assert (:(= () 0) not-empty),

      (assert false (:(= x x) is-empty),
      (assert (:(= x x) not-empty),

      (assert false (:(= (x y) (+ x y)) is-empty),
      (assert (:(= (x y) (+ x y)) not-empty),
    )
  ),

  (define "Encoding" (=> ()
    (should "a lambda is encoded to its code." (=> ()
      (for value
          in (the-values concat (lambda empty),
        (var code (:value to-code),
        (assert (code is-a tuple),
        (assert 3 (code length),
        (assert (symbol lambda) (code 0),
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
    (should "(lambda empty) is represented as (= ())." (= ()
      (assert "(= ())" (:(lambda empty) to-string),
    ),
    (should "a lambda is represented as its string value of its code." (=> ()
      (for value
          in (the-values concat (lambda empty),
        (var code (:value to-code),
        (assert (code to-string) (:value to-string),
      ),
    ),
  ),
),

(define "Constant Value" (= ()
  (define "(lambda noop)" (= ()
    (should "(lambda \"noop\") is a lambda with an empty parameters and an empty body." (= ()
      (assert (:(lambda "noop") is-a lambda),
      (assert "noop" (:(lambda "noop") name),

      (assert ((:(lambda "noop") parameters) is-a tuple),
      (assert ((:(lambda "noop") parameters) not-plain),
      (assert 0 ((:(lambda "noop") parameters) length),

      (assert ((:(lambda "noop") body) is-a tuple),
      (assert ((:(lambda "noop") body) is-plain),
      (assert 0 ((:(lambda "noop") parameters) length),
    ),
    (should "(lambda noop) always return null." (= ()
      (assert null (lambda noop),
      (var noop (lambda "noop"),
      (assert null (noop),
    ),
    (should "(lambda noop) is encoded to (tuple lambda)." (= ()
      (assert ((:(lambda "noop") to-code) is (tuple lambda),
    ),
  ),
),

(define "(lambda empty)" (= ()
  (should "(lambda \"empty\") is a generic lambda." (= ()
    (assert (:(lambda "empty") is-a lambda),
    (assert "empty" (:(lambda "empty") name),

    (assert (:(lambda "empty") is-generic),
    (assert false (:(lambda "empty") not-generic),
  ),
  (should "(lambda empty) returns (lambda \"noop\")." (= ()
    (assert (:(lambda empty) is (lambda "noop"),

    (var empty (lambda "empty"),
    (assert (:(empty) is (lambda "noop"),
  ),
),

(define "(lambda of)" (= ()
  (should "(lambda of) is only a placeholder generator and actually an alias of (lambda empty)." (= ()
    (assert (:(lambda of) is (lambda empty),
  ),
  (should "a lambda can be dynamically generated by evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol lambda) (`x) (`((c ?? ": ") + x),
    (var f (t),
    (assert (:f is-a lambda),
    (assert ": null" (f),
    (assert ": true" (f true),
    (assert ": 100" (f 100),
  ),
  (should "a lambda can also be dynamically generated by explicitly evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol lambda) (`x) (`((c ?? ": ") + x),
    (var f (eval t),
    (assert (:f is-a lambda),
    (assert ": null" (f),
    (assert ": true" (f true),
    (assert ": 100" (f 100),
  ),
),

(define "(a-lambda name)" (= ()
  (should "(:a-lambda name) returns (string empty) for an anonymous lambda." (= ()
    (assert "" (:(= x) name),
  ),
  (should "(:a-lambda name) returns the lambda's name." (= ()
    (var l (= x),
    (var ll l),
    (assert "l" (:l name),
    (assert "l" (:ll name),
  ),
),

(define "(a-lambda parameters)" (= ()
  (should "(:a-lambda parameters) returns (tuple empty) for a lambda without any parameter." (= ()
    (assert ((:(= () null) parameters) is (tuple empty),
  ),
  (should "(:a-lambda parameters) returns a symbol when the lambda has only one parameter." (= ()
    (assert ((:(= x) parameters) is (`x),
    (assert ((:(= x x) parameters) is (`x),
    (assert ((:(= (x)) parameters) is (`x),
    (assert ((:(= (x) x) parameters) is (`x),
  ),
  (should "(:a-lambda parameters) returns a tuple when the lambda has multiple parameters." (= ()
    (assert (`(x y)) (:(= (x y)) parameters),
    (assert (`(x y)) (:(= (x  y) (+ x y)) parameters),
  ),
),

(define "(a-lambda body)" (= ()
  (should "(:a-lambda body) returns (tuple blank) for an empty lambda." (= ()
    (assert ((:(=) body) is (tuple blank),
    (assert ((:(= ()) body) is (tuple blank),
    (assert ((:(= x) body) is (tuple blank),
  ),
  (should "(:a-lambda body) returns a plain tuple when the lambda is not empty." (= ()
    (assert ((`(null)) as-plain) (:(= () null) body),
    (assert ((`((+ x y))) as-plain) (:(= (x  y) (+ x y)) body),
    (assert ((`((var z 100 )(+ x y  z))) as-plain) (:(= (x  y) (var z 100) (+ x y z)) body),
  ),
),

(define "(a-lambda is-generic)" (= ()
  (should "(:a-lambda is-generic) returns true for most type & instance methods." (= ()
    (assert (:(:(=) "apply") is-a lambda),
    (assert (:(:(=) "apply") is-generic),
  ),
  (should "(:a-lambda is-generic) returns false for lambdas generated by code." (= ()
    (assert false (:(= () null) is-generic),
    (assert false (:(= x) is-generic),
    (assert false (:(= x x) is-generic),
    (assert false (:(= (x y)) is-generic),
    (assert false (:(= (x y) (+ x y)) is-generic),
  ),
),

(define "(a-lambda not-generic)" (= ()
  (should "(:a-lambda not-generic) returns false for some runtime lambdas." (= ()
    (assert (:(:(=) "apply") is-a lambda),
    (assert false (:(:(=) "apply") not-generic),
  ),
  (should "(:a-lambda is-generic) returns true for lambdas generated by code." (= ()
    (assert (:(= () null) not-generic),
    (assert (:(= x) not-generic),
    (assert (:(= x x) not-generic),
    (assert (:(= (x y)) not-generic),
    (assert (:(= (x y) (+ x y)) not-generic),
  ),
),

(define "(a-lambda apply ...)" (= ()
  (should "(:a-lambda apply) call the lambda with null as this and an empty argument list." (= ()
    (var l (= x
      (assert null this)
      (assert 0 (arguments length),
    ),
    (:l apply),
  ),
  (should "(:a-lambda apply this-value) call the lambda with this-value as this." (= ()
    (var obj (@ x: 1),
    (var l (= x
      (assert 0 (arguments length),
      (return this)
    ),
    (assert obj (:l apply obj),
  ),
  (should "(:a-lambda apply this-value args) call the lambda with this-value as this and elements in args as arguments." (= ()
    (var obj (@ x: 1),
    (var l (= (x y)
      (assert 1 x)
      (assert 2 y)
      (assert 3 (arguments length),
      (assert 1 (arguments 0),
      (assert 2 (arguments 1),
      (assert 3 (arguments 2),
      (return this)
    ),
    (assert obj (:l apply obj (@ 1 2 3),
  ),
  (should "(:a-lambda apply this-value value) call the lambda with this-value as this and value as the only argument if value is not an array." (= ()
    (var obj (@ x: 1),
    (var l (= (x y)
      (assert 1 x)
      (assert null y)
      (assert 1 (arguments length),
      (assert 1 (arguments 0),
      (return this)
    ),
    (assert obj (:l apply obj 1 true "x"),
  ),
),

(define "direct evaluation" (= ()
  (should "(a-lambda value ...) evaluates the lambda with null as this and all argument values." (= ()
    (var l (= x
      (assert (:do is-a lambda),
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
    (l true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
  ),
  (should "(s (:a-lambda) value ...) evaluates the lambda with s as this and all argument values." (= ()
    (var obj (@ x: 1),
    (var l (= x
      (assert (:do is-a lambda),
      (return this),
      (assert true x),
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
    (assert l (:l),
    (assert (:(:l) is l),
    (var result (obj (:l) true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
    ((result is obj) ? null (result ?? (assert obj result)),
  ),
  (should "(s (= ...) value ...) evaluates the anonymous lambda with s as this and all argument values." (= ()
    (var obj (@ x: 1),
    (var result
      (obj
        (= x
          (assert (:do is-a lambda),
          (return this),
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
    ((result is obj) ? null (result ?? (assert obj result)),
  ),
),

(define "anonymous evaluation" (= ()
  (should "(=:() ...) evaluates the anonymous lambda with null as this and no argument." (= ()
    (=:()
      (assert (:do is-a lambda),
      (assert null this)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=():() ...) evaluates the anonymous lambda with null as this and no argument." (= ()
    (=():()
      (assert (:do is-a lambda),
      (assert null this)
      (assert null x)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=:x ...) evaluates the anonymous lambda with null as this and no argument." (= ()
    (=:x
      (assert (:do is-a lambda),
      (assert null this)
      (assert null x)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=():x ...) evaluates the anonymous lambda with null as this and no argument." (= ()
    (=():x
      (assert (:do is-a lambda),
      (assert null this)
      (assert null x)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=():(x ...) ...) evaluates the anonymous lambda with null as this and no argument." (= ()
    (=():(x y)
      (assert (:do is-a lambda),
      (assert null this)
      (assert null x)
      (assert null y)
      (assert 0 (arguments length),
    ),
  ),
  (should "(=(value ...):x ...) evaluates the anonymous lambda with null as this and all argument values." (= ()
    (=
      (true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
    : x
      (assert (:do is-a lambda),
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
  (should "(=(value ...):(x ...) ...) evaluates the anonymous lambda with null as this and all argument values." (= ()
    (=
      (true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty),
    : (x y z)
      (assert (:do is-a lambda),
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
    (var l (= ()
      (assert (:do is-a lambda),
      (assert null this),
    ),
    (l)
  ),
  (should "'do' can be used to implementation recursive call in a function." (= ()
    (assert 5050 (= 100:x
      ((x <= 1) ? x
        (x + (do (x - 1),
      ),
    ),
    (var sum (= x
      ((x <= 1) ? x
        (x + (do (x - 1),
      ),
    ),
    (assert 5050 (sum 100),
  ),
),

(define "(redo ...): tail recusion elimination" (= ()
  (should "'redo' is a special global operator, so is a pure symbol." (= ()
    (var f (= ()
      (assert (:redo is redo),
      (assert (:redo is (`redo)),
      (assert null this),
    ),
    (f)
  ),
  (should "'redo' can be used to elminate tail recursion call." (= ()
    (assert 5000050000 (= 100000: (x base)
      ((x <= 1) ? (x + base)
        (redo (x - 1) (x + base),
      ),
    ),
    (var sum (= (x base)
      ((x <= 1) ? (x + base)
        (redo (x - 1) (x + base),
      ),
    ),
    (assert 5000050000 (sum 100000),
  ),
),

(define "variable scope" (= ()
  (should "a lambda is not impacted by variables out of its own scope." (= ()
    (var x 1)
    (=:()
      (var y 20)
      (=:()
        (assert null x)
        (assert null y)
    ),
  ),
  (should "a lambda does not impact other variables out of its own scope." (= ()
    (var x 1)
    (var result (=:()
      (let x 10)
      (var y 20)
      (=:()
        (assert null x)
        (assert null y)
        (let x 100)
        (var y 200)
        (assert 100 x)
        (assert 200 y)
    ),
    (assert null result)
    (assert 1 x)
    (assert null y)
  ),
),
