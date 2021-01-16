(define "compiler" (= ()
  (should "(compiler) returns the global function compile." (= ()
    (var compiling (compiler ).
    (assert ($compiling is-a function).
    (assert ($compiling is compile).
  ).
  (should "(compiler a-lambda) returns a function to feed all statements to the evaluator lambda." (= ()
    (var statements (@).
    (var evaluator (=() (this push arguments).
    (var compiling (compiler ($evaluator bind statements).
    (assert ($compiling is-a function).

    (compiling "(x)\n").
    (assert 1 (statements length).
  ).
  (should "(compiler a-func) returns a function to feed all statements to the evaluator function." (= ()
    (var statements (@).
    (var evaluator (=>() (statements push arguments).
    (var compiling (compiler evaluator).
    (assert ($compiling is-a function).

    (compiling "(x)\n").
    (assert 1 (statements length).
  ).
  (should "(compiling ) and (compiling non-str) resets its inner states to begin a new compiling session." (= ()
    (var statements (@).
    (var evaluator (=>() (statements push arguments).
    (var compiling (compiler evaluator).
    (assert ($compiling is-a function).

    (compiling "(((x)").
    (assert 0 (statements length).

    (compiling)
    (assert 1 (statements length).

    (statements clear)
    (compiling "(y)\n").
    (assert 1 (statements length).

    (var non-str-values (@
      null type
      bool true false
      number -1 -0 0 1 1.1
      string
      date (date empty)
      range (range empty)
      date (date empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (=?)
      lambda (=)
      lambda (=>)
      iterator (iterator empty)
      array (array empty)
      object (object empty)
      class (class empty) ((class empty) default)
    ).
    (for non-str in non-str-values
      (statements clear)
      (compiling "(((x)").
      (assert 0 (statements length).

      (compiling non-str)
      (assert 1 (statements length).

      (statements clear)
      (compiling "(y)\n").
      (assert 1 (statements length).
    ).
  ).
  (should "(compiler non-applicable) returns the global function compile." (= ()
    (var non-applicable (@
      null type
      bool true false
      number -1 -0 0 1 1.1
      string "" " " "x"
      date (date empty)
      range (range empty)
      date (date empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (=?)
      iterator (iterator empty)
      array (array empty)
      object (object empty)
      class (class empty) ((class empty) default)
    ).
    (for nona in non-applicable
      (var compiling (compiler nona).
      (assert ($compiling is-a function).
      (assert ($compiling is compile).
    ).
  ).
).

(define "compile" (= ()
  (should "(compile) returns an empty plain tuple." (= ()
    (var statements (compile).
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert (statements is-empty).
  ).
  (should "(compile expr-list) returns a plain tuple of expressions." (= ()
    (var expressions (compile "null true false 1 -1 0 -0 \"abc\"").
    (assert (expressions is-a tuple).
    (assert (expressions is-plain).
    (assert 8 (expressions length).
    (assert null (expressions 0).
    (assert true (expressions 1).
    (assert false (expressions 2).
    (assert 1 (expressions 3).
    (assert -1 (expressions 4).
    (assert 0 (expressions 5).
    (assert ((expressions 6) is -0).
    (assert "abc" (expressions 7).
  ).
  (should "(compile statement-list) returns a plain tuple of statements." (= ()
    (var statements (compile "(null) (true) (false) (1) (-1) (0) (-0) (\"abc\")").
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 8 (statements length).

    (assert ((statements 0) is-a tuple).
    (assert 1 ((statements 0) length).
    (assert null (eval (statements 0).

    (assert ((statements 1) is-a tuple).
    (assert 1 ((statements 1) length).
    (assert true (eval (statements 1).

    (assert ((statements 2) is-a tuple).
    (assert 1 ((statements 2) length).
    (assert false (eval (statements 2).

    (assert ((statements 3) is-a tuple).
    (assert 1 ((statements 3) length).
    (assert 1 (eval (statements 3).

    (assert ((statements 4) is-a tuple).
    (assert 1 ((statements 4) length).
    (assert -1 (eval (statements 4).

    (assert ((statements 5) is-a tuple).
    (assert 1 ((statements 5) length).
    (assert 0 (eval (statements 5).

    (assert ((statements 6) is-a tuple).
    (assert 1 ((statements 6) length).
    (assert ((eval (statements 6)) is -0).

    (assert ((statements 7) is-a tuple).
    (assert 1 ((statements 7) length).
    (assert "abc" (eval (statements 7).
  ).
  (should "(compile code) takes a free comma as a whitespace." (= ()
    (var statements (compile "(tuple,of,1,2,3 4 5,).").
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).

    (assert (quote 1 2 3 4 5) (eval (statements 0).
  ).
  (should "(compile code) supplements a null between two free commas." (= ()
    (var statements (compile "(tuple,of,,1,2,3 ,, 4 5,,).").
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).

    (assert (quote null 1 2 3 null 4 5 null) (eval (statements 0).
  ).
  (should "(compile code) accepts an ending ').' to close all explicit open clauses in current line." (= ()
    (var statements (compile "(quote 1 (2).\n  (quote 1 (2 (3).\n  (quote 1 (2). 4").
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 4 (statements length).

    (assert (quote 1 (2)) (eval (statements 0).
    (assert (quote 1 (2 (3))) (eval (statements 1).
    (assert (quote 1 (2)) (eval (statements 2).
    (assert 4 (eval (statements 3).
  ).
  (should "(compile code) accepts a ').' after an indention to close all explicit open early clauses with the same or higher offset of the indention level." (= ()
    (var statements (compile "(@(@ x: 1\n  m: (=(y)(x + y)\n   ). z: 2\n ). 3").
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).

    (var value (eval (statements 0).
    (assert (value is-an array).
    (assert 2 (value length).
    (assert ((value 0) is-an object).
    (assert 3 (value 1).
  ).
  (should "(compile code) automatically close all open clauses when reaching the end of code." (= ()
    (warn *)
    (var statements (compile "(@(@ x: 1\n  m: (=(y)(x + y").
    (var warning (warn).

    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).

    (var value (eval (statements 0).
    (assert (value is-an array).
    (assert 1 (value length).
    (assert ((value 0) is-an object).
    (assert 1 ((value 0) x).
    (assert ($((value 0) "m") is-a lambda).

    (assert "compiler" (warning 0).
  ).
  (should "(compile code) allows but warns extra ending punctuation." (= ()
    (warn *)
    (var statements (compile "(x))").
    (var warning (warn).
    (assert "compiler" (warning 0).

    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).
    (assert (quote x) (statements 0).

    (warn *)
    (var statements (compile "(x)).").
    (var warning (warn).
    (assert "compiler" (warning 0).

    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).
    (assert (quote x) (statements 0).

    (warn *)
    (var statements (compile "(x)).").
    (var warning (warn).
    (assert "compiler" (warning 0).

    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).
    (assert (quote x) (statements 0).
  ).
  (should "(compile code) takes a semicolon to close all open clauses in current line and enclose the line into a statement." (= ()
    (var statements (compile ";").
    (assert (statements is-a tuple).
    (assert (statements is-plain).
    (assert 1 (statements length).
    (assert (tuple empty) (statements 0).

    (let statements (compile " ;;").
    (assert (unquote () ()) statements).

    (let statements (compile " let x 1;").
    (assert (unquote (let x 1)) statements).

    (let statements (compile " let x 1; let y 2;").
    (assert (unquote (let x 1) (let y  2)) statements).

    (let statements (compile " let x 1; let y 2; let z 3").
    (assert (unquote (let x 1) (let y  2) let z 3) statements).

    (let statements (compile " let x 1; let y 2; let z 3;").
    (assert (unquote (let x 1) (let y  2) (let z 3)) statements).

    (let statements (compile " let x 1; let y 2; let z 3;;").
    (assert (unquote (let x 1) (let y  2) (let z 3) ()) statements).

    (let statements (compile " let x (let y 1;").
    (assert (unquote (let x (let y 1))) statements).

    (let statements (compile "(let f (=> (x y)\n  + x (y * 2;\n).").
    (assert (unquote (let f (=> (x y) (+ x (y * 2))))) statements).

    (let statements (compile "(let f (=> (x y)\n  + x (y * 2;\n).").
    (assert (unquote (let f (=> (x y) (+ x (y * 2))))) statements).

    (let statements (compile "\"abc\n   cde1\";").
    (assert (unquote "abc cde1") statements).

    (let statements (compile "\"abc\n   cde2\" (let x 1;").
    (assert (unquote "abc cde2" (let x 1)) statements).
  ).
).
