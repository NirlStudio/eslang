(define "(=? ...)" (= ()
  (should "(=?) returns the empty operator." (= ()
    (var opr (=?).
    (assert ($opr is-an operator).
    (assert ($opr is-empty).

    (assert ($opr is (operator empty).
    (assert ($(=?()) is (operator empty).
  ).
  (should "(=? PARAM) returns an empty operator." (= ()
    (var opr (=? X).
    (assert ($opr is-an operator).
    (assert ($opr is-empty).
  ).
  (should "(=? (PARAMS ...)) returns an empty operator." (= ()
    (var opr (=? (X Y).
    (assert ($opr is-an operator).
    (assert ($opr is-empty).
  ).
  (should "(=? () body ...) returns a new operator which has no explicit parameter." (= ()
    (var opr (=?() 10).
    (assert ($opr is-an operator).
    (assert ($opr not-empty).

    (assert "opr" ($opr name).
    (assert 0 (($opr parameters) length).
    (assert 10 (($opr body) 0).
  ).
  (should "(=? PARAM body ...) returns a new operator having an explicit parameter." (= ()
    (var opr (=? X 10 X).
    (assert ($opr is-an operator).
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
    (assert ($opr is-an operator).
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

(define "(. expr) - in operator scope" (= ()
  (var .resolve (=:()
    var sym1 100;
    let sym2 200;
    const sym3 300;
    local sym4 400;
    locon sym5 500;
    (=? &expr
      (((quote .) concat &expr))
    ).
  ).
  (should "symbol '.' is resolved to itself." (=> ()
    assert . (` .);
    assert . (symbol of ".");
    assert . (.resolve .);
  ).
  (should "(. ) returns null." (=> ()
    assert null ((=?() (.)) );
  ).
  (should "(. sym) returns the value of sym from an operator's declaration space." (=> ()
    assert type (.resolve type);

    assert null sym1;
    assert 100 (.resolve sym1);

    assert null sym2;
    assert 200 (.resolve sym2);

    assert null sym3;
    assert 300 (.resolve sym3);

    var sym4 400;
    assert 400 sym4;
    assert null (.resolve sym4);

    var sym5 500;
    assert 500 sym5;
    assert null (.resolve sym5);
  ).
  (should "(. a-tuple) returns the value from an operator's declaration space by evaluating a-tuple to a symbol." (=> ()
    assert null (.resolve (symbol of null);
    assert true (.resolve (symbol of "true");
    assert false (.resolve (symbol of "false");

    assert null sym1;
    assert 100 (.resolve (`sym1);

    assert null sym2;
    assert 200 (.resolve (` sym2);

    assert null sym3;
    assert 300 (.resolve (` sym3);

    local sym4 400;
    assert 400 sym4;
    assert null (.resolve (` sym4);

    locon sym5 500;
    assert 500 sym5;
    assert null (.resolve (symbol of ("sym" + 5);
  ).
  (should "(. expr) returns null if expr is not a symbol." (=> ()
    assert null (.resolve null);

    assert null (.resolve true);
    assert null (.resolve false);

    assert null (.resolve -1);
    assert null (.resolve 0);
    assert null (.resolve 1);
  ).
  (should "(. expr) returns null if expr is a tuple but cannot be evaluated to a symbol." (=> ()
    assert null (.resolve ();
    assert null (.resolve (*);

    assert null (.resolve (0 ?);
    assert null (.resolve (1 ?);

    assert null (.resolve (null ??);
    assert null (.resolve (type ??);

    assert null (.resolve (1 + 2);
    assert null (.resolve (1 + (2 + 3);
  ).
).

(define "(. expr) - out of operator scope" (= ()
  (should "symbol '.' is resolved to itself." (=> ()
    assert . (` .);
    assert . (symbol of ".");
  ).
  (should "(. ) returns null." (=> ()
    assert null (.);
  ).
  (should "(. sym) returns the value of sym from read-only global space." (=> ()
    assert type (. type);

    var sym1 100;
    assert 100 sym1;
    assert 100 ($ sym1);
    assert null (. sym1);

    const sym2 200;
    assert 200 sym2;
    assert 200 ($ sym2);
    assert null (. sym2);

    let sym3 300;
    assert 300 sym3;
    assert 300 ($ sym3);
    assert null (. sym3);

    local sym4 400;
    assert 400 sym4;
    assert 400 ($ sym4);
    assert null (. sym4);

    locon sym5 500;
    assert 500 sym5;
    assert 500 ($ sym5);
    assert null (. sym5);
  ).
  (should "(. a-tuple) returns the value from read-only global space by evaluating a-tuple to a symbol." (=> ()
    assert null (. (symbol of null);
    assert true (. (symbol of "true");
    assert false (. (symbol of "false");

    var sym1 100;
    assert 100 sym1;
    assert null (. (`sym1);

    const sym2 200;
    assert 200 sym2;
    assert null (. (` sym2);

    let sym3 300;
    assert 300 sym3;
    assert null (. (` sym3);

    local sym4 400;
    assert 400 sym4;
    assert null (. (` sym4);

    locon sym5 500;
    assert 500 sym5;
    assert null (. (symbol of ("sym" + 5);
  ).
  (should "(. expr) returns null if expr is not a symbol." (=> ()
    assert null (. null);

    assert null (. true);
    assert null (. false);

    assert null (. -1);
    assert null (. 0);
    assert null (. 1);
  ).
  (should "(. expr) returns null if expr is a tuple but cannot be evaluated to a symbol." (=> ()
    assert null (. ();
    assert null (. (*);

    assert null (. (0 ?);
    assert null (. (1 ?);

    assert null (. (null ??);
    assert null (. (type ??);

    assert null (. (1 + 2);
    assert null (. (1 + (2 + 3);
  ).
).
