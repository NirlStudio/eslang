(define "(eval ...)" (= ()
  (should "(eval) returns null." (= ()
    (assert null (eval).
  ).
  (should "(eval a-symbol) evaluates the symbol in global context." (= ()
    (assert type (eval (`type).

    (var x 100)
    (assert null (eval (`x).

    (let descending 100)
    (assert 1 (eval (`descending).
  ).
  (define "(eval a-string)" (= ()
    (should "compile the string as a piece of code and evaluate it in the global context." (= ()
      (assert null (eval "").

      (assert true (eval "true").
      (assert false (eval "false").

      (assert "\"" (eval "\"\\\"\"").

      (assert ((eval "0") is 0).
      (assert ((eval "-0") is -0).

      (assert 1 (eval "1").
      (assert -1 (eval "-1").
      (assert 11 (eval "(1 + 10)").
    ).
    (should "return evaluated value of the last statement if the string has multiple statements." (= ()
      (assert null (eval "(1 + 10) null").
      (assert true (eval "(1 + 10) true").
      (assert 110 (eval "(1 + 10) (10 + 100)").
    ).
    (should "return the values provided in (return ...)." (= ()
      (assert 1 (eval "(return 1)").

      (assert 1 (eval "(1 + 10) (return 1) (10 + 100)").

      (var r (eval "(1 + 10) (return 1 2) (10 + 100)").
      (assert (r is-an array).
      (assert 2 (r length).
      (assert 1 (r 0).
      (assert 2 (r 1).
    ).
    (should "return the values provided by (exit ...)." (= ()
      (assert 1 (eval "(exit 1)").

      (assert 1 (eval "(1 + 10) (exit 1) (10 + 100)").

      (var r (eval "(1 + 10) (exit 1 2) (10 + 100)").
      (assert (r is-an array).
      (assert 2 (r length).
      (assert 1 (r 0).
      (assert 2 (r 1).
    ).
    (should "ignore the value provided by (export ...)." (= ()
      (assert 111 (eval "(1 + 10) (export x 1) (x + 10 100)").
    ).
  ).
  (define "(eval a-tuple)" (= ()
    (should "evaluate the tuple in the global context." (=> ()
      (assert null (eval (quote).
      (assert true (eval (unquote true).
      (assert false (eval (unquote false).

      (assert ((eval (unquote 0)) is 0).
      (assert ((eval (unquote -0)) is -0).

      (assert 1 (eval (unquote 1).
      (assert -1 (eval (unquote -1).

      (assert 11 (eval (quote 1 + 10).
      (assert 11 (eval (unquote (1 + 10).
    ).
    (should "return evaluated value of the last statement if the tuple has multiple statements." (= ()
      (assert null (eval (unquote (1 + 10) null).
      (assert true (eval (unquote (1 + 10) true).
      (assert 110 (eval (unquote (1 + 10) (10 + 100).
    ).
    (should "return the values provided in (return ...)." (= ()
      (assert 1 (eval (unquote return 1).
      (assert 1 (eval (unquote (return 1).

      (assert 1 (eval (unquote (1 + 10) (return 1) (10 + 100).

      (var r (eval (unquote (1 + 10) (return 1 2) (10 + 100).
      (assert (r is-an array).
      (assert 2 (r length).
      (assert 1 (r 0).
      (assert 2 (r 1).
    ).
    (should "return the values provided by (exit ...)." (= ()
      (assert 1 (eval (unquote exit 1).
      (assert 1 (eval (unquote (exit 1).

      (assert 1 (eval (unquote (1 + 10) (exit 1) (10 + 100).

      (var r (eval (unquote (1 + 10) (exit 1 2) (10 + 100).
      (assert (r is-an array).
      (assert 2 (r length).
      (assert 1 (r 0).
      (assert 2 (r 1).
    ).
    (should "ignore the value provided by (export ...)." (= ()
      (assert 111 (eval (unquote (1 + 10) (export x 1) (x + 10 100).
    ).
  ).
  (should "(eval a-value) returns the original value if its type is not any of string, symbol or tuple." (=> ()
    (assert null (eval).
    (assert type (eval type).

    (assert bool (eval bool).
    (assert true (eval true).
    (assert false (eval false).

    (assert string (eval string).
    (assert number (eval number).
    (assert ((eval 0) is 0).
    (assert ((eval -0) is -0).
    (assert 1 (eval 1).
    (assert -1 (eval -1).

    (assert date (eval date).
    (assert (date of 0) (eval (date of 0).
    (assert (date of 1) (eval (date of 1).
    (assert (date of -1) (eval (date of -1).

    (assert range (eval range).
    (assert (range empty) (eval (range empty).
    (assert (1 10) (eval (1 10).

    (assert operator (eval operator).
    (assert (operator empty) (eval (operator empty).

    (assert lambda (eval lambda).
    (assert (lambda empty) (eval (lambda empty).

    (assert function (eval function).
    (assert (function empty) (eval (function empty).

    (assert array (eval array).
    (var a (@)
    (assert a (eval a).

    (assert object (eval object).
    (var obj (@:)
    (assert obj (eval obj).

    (assert class (eval class).
    (var c (class empty)
    (assert c (eval c).

    (var inst (c default)
    (assert inst (eval inst).
  ).
).
