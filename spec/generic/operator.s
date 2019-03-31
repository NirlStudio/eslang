(var * (load "share/type" (@ the-type: operator).

(define "Operator Common Behaviours" (=> ()
  (define "Identity" (= ()
    (should "an empty operator without parameters is always the same." (= ()
      (var op1 (=?).
      (var op2 (=? ().
      (var op3 (=? X).
      (var op4 (=? (X).
      (assert ($op1 is-an operator).
      (assert ($op2 is-an operator).
      (assert ($op3 is-an operator).
      (assert ($op4 is-an operator).
      (assert ($op1 is op2).
      (assert false ($op1 is-not op2).

      (assert ($op1 is-not op3).
      (assert ($op2 is-not op3).
      (assert ($op1 is-not op4).
      (assert ($op2 is-not op4).

      (assert ($op3 is-not op4).
      (assert ($op4 is-not op3).
    ).
    (should "non-empty operator code generates different operators in each evaluation." (= ()
      (var code (` (=? X X).
      (var op1 (code).
      (var op2 (code).
      (assert ($op1 is-an operator).
      (assert ($op2 is-an operator).
      (assert ($op1 is-not op2).
      (assert false ($op1 is op2).
    ).
  ).

  (define "Equivalence" (= ()
    (should "an operator's equivalence is defined as its identity." (= ()
      (var op (=? X X).
      (assert ($op is-an operator).
      (assert ($($op "is") is ($op "equals").
      (assert ($($op "is-not") is ($op "not-equals").
    ).
  ).

  (define "Ordering" (= ()
    (should "comparing a operator with itself returns 0." (= ()
      (var op (=? X X).
      (assert ($op is-an operator).
      (assert 0 ($op compare op).
      (assert 0 ($(operator empty) compare (operator empty).
    ).
    (should "comparison of two operators returns null." (=> ()
      (var op1 (=? () null).
      (var op2 (=? () null).
      (assert ($op1 is-an operator).
      (assert ($op2 is-an operator).
      (assert null ($op1 compare op2).

      (let op1 (=? X X).
      (let op2 (=? X X).
      (assert ($op1 is-an operator).
      (assert ($op2 is-an operator).
      (assert null ($op1 compare op2).
    ).
  ).

  (define "Emptiness" (= ()
    (should "an operator is defined as empty when its body is empty." (= ()
      (assert ($(=?) is-empty).
      (assert false ($(=?) not-empty).

      (assert ($(=? X) is-empty).
      (assert false ($(=? X) not-empty).

      (assert ($(=? (X Y)) is-empty).
      (assert false ($(=? (X Y)) not-empty).

      (assert false ($(=? () null) is-empty).
      (assert ($(=? () null) not-empty).

      (assert false ($(=? () 0) is-empty).
      (assert ($(=? () 0) not-empty).

      (assert false ($(=? X X) is-empty).
      (assert ($(=? X X) not-empty).

      (assert false ($(=? (X Y) (+ (X) (Y))) is-empty).
      (assert ($(=? (X Y) (+ X Y)) not-empty).
    )
  ).

  (define "Encoding" (=> ()
    (should "an operator is encoded to its code." (=> ()
      (for value
          in (the-values concat (operator empty).
        (var code ($value to-code).
        (assert (code is-a tuple).
        (assert 3 (code length).
        (assert (symbol operator) (code 0).
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
    (should "(operator empty) is represented as (=? ())." (= ()
      (assert "(=? ())" ($(operator empty) to-string).
    ).
    (should "an operator is represented as its string value of its code." (=> ()
      (for value
          in (the-values concat (operator empty).
        (assert ($value is-an operator).
        (var code ($value to-code).
        (assert (code to-string) ($value to-string).
      ).
    ).
  ).
).

(define "Constant Value" (= ()
  (define "(operator noop)" (= ()
    (should "(operator \"noop\") is an operator with empty parameters and an empty body." (= ()
      (assert ($(operator "noop") is-an operator).
      (assert "noop" ($(operator "noop") name).

      (assert (($(operator "noop") parameters) is-a tuple).
      (assert (($(operator "noop") parameters) not-plain).
      (assert 0 (($(operator "noop") parameters) length).

      (assert (($(operator "noop") body) is-a tuple).
      (assert (($(operator "noop") body) is-plain).
      (assert 0 (($(operator "noop") parameters) length).
    ).
    (should "(operator noop) always return null." (= ()
      (assert null (operator noop).
      (var noop (operator "noop").
      (assert null (noop).
    ).
    (should "(operator noop) is encoded to (tuple operator)." (= ()
      (assert (($(operator "noop") to-code) is (tuple operator).
    ).
  ).
).

(define "(operator empty)" (= ()
  (should "(operator \"empty\") is a generic operator." (= ()
    (assert ($(operator "empty") is-a lambda).
    (assert "empty" ($(operator "empty") name).

    (assert ($(operator "empty") is-generic).
    (assert false ($(operator "empty") not-generic).
  ).
  (should "(operator empty) returns (operator \"noop\")." (= ()
    (assert ($(operator empty) is (operator "noop").

    (var empty (operator "empty").
    (assert ($(empty) is (operator "noop").
  ).
).

(define "(operator of)" (= ()
  (should "(operator of) is only a placeholder generator and actually an alias of (operator empty)." (= ()
    (assert ($(operator of) is (operator empty).
  ).
  (should "an operator can be dynamically generated by evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol operator) (`X)
      (`(var "value" (X).
      (`(let X 2000).
      (`(c + value).
    ).
    (var op (t).
    (assert ($op is-an operator).
    (assert "value: null" (op).
    (assert "value: true" (op true).
    (assert "value: 100" (op 100).
    (var x 200).
    (assert "value: 200" (op x).
    (assert 2000 x).
  ).
  (should "an operator can also be dynamically generated by explicitly evaluating a tuple." (= ()
    (var c "value: ")
    (var t (tuple of (symbol operator) (`X)
      (`(var "value" (X).
      (`(let X 2000).
      (`(c + value).
    ).
    (var op (eval t).
    (assert ($op is-an operator).
    (assert "value: null" (op).
    (assert "value: true" (op true).
    (assert "value: 100" (op 100).
    (var x 200)
    (assert "value: 200" (op x).
    (assert 2000 x).
  ).
).

(define "($an-operator name)" (= ()
  (should "($an-operator name) returns (string empty) for an anonymous operator." (= ()
    (assert "" ($(=? x) name).
  ).
  (should "($an-operator name) returns the operator's name." (= ()
    (var op (=? x).
    (var opp op).
    (assert "op" ($op name).
    (assert "op" ($opp name).
  ).
).

(define "($an-operator parameters)" (= ()
  (should "($an-operator parameters) returns (tuple empty) for a function without any parameter." (= ()
    (assert (($(=? () null) parameters) is (tuple empty).
  ).
  (should "($an-operator parameters) returns a symbol when the operator has only one parameter." (= ()
    (assert (quote X) ($(=? X) parameters).
    (assert (quote X) ($(=? X (X)) parameters).
    (assert (quote X) ($(=? (X)) parameters).
    (assert (quote X) ($(=? (X) (X)) parameters).
  ).
  (should "($an-operator parameters) returns a tuple when the operator has multiple parameters." (= ()
    (assert (quote X Y) ($(=> (X Y)) parameters).
    (assert (quote X Y) ($(=> (X Y) (+ X Y)) parameters).
  ).
).

(define "($an-operator body)" (= ()
  (should "($an-operator body) returns (tuple blank) for an empty operator." (= ()
    (assert (($(=?) body) is (tuple blank).
    (assert (($(=? ()) body) is (tuple blank).
    (assert (($(=? X) body) is (tuple blank).
  ).
  (should "($an-operator body) returns a plain tuple when the operator is not empty." (= ()
    (assert ((`(null)) as-plain) ($(=? () null) body).
    (assert ((`((+ x y))) as-plain) ($(=? (x  y) (+ x y)) body).
    (assert ((`((var z 100 )(+ x y  z))) as-plain) ($(=? (x  y) (var z 100) (+ x y z)) body).
  ).
).

(define "($an-operator is-generic)" (= ()
  (should "($a-func is-generic) returns true for most runtime operators." (= ()
    (assert ($(0 "+=") is-an operator).
    (assert ($(0 "+=") is-generic).
    (assert ($(0 "++") is-an operator).
    (assert ($(0 "++") is-generic).
  ).
  (should "($an-operator is-generic) returns false for operators generated by code." (= ()
    (assert false ($(=? () null) is-generic).
    (assert false ($(=? x) is-generic).
    (assert false ($(=? x x) is-generic).
    (assert false ($(=? (x y)) is-generic).
    (assert false ($(=? (x y) (+ x y)) is-generic).
  ).
).

(define "($an-operator not-generic)" (= ()
  (should "($an-operator not-generic) returns false for most runtime operators." (= ()
    (assert ($(0 "+=") is-an operator).
    (assert false ($(0 "+=") not-generic).
    (assert ($(0 "++") is-an operator).
    (assert false ($(0 "++") not-generic).
  ).
  (should "($an-operator is-generic) returns true for operators generated by code." (= ()
    (assert ($(=? () null) not-generic).
    (assert ($(=? x) not-generic).
    (assert ($(=? x x) not-generic).
    (assert ($(=? (x y)) not-generic).
    (assert ($(=? (x y) (+ x y)) not-generic).
  ).
).

(define "operator evaluation" (= ()
  (should "(an-operator sym ...) evaluates the operator all argument symbols." (= ()
    (var op (=? X
      (var "-that" that)
      (assert null -that)

      (var "-operation" operation)
      (assert 12 (-operation length).

      (var "-operand" operand)
      (assert 1 -operand).

      (assert true (X))
      (assert (`op) (-operation 0).

      (var "oprds" (=(operation operand) :(c o)
        (=> i (c: (o + i).
      ).
      (assert true ((oprds 0).
      (assert null ((oprds 1).
      (assert 1 ((oprds 2).
      (assert "x" ((oprds 3).
      (assert (range empty) ((oprds 4).
      (assert (symbol empty) ((oprds 5).
      (assert (tuple empty) ((oprds 6).
      (assert (operator empty) ((oprds 7).
      (assert (lambda empty) ((oprds 8).
      (assert (function empty) ((oprds 9).
      (assert 100 ((oprds 10).
    ).
    (var z 100).
    (op true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty) z).
  ).
  (should "(s ($an-operator) value ...) evaluates the operator with s as subject and all argument symbols." (= ()
    (var obj (@ x: 1).
    (var z 100).
    (var op (=? X
      (var "-that" that)
      (assert obj -that)

      (var "-operation" operation)
      (assert 13 (-operation length).

      (var "-operand" operand)
      (assert 2 -operand).

      (assert true (X))
      (assert (`obj) (-operation 0).
      (assert (`($op)) (-operation 1).

      (var "oprds" (=(operation operand) :(c o)
        (=> i (c: (o + i).
      ).
      (assert true ((oprds 0).
      (assert null ((oprds 1).
      (assert 1 ((oprds 2).
      (assert "x" ((oprds 3).
      (assert (range empty) ((oprds 4).
      (assert (symbol empty) ((oprds 5).
      (assert (tuple empty) ((oprds 6).
      (assert (operator empty) ((oprds 7).
      (assert (lambda empty) ((oprds 8).
      (assert (function empty) ((oprds 9).
      (assert 100 ((oprds 10).
    ).
    (obj ($op) true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty) z).
  ).
  (should "(s (= ...) value ...) evaluates the anonymous operator with s as subject and all argument symbols." (= ()
    (var obj (@ x: 1).
    (var z 100).
    (obj
      (=? X
        (var "-that" that)
        (assert obj -that)

        (var "-operation" operation)
        (assert 13 (-operation length).

        (var "-operand" operand)
        (assert 2 -operand).

        (assert true (X))
        (assert (`obj) (-operation 0).
        (assert ((-operation 1) is-a tuple).
        (assert (symbol operator) ((-operation 1) 0).

        (var "oprds" (=(operation operand) :(c o)
          (=> i (c: (o + i).
        ).
        (assert true ((oprds 0).
        (assert null ((oprds 1).
        (assert 1 ((oprds 2).
        (assert "x" ((oprds 3).
        (assert (range empty) ((oprds 4).
        (assert (symbol empty) ((oprds 5).
        (assert (tuple empty) ((oprds 6).
        (assert (operator empty) ((oprds 7).
        (assert (lambda empty) ((oprds 8).
        (assert (function empty) ((oprds 9).
        (assert 100 ((oprds 10).
      ).
      true null 1 "x" (range empty) (symbol empty) (tuple empty) (operator empty) (lambda empty) (function empty) z
    ).
  ).
).

(define "resolve operator context symbols" (= ()
  (should "'that' in an operator is resolved to the subject value calling it." (= ()
    (var opr (=? () (+ 10 that).
    (assert 10 (opr).
    (assert 10 (opr 1).
    (assert 11 (1 ($opr).
  ).
  (should "'operand' in an operator is resolved to the offset of first operand in the whole operation." (= ()
    (var opr (=? () (+ 10 operand).
    (assert 11 (opr).
    (assert 11 (opr 1).
    (assert 12 (1 ($opr).
    (assert 12 (1 ($opr) 1).
    (assert 13 ($1 ($opr).
    (assert 13 ($1 ($opr) 1).
  ).
  (should "'operation' in an operator is resolved to the whole expression being evaluated." (= ()
    (var opr (=? () operation).
    (var t1 (opr).
    (assert 1 (t1 length).
    (assert (`opr) (t1 0).

    (var t2 (opr x y).
    (assert 3 (t2 length).
    (assert (`opr) (t2 0).
    (assert (`x) (t2 1).
    (assert (`y) (t2 2).

    (var t3 (x ($opr) y).
    (assert 3 (t3 length).
    (assert (`x) (t3 0).
    (assert (`($opr)) (t3 1).
    (assert (`y) (t3 2).

    (var t3 ($x ($opr) y).
    (assert 4 (t3 length).
    (assert (symbol subject) (t3 0).
    (assert (`x) (t3 1).
    (assert (`($opr)) (t3 2).
    (assert (`y) (t3 3).
  ).
).

(define "resolve lambda/function context symbols" (= ()
  (should "'this' in an operator is resolved according to the lambda or function calling it." (= ()
    (var l (= ()
      (var opr (=? () this).
      (opr)
    ).
    (assert null (l).
    (assert 1 (1 ($l).
    (assert "x" ("x" ($l).

    (var opr (=? () this).
    (var f (=> () (opr).
    (assert null (f).
    (assert 1 (1 ($f).
    (assert "x" ("x" ($f).
  ).
  (should "'arguments' in an operator is resolved according to the lambda or function calling it." (= ()
    (var l (= ()
      (var opr (=? () arguments).
      (opr)
    ).
    (assert 0 ((l) length).
    (assert null ((l) 0).
    (assert 1 ((l 2) length).
    (assert 2 ((l 2) 0).
    (assert null ((l 2) 1).
    (assert 2 ((l 2 "x") length).
    (assert 2 ((l 2 "x") 0).
    (assert "x" ((l 2 "x") 1).
    (assert null ((l 2 "x") 2).

    (var opr (=? () arguments).
    (var f (=> () (opr).
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
  (should "'do' in an operator is resolved to the calling lambda or function." (= ()
    (var l (= ()
      (var opr (=? () do).
      (opr)
    ).
    (assert ($(l) is l).

    (var opr (=? () do).
    (var f (=> () (opr).
    (assert ($(f) is f).
  ).
).

(define "resolve other symbols" (= ()
  (should "an operator is independent of its creating scope." (= ()
    (var opr1 (=:()
      (var x 100)
      (=? Y (+ (Y) x).
    ).
    (assert 10 (opr1 10).
    (var opr2 (=>:()
      (var x 1000)
      (=? Y (+ (Y) x).
    ).
    (assert 100 (opr2 100).
  ).
  (should "operator arguments are resolved to their original atomic values, symbols and tuples." (= ()
    (var opr1 (=? X X).
    (assert 10 (opr1 10).
    (assert true (opr1 true).
    (assert "x" (opr1 "x").
    (assert (`x) (opr1 x).
    (assert (`X) (opr1 X).
    (assert (`(X Y)) (opr1 (X Y).

    (var opr2 (=? (X Y) Y).
    (assert null (opr2 10).
    (assert true (opr2 10 true).
    (assert true (opr2 10 true "x").
    (assert (`x) (opr2 10 x).
    (assert (`x) (opr2 10 x "x").
    (assert (`X) (opr2 10 X "X").
    (assert (`(X Y)) (opr2 10 (X Y).
    (assert (`(X Y)) (opr2 10 (X Y) "(X Y)",
  ).
  (should "other symbols in an operator are resolved in its calling scope." (= ()
    (var opr1 (=:()
      (var x 100)
      (=? Y (+ (Y) x).
    ).
    (var x 20)
    (assert 30 (opr1 10).
    (var opr2 (=>:()
      (var x 1000)
      (=? Y (+ (Y) x).
    ).
    (var x 120)
    (assert 220 (opr2 100).
  ).
).

(define "(var ...): variable declaration" (= ()
  (should "(var (`x) value) in an operator defines a new variable 'x' in calling scope." (= ()
    (var x 1)
    (var y 2)
    (var decl (=? (X V)
      (var X (V).
      (X)
    ).

    (assert 100 (decl x 100).
    (assert 100 x)

    (assert 1000 (decl y 1000).
    (assert 1000 y)

    (assert 101 (=(decl):(decl) (var x 10) (decl x 101) x).
    (assert 100 x)

    (assert 110 (=>:() (var y 11) (decl y 110) y).
    (assert 1000 y)

    (assert 101 (=(decl):(decl) (decl x 101) x).
    (assert 100 x)

    (assert 110 (=>:() (decl y 110) y).
    (assert 1000 y)
  ).
).

(define "(let ...): value assignment" (= ()
  (should "(let (`x) value) in an operator defines a variable 'x' in its immediate calling scope." (= ()
    (var decl (=? (X V) (let X (V).
    (decl x 100).
    (assert 100 x)

    (decl "y" x).
    (assert 100 y)

    (assert 110 (=:()
      (var decl (=? (X V) (let X (V).
      (decl x (10 * (y ?? 11).
    ).
    (assert 100 x).
    (assert 1000 (=>:() (decl z (10 * x).
    (assert null z)
  ).
  (should "(let (`x) value) in an operator can update the existing variable 'x' in its calling function." (= ()
    (var decl (=? (X V) (let X (V).
    (decl x 100).
    (assert 100 x)

    (assert 1000 (=>:() (decl x (10 * x).
    (assert 1000 x)

    (assert 10000 (=>:() (=>:() (decl x (10 * x).
    (assert 10000 x)

    (assert 100000 (=>:() (=>:() (=>:() (decl x (10 * x).
    (assert 100000 x)
  ).
).

(define "(local ...): operator variable declaration" (= ()
  (should "(local (`x) value) defines a new variable 'x' in the operator's context." (= ()
    (var x 1)
    (var y 2)
    (var decl (=? (X V)
      (local X (V).
      (X)
    ).

    (assert 100 (decl x 100).
    (assert 1 x)

    (assert 1000 (decl y 1000).
    (assert 2 y)

    (assert 10 (=:() (var x 10) (decl x 100) x).
    (assert 1 x)

    (assert 11 (=>:() (var y 11) (decl y 100) y).
    (assert 2 y)
  ).
).
