(define "($ ...) - explicit subject" (= ()
  (should "($) returns null." (=> ()
    assert null ($);
  ).
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
    ).
    (for value in values
      assert value ($value);
    ).
  ).
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
    assert ($($op :"is") is-a lambda);
    assert ($op "is":: is-a lambda);

    var obj (@ x:1);
    assert ($obj ?);
    assert ($obj is obj);
  ).
).

(define "(: ...) - explicit operation" (= ()
  (should "(:) returns null." (=> ()
    assert null (:);
  ).
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
  ).
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
    ).
    (for op in ops
      assert 10 (op);
      assert 10 (:op);
    ).
  ).
).

(define "(...:: ...) - chain operation" (= ()
  (should "(expr ...::) returns ($(expr ...) to-string)." (=> ()
    assert "1" (1::);
    assert "true" (1:: is 1::);

    assert "2" (++ 1::);
    assert "false" (++ 1:: is 1::);

    assert "1" (1 ++ ::);
    assert "true" (1 ++ :: is 1::);

    assert "3" (1 + 2::);
    assert "true" (1 + 2:: is 3::);

    assert "3" (+ 1 2::);
    assert "true" (+ 1 2:: is 3::);

    var sum (=() 100);
    assert "100" (sum::);
    assert "(= () 100)" ($sum::);
    assert "200" (sum:: + 100::);
    assert "300" (sum::+ 100:: + 100::);
    assert "400" (sum:: + 100:: + 100:: + 100::);
  ).
  (should "(expr ...:: opr ...) returns ($(expr ...) opr ...)." (=> ()
    var sum (=() 100);
    assert 200 (sum::  + 100);
    assert null ($sum::  + 100);
    assert 300 (sum:: + 100::+ 100);
    assert 500 (sum:: + 100:: + 100:: + 100 100);

    assert "100" (print ""::  + 100);
    assert "100100" (print "100"::  + 100);
    assert "100 101100" (print "100" 101::  + 100);

    assert 6 (1 + 2:: + 3);
    assert true (1 + 2:: + 3:: is 6);

    assert 6 (+ 1 2:: + 3);
    assert true (+ 1 2:: + 3:: is 6);
  ).
).
