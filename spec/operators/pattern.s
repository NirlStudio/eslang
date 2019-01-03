(define "($ ...) - explicit subject" (= ()
  (should "($) returns null." (=> ()
    (assert null ($),
  ),
  (should "($value) always returns the original value." (=> ()
    (var values (@
      null type
      bool true false
      number -1 0 -0 1
      string "" " " "a"
      range (range empty)
      date (date empty)
      symbol (symbol empty)
      tuple (tuple empty)
      operator (operator empty)
      lambda (lambda empty)
      function (function empty)
      array (@)
      object (@:)
      class (class empty) ((class empty) default)
    ),
    (for value in values
      assert value ($value;
    ),
  ),
  (should "($value ...) always intercepts the value as the subject." (=> ()
    var l (= () 1);
    assert ($l is l);
    assert ($l ?);

    var f (=> () 1);
    assert ($f is f);
    assert ($f is-not l);
    assert ($f ?);

    var op (=? () 1);
    assert ($op is op);
    assert ($op is-not l);
    assert ($op is-not f);
    assert ($op ?);

    assert null ($op call);
    assert ($($op :"is") is-a lambda;

    var obj (@ x:1);
    assert ($obj ?)
    assert ($obj is obj)
  ),
),

(define "(: ...) - explicit operation" (= ()
  (should "(:) returns null." (=> ()
    assert null (:);
  ),
  (should "(:non-operation) returns null." (=> ()
    assert null (: null);
    assert null (: type);
    assert null (: true);
    assert null (: false);
    assert null (: 1);
    assert null (: "a");
    assert null (: (` x);
    assert null (: (quote x y);
    assert null (: (unquote x y);
    assert null (: (@ 1 2 3);
    assert null (: (@ x: 1);
  ),
  (should "(:operation ...) invokes operation normally." (=> ()
    var value 1;
    assert 1 (:(=?() 1);
    assert 1 (:(=() 1);
    assert 1 (:(=>() value);

    let value 10;
    (var ops (@
      var op (=?() 10;
      var l (=() 10;
      var f (=>() value;
    ),
    (for op in ops
      (assert 10 (:op),
    ),
  ),
),

(define "(... : ...) - chain operation" (= ()
  (should "(`) returns (symbol empty)." (=> ()
    (assert (1 + 1 :> 1),
    (assert (+ 1 1 :> 1),
  ),
  (should "(` sym) returns the symbol with a key of sym." (=> ()
    (assert (symbol of "x") (` x),
    (assert (symbol of "x") (` x y),
  ),
),
