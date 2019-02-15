(define "(=? ...)" (= ()
  (should "(=?) returns the empty operator." (= ()
    (var opr (=?).
    (assert ($opr is-a operator).
    (assert ($opr is-empty).

    (assert ($opr is (operator empty).
    (assert ($(=?()) is (operator empty).
  ).
  (should "(=? PARAM) returns an empty operator." (= ()
    (var opr (=? X).
    (assert ($opr is-a operator).
    (assert ($opr is-empty).
  ).
  (should "(=? (PARAMS ...)) returns an empty operator." (= ()
    (var opr (=? (X Y).
    (assert ($opr is-a operator).
    (assert ($opr is-empty).
  ).
  (should "(=? () body ...) returns a new operator which has no explicit parameter." (= ()
    (var opr (=?() 10).
    (assert ($opr is-a operator).
    (assert ($opr not-empty).

    (assert "opr" ($opr name).
    (assert 0 (($opr parameters) length).
    (assert 10 (($opr body) 0).
  ).
  (should "(=? PARAM body ...) returns a new operator having an explicit parameter." (= ()
    (var opr (=? X 10 X).
    (assert ($opr is-a operator).
    (assert ($opr not-empty).

    (assert "opr" ($opr name).
    (assert (($opr parameters) is-a tuple).
    (assert (quote X) ($opr parameters).

    (assert 2 (($opr body) length).
    (assert 10 (($opr body) 0).
    (assert (`X) (($opr body) 1).
  ).
  (should "(=? (PARAMS ...) body ...) returns a new operator having multiple parameters." (= ()
    (var opr (=? (X Y) 10 ((X) + (Y)).
    (assert ($opr is-a operator).
    (assert ($opr not-empty).

    (assert "opr" ($opr name).
    (assert (($opr parameters) is-a tuple).
    (assert 2 (($opr parameters) length).
    (assert (`X) (($opr parameters) 0).
    (assert (`Y) (($opr parameters) 1).

    (assert 2 (($opr body) length).
    (assert 10 (($opr body) 0).
    (assert (`((X) + (Y))) (($opr body) 1).
  ).
).
