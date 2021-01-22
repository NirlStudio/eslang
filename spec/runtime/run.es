(define "(run )" (= ()
  (should "(run ) returns null." (= ()
    (assert null (run ).
  ).
).

(define "(run app-source)" (= ()
  (should "load and return the evaluation result of file source." (= ()
    (var result (run "_app", null, -module-dir).
    (assert (result is-an array).
    (assert ((result 0) is-a string).
    (assert (env "home") (result 0).

    (assert null (result 1).

    (assert ((result 2) is-an array).
    (assert ((result 2) is-empty).

    (assert ((result 3) is-a string).
    (assert ((result 3) ends-with "_app.es").

    (assert ((result 4) is-a string).
    (assert ((result 5) is-a string).

    (assert ((result 6) is-a string).
    (assert ((result 6) ends-with "_app.es").

    (assert (result 3) (result 6).
  ).
  (should "return null if the file source cannot be loaded." (= ()
    (assert null (run "_does_not_exist_app").
  ).
).

(define "(run app-source args)" (= ()
  (should "pass args to the app as arguments." (= ()
    (var result (run "_app", (@ 1 10 100), -module-dir).
    (assert (result is-an array).
    (assert ((result 0) is-a string).
    (assert (env "home") (result 0).

    (assert null (result 1).
    (assert ((result 2) is-an array).
    (assert 1 ((result 2) 0).
    (assert 10 ((result 2) 1).
    (assert 100 ((result 2) 2).
  ).
  (should "requires args must be an array." (= ()
    (var result (run "_app", (@ x: 1), -module-dir).
    (assert (result is-an array).
    (assert ((result 0) is-a string).
    (assert (env "home") (result 0).

    (assert null (result 1).
    (assert ((result 2) is-an array).
    (assert ((result 2) is-empty).
  ).
  (should "only accept atomic values as argument value." (= ()
    (var args (@
      null true false -1 0 1 "" " "  "x"
      (range empty) (date empty) (symbol empty) (tuple empty)
      type (=?) (=) (=?) (@) (@:) ((class empty) default)
    ).

    (var result (run "_app", args, -module-dir).
    (assert (result is-an array).
    (assert ((result 0) is-a string).
    (assert (env "home") (result 0).

    (assert null (result 1).
    (var feedback (result 2).
    (assert (feedback is-an array).

    (assert (feedback is-an array).
    (assert (args length) (feedback length).

    (assert null (feedback 0).
    (assert true (feedback 1).
    (assert false (feedback 2).
    (assert -1 (feedback 3).
    (assert 0 (feedback 4).
    (assert 1 (feedback 5).
    (assert "" (feedback 6).
    (assert " " (feedback 7).
    (assert "x" (feedback 8).

    (assert ((feedback 9) is-a range).
    (assert ((feedback 9) is-empty).

    (assert ((feedback 10) is-a date).
    (assert ((feedback 10) is-empty).

    (assert ((feedback 11) is-a symbol).
    (assert ((feedback 11) is-empty).

    (assert ((feedback 12) is-a tuple).
    (assert ((feedback 12) is-empty).
    (for i in (13 (args length))
      (assert null (feedback i).
    ).
  ).
).

(define "(run app-source args app-home)" (=> ()
  (should "pass app-home to new app if it's a string." (=> ()
    (var result (run "_app", null, -module-dir).
    (assert (result is-an array).
    (assert ((result 0) is-a string).
    (assert (env "home") (result 0).

    (assert null (result 1).
    (assert ((result 2) is-an array).
    (assert ((result 2) is-empty).

    (assert ((result 3) is-a string).
    (assert ((result 3) starts-with -module-dir).

    (assert ((result 4) is-a string).
    (assert ((result 4) is-a string).

    (assert ((result 6) is-a string).
    (assert ((result 6) ends-with "_app.es").

    (assert (result 3) (result 6).
  ).
  (should "use current home as -app-home if it's not a string." (= ()
    (let path (import "$eslang/path").
    (var result (run (path resolve (env "runtime-home"), "spec/runtime/_app"), null, true).
    (assert (result is-an array).
    (assert ((result 0) is-a string).
    (assert (env "home") (result 0).

    (assert null (result 1).

    (assert (env "home") (result 5).
  ).
).
